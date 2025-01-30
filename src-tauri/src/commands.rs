use crate::spawn_generator::{SpawnCommands, SpawnGenerator};
use std::fs::File;
use std::io::Write;
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

#[command]
pub async fn save_commands_to_file(path: String, commands: SpawnCommands) -> Result<(), String> {
    let mut file = File::create(path).map_err(|e| e.to_string())?;

    writeln!(
        file,
        "Generated Spawn Commands for ARK: Survival Ascended - Developed by Arti\n"
    )
    .map_err(|e| e.to_string())?;

    writeln!(file, "--- Engram Names ---").map_err(|e| e.to_string())?;
    for cmd in commands.engram_names {
        writeln!(file, "{}", cmd).map_err(|e| e.to_string())?;
    }

    writeln!(file, "\n--- Item Spawn Commands ---").map_err(|e| e.to_string())?;
    for cmd in commands.item_spawncodes {
        writeln!(file, "{}", cmd).map_err(|e| e.to_string())?;
    }

    writeln!(file, "\n--- Creature Spawn Commands ---").map_err(|e| e.to_string())?;
    for cmd in commands.creature_spawncodes {
        writeln!(file, "{}", cmd).map_err(|e| e.to_string())?;
    }

    writeln!(file, "\n--- Tamed Creature Spawn Commands ---").map_err(|e| e.to_string())?;
    for cmd in commands.tamed_creature_spawncodes {
        writeln!(file, "{}", cmd).map_err(|e| e.to_string())?;
    }

    Ok(())
}
