const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const ytdl = require("@distube/ytdl-core");
const axios = require("axios");
const helmet = require("helmet");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

const downloadFolder = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder);
}

// Helper function to get the best format
const getBestFormat = (formats, formatType, quality) => {
    if (formatType === 'audio') {
        return formats
            .filter(format => format.hasAudio && !format.hasVideo)
            .sort((a, b) => {
                if (quality === 'highest') return b.audioBitrate - a.audioBitrate;
                return Math.abs(b.audioBitrate - parseInt(quality) * 1000) - 
                       Math.abs(a.audioBitrate - parseInt(quality) * 1000);
            })[0];
    } else {
        return formats
            .filter(format => format.hasVideo && format.hasAudio)
            .sort((a, b) => {
                if (quality === 'highest') return b.height - a.height;
                return Math.abs(b.height - parseInt(quality)) - 
                       Math.abs(a.height - parseInt(quality));
            })[0];
    }
};

// 🎥 Video/Audio Download Route with Quality Selection
app.get("/download", async (req, res) => {
    try {
        const { url, format, quality } = req.query;
        
        if (!url || !format) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        const videoTitle = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, ""); // Clean filename
        const formats = info.formats;
        const bestFormat = getBestFormat(formats, format, quality);

        if (!bestFormat) {
            return res.status(400).json({ error: 'No suitable format found' });
        }

        res.setHeader('Content-Type', format === 'audio' ? 'audio/mpeg' : 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${videoTitle}.${format === 'audio' ? 'mp3' : 'mp4'}"`);

        const stream = ytdl.downloadFromInfo(info, {
            format: bestFormat,
            quality: 'highest',
            filter: format === 'audio' ? 'audioonly' : 'audioandvideo'
        });

        stream.on('error', (error) => {
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Stream error occurred' });
            }
        });

        stream.pipe(res);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Download failed' });
    }
});

// 🖼 Thumbnail Fetch Route
app.get("/thumbnail", async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        
        // Get all available thumbnails
        const thumbnails = info.videoDetails.thumbnails;
        
        // Find the highest quality thumbnail
        // YouTube thumbnails typically have these qualities: maxresdefault, sddefault, hqdefault, mqdefault, default
        const qualityOrder = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
        let thumbnailUrl = null;

        // First try to find maxresdefault
        for (const quality of qualityOrder) {
            const thumbnail = thumbnails.find(t => t.quality === quality);
            if (thumbnail) {
                // Try to get WebP version first (higher quality)
                thumbnailUrl = thumbnail.url.replace('.jpg', '.webp');
                break;
            }
        }

        // If no specific quality found, use the last one (usually highest quality)
        if (!thumbnailUrl && thumbnails.length > 0) {
            thumbnailUrl = thumbnails[thumbnails.length - 1].url.replace('.jpg', '.webp');
        }

        if (!thumbnailUrl) {
            return res.status(404).json({ error: 'No thumbnail found' });
        }

        // Fetch the thumbnail image with high quality settings
        const response = await axios.get(thumbnailUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/,/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.youtube.com/',
                'Origin': 'https://www.youtube.com'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        // Set the appropriate headers for high quality
        res.set({
            'Content-Type': 'image/webp',
            'Content-Length': response.data.length,
            'Cache-Control': 'public, max-age=31536000',
            'Content-Disposition': 'inline; filename="thumbnail.webp"'
        });

        // Send the image data directly
        res.send(response.data);

    } catch (error) {
        console.error('Thumbnail error:', error);
        res.status(500).json({ error: 'Failed to fetch thumbnail' });
    }
});

// 📥 Thumbnail Download Route
app.get("/download-thumbnail", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        const thumbnails = info.videoDetails.thumbnails;
        
        // Find the highest quality thumbnail
        const qualityOrder = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
        let thumbnailUrl = null;

        // First try to find maxresdefault
        for (const quality of qualityOrder) {
            const thumbnail = thumbnails.find(t => t.quality === quality);
            if (thumbnail) {
                // Try to get WebP version first (higher quality)
                thumbnailUrl = thumbnail.url.replace('.jpg', '.webp');
                break;
            }
        }

        if (!thumbnailUrl && thumbnails.length > 0) {
            thumbnailUrl = thumbnails[thumbnails.length - 1].url.replace('.jpg', '.webp');
        }

        if (!thumbnailUrl) {
            return res.status(404).json({ error: 'No thumbnail found' });
        }

        // Fetch the thumbnail image with high quality settings
        const response = await axios.get(thumbnailUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.youtube.com/',
                'Origin': 'https://www.youtube.com'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        // Set headers for download
        res.set({
            'Content-Type': 'image/webp',
            'Content-Length': response.data.length,
            'Content-Disposition': `attachment; filename="${info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_thumbnail.webp"`,
            'Cache-Control': 'public, max-age=31536000'
        });

        res.send(response.data);
    } catch (error) {
        console.error("❌ Thumbnail Download Error:", error);
        res.status(500).json({ error: "Failed to download thumbnail" });
    }
});

// 🧹 Cleanup Downloads Folder
const cleanupInterval = 3600000; // 1 hour
setInterval(() => {
    fs.readdir(downloadFolder, (err, files) => {
        if (err) return console.error("❌ Cleanup Error:", err);
        files.forEach((file) => {
            const filePath = path.join(downloadFolder, file);
            fs.unlink(filePath, (err) => {
                if (err) console.error("❌ File Deletion Error:", err);
            });
        });
    });
}, cleanupInterval);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("✅ Server running on port", PORT));
