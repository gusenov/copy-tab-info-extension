#!/bin/bash

version=$(jq --raw-output '.version' manifest.json)

release="CopyTabInfo-$version.zip"

if [ ! -f $release ]; then
    :
else
    rm $release
fi

# find . -type f -not -path "./.git/*"
zip --quiet -r $release \
                "node_modules/seq-exec/seq-exec.js" \
                "node_modules/utils4js/clipboard.js" \
                "images/icons/icons.iconarchive.com/icons/double-j-design/ravenna-3d/32/File-Copy-icon.png" \
                "images/icons/icons.iconarchive.com/icons/double-j-design/ravenna-3d/16/File-Copy-icon.png" \
                "images/icons/icons.iconarchive.com/icons/double-j-design/ravenna-3d/24/File-Copy-icon.png" \
                "popup.html" \
                "popup.js" \
                "manifest.json"

echo $release
