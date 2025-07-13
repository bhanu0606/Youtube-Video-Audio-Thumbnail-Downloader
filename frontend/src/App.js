import React, { useState } from "react";
import VideoDownloader from "./VideoDownloader";
import AudioDownloader from "./AudioDownloader";
import ThumbnailDownloader from "./ThumbnailDownloader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./App.css";

function App() {
    const [url, setUrl] = useState("");
    const [activeTab, setActiveTab] = useState("video");
    const [theme, setTheme] = useState("light"); // Default to light theme

    const themes = ["light", "dark"]; // Only light and dark themes

    const changeTheme = (selectedTheme) => {
        setTheme(selectedTheme);
    };

    return (
        <div className={`app ${theme}`}>
            <Navbar themes={themes} currentTheme={theme} changeTheme={changeTheme} />
            <header className="header">
                <h1 className="app-title">YouTube Video & Audio Downloader</h1>
                <p className="app-description">
                    Download your favorite YouTube videos and audio in high quality with ease.
                </p>
            </header>
            
            <div className="url-input-container">
                <input
                    type="text"
                    placeholder="Enter YouTube URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="url-input"
                />
            </div>

            <div className="tab-buttons">
                <button
                    className={`tab ${activeTab === "video" ? "active" : ""}`}
                    onClick={() => setActiveTab("video")}
                >
                    Video
                </button>
                <button
                    className={`tab ${activeTab === "audio" ? "active" : ""}`}
                    onClick={() => setActiveTab("audio")}
                >
                    Audio
                </button>
                <button
                    className={`tab ${activeTab === "thumbnail" ? "active" : ""}`}
                    onClick={() => setActiveTab("thumbnail")}
                >
                    Thumbnail
                </button>
            </div>

            <div className="content">
                {activeTab === "video" && <VideoDownloader url={url} format="video" />}
                {activeTab === "audio" && <AudioDownloader url={url} />}
                {activeTab === "thumbnail" && <ThumbnailDownloader url={url} />}
            </div>

            <Footer />
        </div>
    );
}

export default App;