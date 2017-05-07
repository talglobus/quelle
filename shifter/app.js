var express = require('express');
var request = require('request');
var exec = require('child_process').exec;
var cheerio = require('cheerio');
var async = require('async');
var https = require('https');
var app = express();

app.get('/', function (req, res) {
    res.send("you've been slashed!");
});

let searchYoutube = (searchFor, cb) => {
    var YouTube = require('youtube-node');
    var youTube = new YouTube();
    youTube.setKey('AIzaSyAp-hsvkLWCFTwHbEHKm0z8D_DtQcxDJZA');
    // search youtube for {search_term} with max 5 results
    youTube.search(searchFor, 2, function(error, result) {
        if (error) {
            cb(error, null);
        } else {
            let items = result.items;
            let vidIDs = [];
            for (let i = 0; i < items.length; i++) {
                vidIDs.push(items[i].id.videoId);
            }
            cb(null, vidIDs);
        }
    });
};

app.get('/input/:input', function (req, res) {
    if (req.params.input !== undefined) {
        input = req.params.input;
        searchYoutube(input, (err, resres) => {
            res.end(JSON.stringify(resres));
        });
        // search(input);
        // request(`http://www.khanacademy.org/search?page_search_query=${input}`, (error, response, body) => {
        // 	$ = cheerio.load(body);
        // 	console.log($('.gs-title.external-link'));
        // });
    } else {
        res.end("food");
        console.log("food");
        // exec(`open http://www.khanacademy.org/search?page_search_query=${input}`);
    }
});
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});