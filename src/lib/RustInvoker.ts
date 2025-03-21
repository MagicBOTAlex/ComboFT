import { invoke } from '@tauri-apps/api/core';

export async function getCurrentDir(): Promise<string> {
    return await invoke<string>('get_current_dir');
}