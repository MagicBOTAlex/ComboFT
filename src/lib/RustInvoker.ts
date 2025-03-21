import { invoke } from '@tauri-apps/api/core';

export async function getCurrentDir(): Promise<string> {
    return await invoke<string>('get_current_dir');
}

export async function updateJsonProp(jsonPath: string, key: Record<string, any>) {
    try {
      await invoke("update_json_properties", {
        filePath: jsonPath,
        updatesJson: JSON.stringify(key)
      });
      console.log("JSON updated successfully.");
    } catch (error) {
      console.error("Failed to update JSON:", error);
    }
}

export async function getJsonProp(jsonPath: string, keyPath: string): Promise<any> {
    try {
      const value = await invoke("get_json_value", {
        filePath: jsonPath,
        keyPath: keyPath
      });
      return value;
    } catch (error) {
      console.error("Failed to get JSON value:", error);
      return null;
    }
}