// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use kacy::extract_key_payload;
use mki::{bind_any_key, Action, Keyboard};
use std::sync::{Arc, Mutex};
use tauri::{
    App, AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .system_tray(init_tray())
        .on_system_tray_event(handle_tray_event)
        .setup(init_global_input_listener)
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init_tray() -> SystemTray {
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let restart = CustomMenuItem::new("restart".to_string(), "Restart");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(restart)
        .add_item(quit);

    SystemTray::new().with_menu(tray_menu)
}

// define the payload struct
#[derive(Clone, serde::Serialize)]
struct Payload {
    key: String,
    original: Keyboard,
}

#[tauri::command]
fn emit_key_event(app: Arc<Mutex<AppHandle>>, key: Keyboard) {
    let app = app.lock().unwrap();
    app.emit_all("kbi", extract_key_payload(key)).unwrap();
}

fn init_global_input_listener<'a>(app: &'a mut App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = Arc::new(Mutex::new(app.app_handle()));
    bind_any_key(Action::handle_kb(move |key| {
        let handle = handle.clone();
        emit_key_event(handle, key);
    }));

    Ok(())
}

fn handle_tray_event<'a>(app: &'a AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => {
            let item_handle = app.tray_handle().get_item(&id);
            match id.as_str() {
                "quit" => app.exit(0),
                "restart" => app.restart(),
                "hide" => {
                    if let Some(window) = app.get_window("main") {
                        window.hide().expect("failed to hide window");
                        item_handle
                            .set_selected(true)
                            .expect("failed to select hide option");
                    }
                }
                other => {
                    eprintln!("unrecognized menu item {other}")
                }
            }
        }
        _ => {}
    }
}
