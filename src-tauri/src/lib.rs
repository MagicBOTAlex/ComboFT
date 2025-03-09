use pyo3::prelude::*;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


// Didn't work...
// struct SystemCameraInfo {
//     name: String,
//     index: i32
// }
// #[tauri::command]
// fn getSystemCameras() -> Vec<SystemCameraInfo> {
//     match Camera::list() {
//         Ok(cameras) => {
//             return cameras.iter().enumerate().map(|(index, name)| SystemCameraInfo {
//                 name: name.clone(),
//                 index: index as i32
//             }).collect()
//         }
//         Err(e) => return Vec::new()
//     }
// }

pub fn tauri_generate_context() -> tauri::Context {
    tauri::generate_context!()
}

#[pymodule(gil_used = false)]
#[pyo3(name = "ext_mod")]
pub mod ext_mod {
    use super::*;

    #[pymodule_init]
    fn init(module: &Bound<'_, PyModule>) -> PyResult<()> {
        pytauri::pymodule_export(
            module,
            // i.e., `context_factory` function of python binding
            |_args, _kwargs| Ok(tauri_generate_context()),
            // i.e., `builder_factory` function of python binding
            |_args, _kwargs| {
                let builder = tauri::Builder::default()
                    .plugin(tauri_plugin_opener::init())
                    .invoke_handler(tauri::generate_handler![greet]);
                Ok(builder)
            },
        )
    }
}