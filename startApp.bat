:: Idk, which packages you'd need, so this this still unfinished. But works on my machine lol

call .venv/scripts/activate.bat
uv pip install -r src-tauri/pyproject.toml

pnpm install
pnpm tauri dev

cmd /k