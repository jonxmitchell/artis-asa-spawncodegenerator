#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod spawn_generator;

use commands::{generate_commands, save_commands_to_file};
use tauri_plugin_context_menu::init as init_context_menu;

fn main() {
    tauri::Builder::default()
        .plugin(init_context_menu())
        .invoke_handler(tauri::generate_handler![
            generate_commands,
            save_commands_to_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
