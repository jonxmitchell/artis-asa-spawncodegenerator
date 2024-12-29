use crate::spawn_generator::{SpawnCommands, SpawnGenerator};
use std::path::PathBuf;
use tauri::command;

#[command]
pub async fn generate_commands(manifest_path: String) -> Result<SpawnCommands, String> {
    let generator = SpawnGenerator::new();
    let path = PathBuf::from(manifest_path);

    generator
        .generate_spawn_commands(&path)
        .map_err(|e| e.to_string())
}
