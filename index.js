// find profile image URLs on CCA Portal given CSV of patron information

// https://github.com/segmentio/nightmare
const Nightmare = require('nightmare')
// https://github.com/rosshinkley/nightmare-examples/blob/master/docs/common-pitfalls/async-operations-loops.md
const vo = require('vo')
// CLI options - https://github.com/substack/minimist
const opts = require('minimist')(process.argv.slice(2))

if (opts.h || opts.help) {
    console.log('usage: node index [options] > urls.csv')
    console.log('\t-t or --test: use the test-patrons.js file which is much smaller')
}

// load patron data
// _must_ use var here so variable is accessible outside of these blocks
if (opts.t || opts.test) {
    var patrons = require('./test-patrons')
} else {
    var patrons = require('./patrons')
}

var run = function*() {
    var results = []

    for (let patron of patrons) {
        let username = patron[1]
        let browser = Nightmare({show: false})

        // portal pages are based on CCA username
        let url = yield browser.goto(`https://portal.cca.edu/people/${username}/`)
            // we wait 2s & not for a selector like "#profile-thumb"
            // which causes a timeout when we hit a 404 page, for instance
            .wait(2000)
            .evaluate(function () {
                // #profile-thumb img is what we want
                var img = document.querySelector('#profile-thumb img')
                // return the img.src if we found it
                return (img ? img.src : false);
            }).end()
            .then(function (url) {
                // if we have a URL, print it out in a CSV-like format
                // otherwise tell stderr that we couldn't find one
                if (url) {
                    console.log(patron.concat([url]).join(','))
                    return url
                } else {
                    console.error('unable to find profile image for', patron[1])
                    return false
                }
            })
        // this clause & return below not really needed anymore since
        // the console.log in .then() above does all our output for us
        if (url) results.push(patron.concat([url]))
    }

    return results
}

// kick everything off, use `vo` to make it appear synchronous
vo(run)(function(err, results){
    if (err) console.error(err)
})
