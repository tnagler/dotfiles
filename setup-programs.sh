#!/bin/bash

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
sudo apt install -y libclang-dev clang clang-tools-10
sudo update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-10 100
sudo apt install -y cmake doxygen graphviz
sudo apt install -y libboost-dev libeigen3-dev 


#### R
sudo add-apt-repository 'deb https://cloud.r-project.org/bin/linux/ubuntu focal-cran40/'
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E298A3A825C0D65DFD57CBB651716619E084DAB9
sudo apt update
gpg -a --export E298A3A825C0D65DFD57CBB651716619E084DAB9 | sudo apt-key add -
sudo apt install r-base r-base-core r-recommended r-base-dev

#### Python
sudo apt install -y python3 python3-pip python3-setuptools
pip3 install wheel

#### Web
sudo apt install -y hugo

## Misc -----------------

#### TeX
sudo apt install -y texlive-full

#### Fonts
sudo apt install -y fonts-open-sans


## Symlinks ------------

ln -s /data/music-current/ ~/Desktop/music-current
ln -s /data/dev/ ~/dev
ln -s /data/teaching/ ~/teaching
ln -s /data/papers/ ~/papers
ln -s /data/research/ ~/research

## usb driver

git clone git@github.com:cilynx/rtl88x2bu.git
cd rtl88x2bu
VER=$(sed -n 's/\PACKAGE_VERSION="\(.*\)"/\1/p' dkms.conf)
sudo rsync -rvhP ./ /usr/src/rtl88x2bu-${VER}
sudo dkms add -m rtl88x2bu -v ${VER}
sudo dkms build -m rtl88x2bu -v ${VER}
sudo dkms install -m rtl88x2bu -v ${VER}
sudo modprobe 88x2bu

