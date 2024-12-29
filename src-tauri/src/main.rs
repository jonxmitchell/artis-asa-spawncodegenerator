// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_context_menu::init as init_context_menu;

fn main() {
    tauri::Builder::default()
        .plugin(init_context_menu())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
