<script>
    import { invoke } from '@tauri-apps/api/tauri'
  
    let name = ''
    let greetMsg = ''
  
    async function greet() {
      greetMsg = await invoke('greet', { name })
    }
</script>

<div>
<input id="greet-input" placeholder="Enter a name..." bind:value="{name}" />
<button class="btn btn-outline" on:click="{greet}">Greet</button>
<p>{greetMsg}</p>
</div>