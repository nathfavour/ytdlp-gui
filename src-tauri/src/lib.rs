use std::process::Command;
use serde::{Deserialize, Serialize};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[derive(Debug, Deserialize)]
struct DownloadOptions {
    url: String,
    format: String,
    quality: String,
    subtitles: bool,
    output_path: String,
}

#[tauri::command]
async fn start_download(options: DownloadOptions) -> Result<String, String> {
    let mut command = Command::new("yt-dlp");
    
    // Add base URL
    command.arg(&options.url);
    
    // Add format options
    match options.format.as_str() {
        "audio" => {
            command.arg("-x");
            command.arg("--audio-format").arg("mp3");
        },
        _ => {
            command.arg("-f");
            match options.quality.as_str() {
                "1080p" => command.arg("bestvideo[height<=1080]+bestaudio/best"),
                "720p" => command.arg("bestvideo[height<=720]+bestaudio/best"),
                "480p" => command.arg("bestvideo[height<=480]+bestaudio/best"),
                _ => command.arg("best"),
            };
        }
    };
    
    // Add subtitle option
    if options.subtitles {
        command.arg("--write-subs");
    }

    // Add output path
    if !options.output_path.is_empty() {
        command.arg("-o").arg(&options.output_path);
    }

    let output = command.output().map_err(|e| e.to_string())?;
    
    if output.status.success() {
        Ok("Download completed successfully".to_string())
    } else {
        Err("Download failed".to_string())
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, start_download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
