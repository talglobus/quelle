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

let search = (termString) => {
	var options = {
    	hostname: `www.khanacademy.org`,
    	port: 443,
    	path: `/search?page_search_query=${termString}`,
    	method: 'GET'
    };

	var req = https.request(options, function(res) {
	    var output = '';
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
	        output += chunk;
	    });
	    res.on('end', function() {
	        let $ = cheerio.load(output);
	        console.log($());
	        console.log("Done");
	    });
	    // console.log("Connected");
	});
	req.on('error', function(err) {
	    //res.send('error: ' + err.message);
	    console.log(err);
	});
	req.end();
}

app.get('/input/:input', function (req, res) {
    if (req.params.input !== undefined) {
        input = req.params.input;
        console.log("About to search");
        search(input);
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