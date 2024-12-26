import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

interface DownloadOptions {
  url: string;
  format: 'video' | 'audio';
  quality: string;
  subtitles: boolean;
  outputPath: string;
}

function App() {
  const [options, setOptions] = useState<DownloadOptions>({
    url: '',
    format: 'video',
    quality: '1080p',
    subtitles: false,
    outputPath: ''
  });
  const [status, setStatus] = useState('');

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Downloading...');
    try {
      const result = await invoke('start_download', { options });
      setStatus('Download complete!');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <main className="container">
      <h1>YT-DLP GUI</h1>
      <form onSubmit={handleDownload} className="download-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter video URL..."
            value={options.url}
            onChange={(e) => setOptions({...options, url: e.target.value})}
          />
        </div>

        <div className="options-grid">
          <div className="option-group">
            <label>Format</label>
            <select
              value={options.format}
              onChange={(e) => setOptions({...options, format: e.target.value as 'video' | 'audio'})}
            >
              <option value="video">Video</option>
              <option value="audio">Audio Only</option>
            </select>
          </div>

          <div className="option-group">
            <label>Quality</label>
            <select
              value={options.quality}
              onChange={(e) => setOptions({...options, quality: e.target.value})}
            >
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
              <option value="best">Best</option>
            </select>
          </div>

          <div className="option-group">
            <label>
              <input
                type="checkbox"
                checked={options.subtitles}
                onChange={(e) => setOptions({...options, subtitles: e.target.checked})}
              />
              Download Subtitles
            </label>
          </div>
        </div>

        <button type="submit" className="download-button">
          Download
        </button>

        {status && <div className="status-message">{status}</div>}
      </form>
    </main>
  );
}

export default App;
