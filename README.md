Didn't plan on making this for ETVR, but now it is.

# How to run
This is how i run the UI. There definitely exists a better way.
### Requirements
- Python (for back-end)
- MiniConda (for back-end)
- Poetry (for back-end)
- pnpm
- Rust
- Node?

### Download
```
git clone --recurse-submodules https://github.com/MagicBOTAlex/learningTauri.git
cd learningTauri
git submodule add https://github.com/MagicBOTAlex/ETVR-Backend.git ETVR-Backend
conda env create -f environment.yml
```
#### Run
Use 2 consoles. 
First tauri
```
pnpm install
pnpm tauri dev
```
Second back-end
```
conda activate etvr
poetry -C ./ETVR-Backend install --no-root
cd ETVR-Backend
python build.py run
```

### Update
```
git fetch
git submodule update --init --recursive
```


![dragon-ball-goku](https://github.com/user-attachments/assets/60984fb0-7a5c-4335-bc15-998c5a0d8c22)
