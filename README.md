Didn't plan on making this for ETVR, but now it is.

# How to run
This is how i run the UI. There definitely exists a better way.
### Requirements
- Python (for back-end)
- MiniConda or poetry (for back-end)
- pnpm
- Rust
- Node?

## Linux Mint
```
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```
Then continue with the commands below.

## Windows
Check: https://v2.tauri.app/start/prerequisites/#windows \
Then continue with the commands below.


### Download
```
git clone --recurse-submodules https://github.com/MagicBOTAlex/learningTauri.git
cd learningTauri
git submodule add https://github.com/MagicBOTAlex/ETVR-Backend.git ETVR-Backend

:: You can either use conda or poetry, but I use conda on my Windows, and I use poetry on my Linux mint
conda env create -f environment.yml
```
#### Run
Use 2 consoles. 
First tauri
```
pnpm install
pnpm tauri dev
```
back-end:
```
conda activate etvr
:: or
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
