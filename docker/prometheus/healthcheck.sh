#!/bin/sh
r=`wget -T 15 -O - http://127.0.0.1:$1/$2 2>&1 | grep -o $4 | wc -l`

if [ $r -ne "$3" ]
  then
    echo "Failed"
    exit 1
  else
    echo "OK"
fi
exit 0
