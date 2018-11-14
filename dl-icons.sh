#!/bin/bash

#set -x  # echo on

iconarchive_downloader_sh="~/repo/lang/sh/iconarchive-downloader-sh/iconarchive.sh"
eval iconarchive_downloader_sh=$iconarchive_downloader_sh

output_dir="./images/icons"
[ -d "$output_dir" ] && rm -rf ./images/icons/*
[ -d "$output_dir" ] || mkdir -p "$output_dir"

# http://www.iconarchive.com/show/ravenna-3d-icons-by-double-j-design.html
function ravenna_3d_icons_by_double_j_design() {
	base_url="http://www.iconarchive.com/show/ravenna-3d-icons-by-double-j-design"

	"$iconarchive_downloader_sh" -u="$base_url/File-Copy-icon.html" -o="$output_dir" -s="16,24,32,128"
}

ravenna_3d_icons_by_double_j_design
