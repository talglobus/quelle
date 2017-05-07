var express = require('express');
var router = express.Router();
var request = require('request');
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyDDjTGGS3Uo48m-gM3wUQi7kaLGVNmkGR8	');
var searchTerms = [];
var youtubeIdList = [];
var timeArr = [];
var textArr = [];
var parseString = require('xml2js').parseString;

// /* GET home page. */
// router.get('/', function(req, res, next) {
// 	// get search terms from khan academy api
// 	Object.keys(req.query).forEach(function(key) {
//     	searchTerms.push(req.query[key])
// 	});

// 	console.log(searchTerms);

// 	// search video on youtube limit 5
// 	youTube.search(searchTerms[0], 5, function(error, result) {
// 	  if (error) {
// 	    console.log(error);
// 	  }else{
// 	  	var vlist = [];
// 	  	result.items.forEach(function(one){
// 	  		vlist.push(one["id"]["videoId"]);
// 	  	});
// 	  	console.log(vlist);
// 	  	res.render('index', { title: 'Express' , youtubeIds: JSON.stringify(vlist)})
// 	  }
// 	});



// 	// res.end();
// 	// res.render('index', { title: 'Express' });



// 	// console.log(req.query);
// });

function getTextArrAndTimeArr(){
	request('http://video.google.com/timedtext?lang=en&v=MMv-027KEqU', function (error, response, body) {	
		var xml = body;
		var timeArr = [];
		var textArr = [];
		parseString(xml, function (err, result) {
	    	result["transcript"]["text"].forEach(function(something){
	    		textArr.push(something["_"]);
	    		timeArr.push(parseFloat(something["$"]["start"]) + parseFloat(something["$"]["dur"]));
	    	});
		});
		// pass arrays to front end 
		console.log(textArr);
		console.log(timeArr);
	});
}

router.get('/', function(req, res, next) {
	getTextArrAndTimeArr();
	res.render('index', {"title": "App","textArr": textArr, "timeArr": timeArr});
});

// getTextArrAndTimeArr();
// /*
// 	function to ask bluemix for intent

// 	search
// */
function watson(term){
	var fs = require('fs');
	var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

	var nlu = new NaturalLanguageUnderstandingV1({
	  'username': '4f02c909-d017-4fe2-b2a1-cbf699049bdd',
	  'password': 'uoGUxbgPiRIv',
	  'version_date': '2017-02-27'
	});

	nlu.analyze({
	  'html': term, // Buffer or String
	  'features': {
	    'concepts': {},
	    'keywords': {},
	  }
	}, function(err, response) {
	     if (err)
	       console.log('error:', err);
	     else
	       console.log(JSON.stringify(response, null, 2));
	});
}

watson('blah blah');

/* for every quelle on a video
	store
		- video id
		- video time
		- intent
		- comment
*/

// var someRandArr = [];
var data = [];

function quelle(videoId, videoTime, intent, comment){
	data.push({videoId: videoId, videoTime: videoTime, intent: intent, comment: comment});
	console.log(data);
};

router.get('/', function(req, res, next) {
	console.log("hello");
});

module.exports = router;