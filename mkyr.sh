#!/bin/bash

if [ "$1" == "" ]; then
  echo "Make year"
  echo "  usage: './mkyr.sh <year>'"
  echo "  e.g. './mkyr.sh 2019'"
  exit 1;
fi;

mkdir $1
cd $1

for i in {01..25}
do
  mkdir "day-$i"
  cp -a ../templates/day/. "day-$i"
done

echo "created year $1"
