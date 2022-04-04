#!/usr/bin/env bash
set -euo pipefail
shopt -s inherit_errexit

apt-get update
apt-get install -y curl

curl -L https://github.com/sharkdp/hyperfine/releases/download/v1.13.0/hyperfine_1.13.0_amd64.deb -o hyperfine.deb
dpkg -i ./hyperfine.deb

curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
bash n lts
npm install -g n
