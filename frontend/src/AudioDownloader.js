import React, { useState } from "react";
import axios from "axios";
import "./AudioDownloader.css";

function AudioDownloader({ url }) {
    const [quality, setQuality] = useState("highest");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        if (!url.trim()) {
            setStatus("❌ Please enter a valid YouTube URL");
            return;
        }

        setIsLoading(true);
        setStatus("⏳ Downloading...");

        try {
            const response = await axios.get(
                `http://localhost:5000/download?url=${encodeURIComponent(url)}&format=audio&quality=${quality}`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "audio/mpeg" });
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", "audio.mp3");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(downloadUrl);
            setStatus("✅ Audio downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            setStatus("❌ Download failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const qualityOptions = [
        { value: "highest", label: "High" },
        { value: "320", label: "320 kbps" },
        { value: "256", label: "256 kbps" },
        { value: "192", label: "192 kbps" },
        { value: "128", label: "128 kbps" },
    ];

    return (
        <div className="audio-downloader">
            <div className="quality-options">
                <h3>Select Audio Quality</h3>
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
                className="download-btn"
                disabled={isLoading}
            >
                <span className="button-content">
                    {isLoading ? "Downloading..." : "Download Audio"}
                </span>
            </button>

            {status && (
                <p className={`status ${status.includes("✅") ? "success" : "error"}`}>
                    {status}
                </p>
            )}
        </div>
    );
}

export default AudioDownloader;
