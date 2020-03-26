#!/bin/bash
# NOTE: this script is used to deploy all addons to a VPS using IPFS.
# it is assumed that the stremio-addon-sdk & addons are already installed and configured at the respective locations.
# I recommend to not randomly run this script, unless your name is Sleeyax.

echo "starting ipfs deamon"
screen -dmS ipfs-daemon ipfs daemon --enable-gc
sleep 5

echo "starting ipfs supernode daemon"
screen -dmS ipfs-supernode-daemon bash -c "IPFS_PATH=~/.ipfs-supernode ipfs daemon --enable-gc"
sleep 5
screen -dmS supernode bash -c "PORT=80 IPFS_MULTIADDR=/ip4/127.0.0.1/tcp/5002 node ~/stremio/sdk/cli/supernode.js"


declare -A addons=(
    ["dlive"]=7000
    ["horriblesubs"]=7001
    ["rarbg"]=7002
    ["podcasts"]=7003
    ["1337x"]=7004
    ["asmr-from-tingles"]=7005
    ["SQF"]=7006
)

for addon in "${!addons[@]}";
do 
    echo "starting $addon"
    dir=~/stremio/addons/$addon
    script=src/server.js
    entry=$dir/$script
    if [ ! -f $entry ]; then
        script=build/server.js;
    fi
    screen -dmS stremio-$addon-addon bash -c "cd $dir && node $script ${addons[$addon]}"
    screen -dmS ipfs-stremio-$addon-addon node ~/stremio/sdk/cli/publish.js http://127.0.0.1:${addons[$addon]}/manifest.json --supernode ws://127.0.0.1:80;
done

echo "done!"

screen -ls
