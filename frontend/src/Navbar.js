import React from "react";
import "./Navbar.css";

function Navbar({ currentTheme, changeTheme }) {
    const handleThemeToggle = () => {
        changeTheme(currentTheme === "light" ? "dark" : "light");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Navbar Title */}
                <div className="navbar-title">YouTube Downloader</div>

                {/* Right Section: YouTube Button and Theme Toggle */}
                <div className="navbar-right">
                    {/* YouTube Button */}
                    <a
                        href="https://www.youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="youtube-button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="currentColor"
                            className="bi bi-youtube"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12.2439 4C12.778 4.00294 14.1143 4.01586 15.5341 4.07273L16.0375 4.09468C17.467 4.16236 18.8953 4.27798 19.6037 4.4755C20.5486 4.74095 21.2913 5.5155 21.5423 6.49732C21.942 8.05641 21.992 11.0994 21.9982 11.8358L21.9991 11.9884L21.9991 11.9991C21.9991 11.9991 21.9991 12.0028 21.9991 12.0099L21.9982 12.1625C21.992 12.8989 21.942 15.9419 21.5423 17.501C21.2878 18.4864 20.5451 19.261 19.6037 19.5228C18.8953 19.7203 17.467 19.8359 16.0375 19.9036L15.5341 19.9255C14.1143 19.9824 12.778 19.9953 12.2439 19.9983L12.0095 19.9991L11.9991 19.9991C11.9991 19.9991 11.9956 19.9991 11.9887 19.9991L11.7545 19.9983C10.6241 19.9921 5.89772 19.941 4.39451 19.5228C3.4496 19.2573 2.70692 18.4828 2.45587 17.501C2.0562 15.9419 2.00624 12.8989 2 12.1625V11.8358C2.00624 11.0994 2.0562 8.05641 2.45587 6.49732C2.7104 5.51186 3.45308 4.73732 4.39451 4.4755C5.89772 4.05723 10.6241 4.00622 11.7545 4H12.2439ZM9.99911 8.49914V15.4991L15.9991 11.9991L9.99911 8.49914Z"
                            ></path>
                        </svg>
                        <span>YouTube</span>
                    </a>

                    {/* Theme Toggle Switch */}
                    <label className="switch" htmlFor="theme-switch">
                        <input
                            id="theme-switch"
                            type="checkbox"
                            className="circle"
                            checked={currentTheme === "dark"}
                            onChange={handleThemeToggle}
                        />
                        <svg
                            viewBox="0 0 384 512"
                            xmlns="http://www.w3.org/2000/svg"
                            className="moon svg"
                        >
                            <path
                                d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
                            ></path>
                        </svg>
                        <div className="sun svg">
                            <span className="dot"></span>
                        </div>
                    </label>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;