Didn't plan on making this for ETVR, but now it is.

# How to run
This is how i run the UI. There definitely exists a better way.
### Requirements
- Python
- MiniConda (for back-end)
- pnpm
- Node?

### Download
```
git clone --recurse-submodules https://github.com/MagicBOTAlex/learningTauri.git
conda env create -f environment.yml
conda activate etvr
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
python ./ETVR-Backend/build.py run
```

### Update
```
git fetch
git submodule update --init --recursive
```


![dragon-ball-goku](https://github.com/user-attachments/assets/60984fb0-7a5c-4335-bc15-998c5a0d8c22)
