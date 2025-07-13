import React from "react";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-description">
                    YouTube Downloader is a simple and efficient tool to download videos and audio from YouTube.
                    Built with <span role="img" aria-label="love">❤️</span> for educational purposes.
                </p>
                <div className="footer-socials">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i> GitHub
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter"></i> Twitter
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin"></i> LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;