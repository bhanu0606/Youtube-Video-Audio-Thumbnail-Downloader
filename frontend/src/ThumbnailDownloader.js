import React, { useState } from "react";
import axios from "axios";
import "./ThumbnailDownloader.css";

function ThumbnailDownloader({ url }) {
    const [thumbnail, setThumbnail] = useState(null);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGetThumbnail = async () => {
        if (!url.trim()) {
            setStatus("❌ Please enter a valid YouTube URL");
            return;
        }

        setIsLoading(true);
        setStatus("⏳ Fetching thumbnail...");

        try {
            const response = await axios.get(`http://localhost:5000/thumbnail?url=${encodeURIComponent(url)}`, {
                responseType: "blob",
            });

            // Create a blob URL from the response
            const blob = new Blob([response.data], { type: "image/jpeg" });
            const blobUrl = URL.createObjectURL(blob);
            setThumbnail(blobUrl);
            setStatus("✅ Thumbnail fetched!");
        } catch (error) {
            console.error("Error fetching thumbnail:", error);
            setStatus("❌ Failed to fetch thumbnail");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadThumbnail = () => {
        if (!thumbnail) {
            setStatus("❌ No thumbnail available to download");
            return;
        }

        try {
            // Create a link element
            const link = document.createElement("a");
            link.href = thumbnail;
            link.download = "youtube-thumbnail.jpg";

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setStatus("✅ Thumbnail downloaded successfully!");
        } catch (error) {
            console.error("Error downloading thumbnail:", error);
            setStatus("❌ Failed to download thumbnail");
        }
    };

    // Cleanup blob URLs when component unmounts
    React.useEffect(() => {
        return () => {
            if (thumbnail) {
                URL.revokeObjectURL(thumbnail);
            }
        };
    }, [thumbnail]);

    return (
        <>
            <div className="thumbnail-container">
                <button
                    onClick={handleGetThumbnail}
                    className="fetch-btn"
                    disabled={isLoading}
                >
                    {isLoading ? "Fetching..." : "Get Thumbnail"}
                </button>

                {thumbnail && (
                    <div className="thumbnail-preview">
                        <img
                            src={thumbnail}
                            alt="YouTube Thumbnail"
                            onError={() => {
                                setThumbnail(null);
                                setStatus("❌ Failed to load thumbnail image");
                            }}
                        />
                        <button
                            onClick={handleDownloadThumbnail}
                            className="download-btn"
                        >
                            Download Thumbnail
                        </button>
                    </div>
                )}

                {status && (
                    <p
                        className={`status ${
                            status.includes("✅") ? "success" : "error"
                        }`}
                    >
                        {status}
                    </p>
                )}
            </div>

            {/* Fullscreen Section for How-To and Features */}
            <div className="fullscreen-section">
                <h3>How to Use</h3>
                <ol>
                    <li>Enter the YouTube URL in the input field above.</li>
                    <li>Click the "Get Thumbnail" button to fetch the thumbnail.</li>
                    <li>Preview the fetched thumbnail below.</li>
                    <li>Click the "Download Thumbnail" button to save it.</li>
                </ol>

                <h3>Features</h3>
                <ul>
                    <li>Fetch high-quality YouTube video thumbnails.</li>
                    <li>Preview thumbnails before downloading.</li>
                    <li>Download thumbnails in JPEG format.</li>
                    <li>Fast and reliable thumbnail fetching.</li>
                </ul>
            </div>
        </>
    );
}

export default ThumbnailDownloader;