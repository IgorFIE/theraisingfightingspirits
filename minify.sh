#!/bin/bash

props=(
);
mainJS=$(cat dist/main.js);
minifiedMainJsPath="dist/main_min.js";
minifiedConvertionPath="dist/main_min_convertion.txt"
minifiedConvertion=""

removeFile(){
  if [ -f $1 ]; then
    echo "Removing file $1"
    rm $1;
fi  
}

getRandomString(){
    randomString=$(cat /dev/urandom | tr -dc 'a-zA-Z' | fold -w 4 | head -n 1);
    if [[ $mainJS == *randomString* ]]; then
        echo $(getRandomString)
    fi
    echo $randomString
}

removeFile $minifiedMainJsPath
removeFile $minifiedConvertionPath

for prop in "${props[@]}"; do
   name=$(getRandomString)
    echo "prop=$prop || $name"
    minifiedConvertion=$minifiedConvertion"prop=$prop || value=$name\n"
    mainJS="${mainJS//${prop}/${name}}";
done

echo $mainJS >> $minifiedMainJsPath;
echo -e $minifiedConvertion >> $minifiedConvertionPath;

sleep 2