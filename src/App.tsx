import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
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
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [processOutput, setProcessOutput] = useState('');

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Downloading...');
    try {
      const result = await invoke('start_download', { options });
      setProcessOutput(JSON.stringify(result));
      setStatus('Download complete!');
    } catch (error) {
      setProcessOutput(String(error));
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <main className={`container ${darkMode ? 'dark' : ''}`}>
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

          <div className="option-group">
            <label>Output Path</label>
            <input
              type="text"
              placeholder="Enter output path..."
              value={options.outputPath}
              onChange={(e) => setOptions({...options, outputPath: e.target.value})}
            />
          </div>
        </div>

        <button type="submit" className="download-button">
          Download
        </button>

        {status && <div className="status-message">{status}</div>}
      </form>

      <div className="theme-switcher">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Dark Mode
        </label>
      </div>

      <button onClick={() => setShowSidebar(!showSidebar)}>
        Toggle Logs
      </button>
      {showSidebar && (
        <aside className="sidebar">
          <pre>{processOutput}</pre>
        </aside>
      )}
    </main>
  );
}

export default App;
