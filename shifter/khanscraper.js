var casper = require('casper').create({
    pageSettings: {
        loadImages:  false,        // do not load images
        loadPlugins: false         // do not load NPAPI plugins (Flash, Silverlight, ...)
    }
});
var links;

function getLinks() {
// Scrape the links from top-right nav of the website
    var links = document.querySelectorAll('.gs-title');
    // return Object.keys(links);
    return Array.prototype.map.call(links, function (e) {
        return e.getAttribute('href');
    });
}

// Opens casperjs homepage
casper.start('https://www.khanacademy.org/search?page_search_query=' + casper.cli.args[0]);

casper.waitForSelector('.gs-title', function () {
    links = this.evaluate(getLinks);
});

casper.run(function () {
	// console.log(links);
    for(var i = 0; i < links.length; i++) {
        console.log(links[i]);
    }
    casper.done();
});