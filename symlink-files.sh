!/bin/bash
declare -a files=("init.vim" ".bashrc" ".functions.zsh" ".profile" 
                  ".valgrindrc" ".gitconfig" ".zshrc",
                  ".R")

## now loop through the above array
for file in "${files[@]}"
do
    rm -rf ~/$file
    ln -s ~/dotfiles/$file ~/$file   
   # or do whatever with individual element of the array
done

