var express = require('express');
var request = require('request');
var exec = require('child_process').exec;
var cheerio = require('cheerio');
var async = require('async');
var parseString = require('xml2js').parseString;
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
    youTube.search(searchFor, 20, function(error, result) {
        if (error) {
            cb(error, null);
        } else {
            let items = result.items;
            let output = [];


            async.map(items, function(item, asyncBack) {
                let vidKey = item.id.videoId;
                

                request(`http://video.google.com/timedtext?lang=en&v=${vidKey}`, function (error, response, body) {  
                    var xml = body;
                    let res = {
                        timeArr: [],
                        textArr: []
                    };
                    asyncBack(null, xml);
                    // parseString(xml, function (err, parseResult) {
                    //     console.log(4);
                    //     parseResult["transcript"]["text"].forEach(function(data){
                    //         res.textArr.push(data["_"]);
                    //         res.timeArr.push(parseInt(data["$"]["start"]) + parseInt(data["$"]["dur"]));
                    //     });
                    // });
                    // // pass arrays to front end 
                    // asyncBack(null, res);
                });

                
            }, function(err, asyncResults) {
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                  // One of the iterations produced an error.
                  // All processing will now stop.
                  cb(err, null);
                } else {
                  cb(null, asyncResults);

                }
                // console.log("Done");
            });


            // for (let i = 0; i < items.length; i++) {
            //     id = items[i].id.videoId;
                
            //     request(`http://video.google.com/timedtext?lang=en&v=${id}`, function (error, response, body) {   
            //         var xml = body;
            //         var timeArr = [];
            //         var textArr = [];
            //         parseString(xml, function (err, result) {
            //             result["transcript"]["text"].forEach(function(something){
            //                 textArr.push(something["_"]);
            //                 timeArr.push(parseInt(something["$"]["start"]) + parseInt(something["$"]["dur"]));
            //             });
            //         });
            //         // pass arrays to front end 
            //         console.log(textArr);
            //         console.log(timeArr);
            //     });
            // }
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