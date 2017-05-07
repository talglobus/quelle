var express = require('express');
var request = require('request');
var exec = require('child_process').exec;
var cheerio = require('cheerio');
var async = require('async');
var parseString = require('xml2js').parseString;
var fs = require('fs');
let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var nlu = new NaturalLanguageUnderstandingV1({
    'username': '4f02c909-d017-4fe2-b2a1-cbf699049bdd',
    'password': 'uoGUxbgPiRIv',
    'version_date': '2017-02-27'
});
// var https = require('https');
var app = express();

app.get('/', function (req, res) {
    res.send("you've been slashed!");
});



let searchYoutube = (searchFor, cb) => {
    var YouTube = require('youtube-node');
    var youTube = new YouTube();
    youTube.setKey('AIzaSyAp-hsvkLWCFTwHbEHKm0z8D_DtQcxDJZA');
    // search youtube for {search_term} with max 5 results
    youTube.search(searchFor, 50, function(error, result) {
        if (error) {
            cb(error, null);
        } else {
            let items = result.items;
            let output = [];


            async.map(items, function(item, asyncBack) {
                let vidKey = item.id.videoId;
                

                request(`http://video.google.com/timedtext?lang=en&v=${vidKey}`, function (error, response, body) {
                    if (body === "") {
                        asyncBack(null, []);
                    } else {
                        var xml = body;
                        let res = {
                            timeArr: [],
                            textArr: []
                        };
                        // asyncBack(null, xml);
                        parseString(xml, function (err, parseResult) {
                            if (parseResult === undefined) {
                                asyncBack(null, []);
                                return;
                            }

                            async.map(parseResult["transcript"]["text"], (item, parseBack) => {
                                let rect = {
                                    textArr: item["_"],
                                    timeArr: parseFloat(item["$"]["start"]) + parseFloat(item["$"]["dur"])
                                };

                                parseBack(null, rect);
                            }, (err, parseResults) => {
                                asyncBack(null, {key: vidKey, value: parseResults});
                            });
                        });
                    }
                });

                
            }, function(err, asyncResults) {
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                  // One of the iterations produced an error.
                  // All processing will now stop.
                  cb(err, null);
                } else {
                    let filteredResults = asyncResults.filter((elem) => {
                        return (elem.length === undefined);
                    });

                    console.log(`Response calculation completed. ${filteredResults.length} results.`);
                    cb(null, filteredResults);

                }
                // console.log("Done");
            });
        }
    });
};

let watsonify = (text, cb) => {
    nlu.analyze({
      'html': text, // Buffer or String
      'features': {
        'concepts': {},
        'keywords': {},
      }
    }, function(err, response) {
         if (err)
           cb(err, null);
         else
           cb(null, JSON.stringify(response, null, 2));
    });
}

app.get('/input/:input', function (req, res) {
    if (req.params.input !== undefined) {
        let input = req.params.input;
        let watsonInput = entities.decode(input);
        console.log(watsonInput);

        watsonify(watsonInput, (watsonErr, watsonRes) => {
            if (watsonErr) {
                console.error(watsonErr);
                res.end("Sorry. Stuff happens");
            } else {
                res.end(watsonRes);
            }
        });

        // searchYoutube(input, (err, resres) => {
        //     res.end(JSON.stringify(resres));
        // });

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