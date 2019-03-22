## Upgrade default install ----------

sudo apt update
sudo apt upgrade
sudo apt install -y xclip wget curl


## Web ----------

#### Chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update
sudo apt install -y google-chrome-stable

#### Chat
sudo apt install -y skypeforlinux telegram-desktop

#### Todoist
TEMP_DEB="$(mktemp)"
wget -O "$TEMP_DEB" 'https://github.com/KryDos/todoist-linux/releases/download/1.15/Todoist.deb'
sudo dpkg -i "$TEMP_DEB"
rm -f "$TEMP_DEB"

#### Git
sudo apt install -y git
ssh-keygen -t rsa -b 4096 -C "mail@tnagler.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
xclip -sel clip < ~/.ssh/id_rsa.pub  # -> add on github.com

#### ZSH
sudo apt install -y zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
git clone https://github.com/zsh-users/zsh-autosuggestions \
    ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting \
    ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting

#### Dotfiles
git clone git@github.com:tnagler/dotfiles.git ~/dotfiles
chmod +x ~/dotfiles/symlink-files.sh
~/dotfiles/symlink-files.sh
chsh -s /bin/zsh

## Programming ----------

#### C++
sudo apt install -y build-essential
sudo apt install -y libclang-dev clang clang-tools
sudo apt install -y cmake

#### R
sudo add-apt-repository -y ppa:marutter/rrutter3.5
sudo apt update
sudo apt install -y r-base r-base-dev
sudo apt install -y libcurl4-openssl-dev libssl-dev libxml2-dev  # for tidyverse packagews
sudo apt install -y libgsl-dev  # for VineCopula 

##### Python
sudo apt install -y python3 python3-pip python3-setuptools

#### Neovim
sudo apt install -y neovim
curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
mkdir -p ~/.config/nvim
ln -nfs ~/dotfiles/init.vim ~/.config/nvim/init.vim
nvim +PlugInstall


## Misc -----------------

#### TeX
sudo apt install -y texlive-full

#### Fonts
sudo apt install -y fonts-open-sans


## Symlinks ------------

ln -s /data/music-current/ ~/Desktop/music-current

