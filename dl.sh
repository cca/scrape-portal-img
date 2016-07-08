#!/usr/bin/env bash
cd img
# clean out IDLINK file
echo -n '' > IDLINK.txt

# loop over CSV, downloading each image
for patron in $(csvcut -c 1,3 ../urls.csv); do
    # split "barcode,http://example.com" into array ('barcode', 'http://example.com')
    array=(${patron//,/ })
    echo $array
    barcode=${array[0]}
    url=${array[1]}
    # download image
    wget --no-use-server-timestamps --no-check-certificate --output-document="${barcode}.jpg" ${url}
    # write line to IDLINK
    echo "${barcode}, ${barcode}.jpg">> IDLINK.txt
done
