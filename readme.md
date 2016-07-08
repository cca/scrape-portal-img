# Scraping Portal Profile Images

A small project to grab images for Koha patron records by scraping them from the [CCA Portal](https://portal.cca.edu). See [the Koha Manual page](http://manual.koha-community.org/3.22/en/tools.html#uploadpatronimages) on bulk uploading patron images. The basic process is:

- download a list of patrons from Koha
    + need at least barcode & username
    + can filter out people where we don't have their CCA username since we won't be able to look them up on the portal
- convert the download to a JSON file named "patrons.json" formatted like so:

```json
[
    [ "PCAC0000000000", "booradley" ],
    [ "PCAC0000000001", "hlewis" ],
    [ "barcode", "username" ]
]
```

That can be done with a single search-and-replace usually.

- run `node index > urls.csv` to write profile image URLs to a file
    + stdout gets a CSV-like row with barcode, CCA username, & URL
    + stderr receives notices about users whose images we couldn't find
- download all the images into the "img" folder with the included "dl.sh" script
    + the "img" folder and "urls.csv" filenames are hard-coded into this script
- dl.sh also creates the necessary IDLINK.txt file
    + note: since dl.sh names the images using the patron's barcode, barcodes ending in a forward slash "/" result in an invalid file name & the download does not complete successfully, this is a bug that I should fix if I ever need to use this tool again
- zip & upload the "img" folder (containing IDLINK.txt) to Koha https://library-staff.cca.edu/cgi-bin/koha/tools/picture-upload.pl

# Requirements

- node & npm
- run `npm install` to get project dependencies
- python csvkit (`pip install csvkit`) is needed for the "dl.sh" script

# LICENSE

[ECL Version 2.0](https://opensource.org/licenses/ECL-2.0)
