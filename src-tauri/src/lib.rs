use serde_json::{Map, Value};
use serialport::available_ports;
use std::fs;

#[tauri::command]
fn update_json_properties(file_path: String, updates_json: String) -> Result<(), String> {
    // Read the file
    let data = fs::read_to_string(&file_path).map_err(|e| e.to_string())?;
    let mut json: Value = serde_json::from_str(&data).map_err(|e| e.to_string())?;

    // Parse the update JSON
    let updates: Value = serde_json::from_str(&updates_json).map_err(|e| e.to_string())?;

    // Merge the updates recursively
    merge_json(&mut json, &updates);

    // Write back to the file
    let updated = serde_json::to_string_pretty(&json).map_err(|e| e.to_string())?;
    fs::write(&file_path, updated).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn get_json_value(file_path: String, key_path: String) -> Result<Value, String> {
    // Read and parse the JSON file
    let data = fs::read_to_string(&file_path).map_err(|e| e.to_string())?;
    let json: Value = serde_json::from_str(&data).map_err(|e| e.to_string())?;

    // Traverse using dot-separated path
    let value = key_path
        .split('.')
        .fold(Some(&json), |acc, key| acc?.get(key))
        .ok_or("Key not found")?;

    Ok(value.clone())
}

fn merge_json(target: &mut Value, updates: &Value) {
    match (target, updates) {
        (Value::Object(target_map), Value::Object(update_map)) => {
            for (key, value) in update_map {
                match target_map.get_mut(key) {
                    Some(existing_value) => merge_json(existing_value, value),
                    None => {
                        target_map.insert(key.clone(), value.clone());
                    }
                }
            }
        }
        (target, updates) => {
            *target = updates.clone();
        }
    }
}

#[tauri::command]
fn get_list_of_serial() -> Vec<String> {
    match available_ports() {
        Ok(ports) => {
            if ports.is_empty() {
                println!("No serial devices found.");
                return Vec::new();
            } else {
                return ports
                    .iter()
                    .filter(|&x| {
                        x.port_name.starts_with("COM") || x.port_name.starts_with("/dev/tty")
                    })
                    .map(|x| x.port_name.clone())
                    .collect();
            }
        }
        Err(_) => Vec::new(),
    }
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_current_dir() -> String {
    std::env::current_dir()
        .map(|p| p.display().to_string())
        .unwrap_or_else(|_| "Failed to get current dir".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            update_json_properties,
            get_list_of_serial,
            get_json_value,
            get_current_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
