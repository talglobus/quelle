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

// let search = (termString) => {
// 	var options = {
//     	hostname: `www.khanacademy.org`,
//     	port: 443,
//     	path: `/search?page_search_query=${termString}`,
//     	method: 'GET'
//     };

// 	var req = https.request(options, function(res) {
// 	    var output = '';
// 	    res.setEncoding('utf8');
// 	    res.on('data', function (chunk) {
// 	        output += chunk;
// 	    });
// 	    res.on('end', function() {
// 	        // let $ = cheerio.load(output);

// 	        // console.log($('.gs-title .external-link').html());
// 	        console.log("Done");
// 	    });
// 	    // console.log("Connected");
// 	});
// 	req.on('error', function(err) {
// 	    //res.send('error: ' + err.message);
//         console.log("ERRRRORORORORORO");
// 	    console.log(err);
// 	});
// 	req.end();
// }

app.get('/input/:input', function (req, res) {
    if (req.params.input !== undefined) {
        input = req.params.input;
        console.log("About to search");
        exec(`casperjs khanscraper.js ${input}`, (error, stdout, stderr) => {
            // console.log("Out:");
            let vals = [];
            var useful = stdout.split('\n').filter((inLine) => {
                if (vals.indexOf(inLine) != -1) {
                    return false;
                }
                vals.push(inLine);
                return (inLine != '');
            });
            // console.log(useful);

            async.map(useful, function(link, asyncBack) {
                console.log(link);
                exec(`casperjs khadioscraper.js ${link}`, (error, stdout, stderr) => {
                    asyncBack(stdout);
                });
            }, function(err, asyncResults) {
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                  // One of the iterations produced an error.
                  // All processing will now stop.
                  console.log(err);
                } else {
                  console.log(asyncResults);
                }
                console.log("Done");
            });







            
        });
        // search(input);
        res.end(input);
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