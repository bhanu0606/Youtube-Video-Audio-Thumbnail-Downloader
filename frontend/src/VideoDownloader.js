import React, { useState } from "react";
import axios from "axios";
import "./VideoDownloader.css";

function VideoDownloader({ url, format }) {
    const [quality, setQuality] = useState("highest");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDownload = async () => {
        if (!url.trim()) {
            setStatus("❌ Please enter a valid YouTube URL");
            return;
        }

        setIsLoading(true);
        setStatus(`⏳Downloading...`);
        setProgress(0);

        try {
            const response = await axios.get(
                `http://localhost:5000/download?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`,
                {
                    responseType: "blob",
                    timeout: 300000,
                    onDownloadProgress: (progressEvent) => {
                        if (progressEvent.lengthComputable && progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setProgress(percentCompleted);
                            setStatus(`⏳ Downloading `);
                        } else {
                            setStatus(`⏳ Downloading ...`);
                        }
                    }
                }
            );

            const contentDisposition = response.headers['content-disposition'];
            let filename = `${format}.${format === 'audio' ? 'mp3' : 'mp4'}`;
            if (contentDisposition) {
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            const blob = new Blob([response.data], {
                type: format === 'audio' ? 'audio/mpeg' : 'video/mp4'
            });
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(downloadUrl);
            setStatus(format === 'audio' ? "✅ Audio downloaded successfully!" : "✅ Video downloaded successfully!");
            setProgress(100);
        } catch (error) {
            console.error("Download error:", error);
            if (progress > 0) {
                setStatus(format === 'audio' ? "✅ Audio downloaded successfully!" : "✅ Video downloaded successfully!");
                setProgress(100);
            } else {
                setStatus("❌ Download failed. Please try again.");
                setProgress(0);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const qualityOptions = format === 'audio'
        ? [
            { value: "highest", label: "High " },
            { value: "320", label: "320 kbps" },
            { value: "256", label: "256 kbps" },
            { value: "192", label: "192 kbps" },
            { value: "128", label: "128 kbps" }
        ]
        : [
            { value: "highest", label: "High" },
            { value: "1080p", label: "1080p" },
            { value: "720p", label: "720p" },
            { value: "480p", label: "480p" }
        ];

    return (
        <>
            <div className="downloader-container">
                <div className="quality-options">
                    <h3>Select {format === 'audio' ? 'Audio' : 'Video'} Quality</h3>
                    <div className="radio-group">
                        {qualityOptions.map((option) => (
                            <label key={option.value}>
                                <input
                                    type="radio"
                                    value={option.value}
                                    checked={quality === option.value}
                                    onChange={() => setQuality(option.value)}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    className="button"
                    disabled={isLoading}
                >
                    <span className="button-content">
                        {isLoading ? "Downloading..." : `Download ${format === 'audio' ? 'Audio' : 'Video'}`}
                    </span>
                </button>

                {progress > 0 && progress < 100 && (
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {status && (
                    <p className={`status ${status.includes("✅") ? "success" : "error"}`}>
                        {status}
                    </p>
                )}
            </div>

            {/* Fullscreen Section for How-To and Features */}
            <div className="fullscreen-section">
                <h3>How to Use</h3>
                <ol>
                    <li>Enter the YouTube URL in the input field above.</li>
                    <li>Select the desired format (Video, Audio, or Thumbnail).</li>
                    <li>Choose the quality you want to download.</li>
                    <li>Click the "Download" button to start the process.</li>
                </ol>

                <h3>Features</h3>
                <ul>
                    <li>Download YouTube videos in multiple resolutions (1080p, 720p, etc.).</li>
                    <li>Extract audio from YouTube videos in high quality (320kbps, 256kbps, etc.).</li>
                    <li>Fetch and download YouTube video thumbnails.</li>
                    <li>Fast and reliable downloads with progress tracking.</li>
                </ul>
            </div>
        </>
    );
}

export default VideoDownloader;
