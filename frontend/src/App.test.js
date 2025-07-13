import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/YouTube Video & Audio Downloader/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders URL input field', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter YouTube URL/i);
  expect(inputElement).toBeInTheDocument();
});

test('renders format selection buttons', () => {
  render(<App />);
  const videoButton = screen.getByText(/Video/i);
  const audioButton = screen.getByText(/Audio/i);
  expect(videoButton).toBeInTheDocument();
  expect(audioButton).toBeInTheDocument();
});
