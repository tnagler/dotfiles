#!/bin/bash

for f in $(ls -d ~/dotfiles/*); do ln -s $f ~/; done
for f in $(ls -d ~/dotfiles/.* | grep -v "git"); do ln -s $f ~/; done
ln -s ~/dotfiles/.gitconfig ~/.gitconfig
