use serialport::available_ports;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![get_list_of_serial])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
