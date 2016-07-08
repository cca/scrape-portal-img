// example of scraping using the JSON data in portal
const request = require('request')
const usernames = ['ephetteplace', 'lconrad']

for (let username of usernames) {
    request.get({
        url: `https://portal.cca.edu/people/profiles/${username}/json`,
        json: true,
    }, function(err, response, body) {
        console.log(body.avatar_path)
    })
}
