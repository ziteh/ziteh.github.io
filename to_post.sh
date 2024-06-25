#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <filename_without_extension>"
  exit 1
fi

git mv ./source/_drafts/"$1".md ./source/_posts/"$1".md
