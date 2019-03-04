// Set the start URL
var baseDomain = 'release.qa.sravni-team.ru';
var startUrl = 'http://' + baseDomain + '/';
var keyword = 'kredity';
var keywords_exclude = ['info', 'avtokredity', 'vybor-regiona'];
var second_keyword_to_exclude = 'regiony';

// URL variables
var visitedUrls = [], pendingUrls = [], urlSources = [];

// Create instances
var casper = require('casper').create({/* verbose: true, logLevel: 'debug' */});
var utils = require('utils')
var helpers = require('./helpers')

// Spider from the given URL
function spider(url) {

        // Add the URL to the visited stack
        visitedUrls.push(url);

        // Open the URL
        casper.open(url).then(function() {


/*  this.currentResponse.headers.forEach(function(header){
    console.log(header.name +': '+ header.value);
  });*/


                // Set the status style based on server status code
                var status = this.status().currentHTTPStatus;
                switch(status) {
                        case 200: var statusStyle = { fg: 'green', bold: true }; break;
                        case 404: var statusStyle = { fg: 'red', bold: true }; break;
                         default: var statusStyle = { fg: 'magenta', bold: true }; break;
                }

                // Display the spidered URL and status      
                this.echo(this.colorizer.format(status, statusStyle) + '\t' + urlSources[url] + "\t > \t" + url );       

var errors = [];                                            

casper.on("page.error", function(msg, trace) {              
  this.echo("Error:    " + msg, "ERROR");                   
  this.echo("file:     " + trace[0].file, "WARNING");       
  this.echo("line:     " + trace[0].line, "WARNING");       
  this.echo("function: " + trace[0]["function"], "WARNING");
  errors.push(msg);                                         
});                                                         

  if (errors.length > 0) {                                  
    this.echo(errors.length + ' Javascript errors found', "WARNING");                                                    
  } else {                                                  
//    this.echo(errors.length + ' Javascript errors found', "INFO");                                                     
  }                                                         


                // Find links present on this page          
                var links = this.evaluate(function() {      
                        var links = [];                     
                        Array.prototype.forEach.call(__utils__.findAll('a'), function(e) {                               
                                links.push(e.getAttribute('href'));                                                      
                        });                                 
                        return links;                       
                });                                         

                // Add newly found URLs to the stack        
                var baseUrl = this.getGlobal('location').origin;                                                         
                Array.prototype.forEach.call(links, function(link) {                                                     
                        var newUrl = helpers.absoluteUri(baseUrl, link);                                                 
                        if (pendingUrls.indexOf(newUrl) == -1 && visitedUrls.indexOf(newUrl) == -1) {                    

if(
(-1 !== newUrl.indexOf(startUrl))   ||                     
(
(-1 !== newUrl.indexOf(keyword)) &&                        
(-1 !== newUrl.indexOf(baseDomain))                         
&& (-1 === newUrl.indexOf(keywords_exclude[0]))             
&& (-1 === newUrl.indexOf(keywords_exclude[1]))             
&& (-1 === newUrl.indexOf(keywords_exclude[2]))             
)                                                           


) {
if(-1 === newUrl.indexOf(second_keyword_to_exclude))
{

//                                casper.echo(casper.colorizer.format('-> Pushed ' + newUrl + ' onto the stack', { fg: 'magenta' }));
                                pendingUrls.push(newUrl);
                                urlSources[newUrl] = url;
}
}
                        }
                });

                // If there are URLs to be processed
                if (pendingUrls.length > 0) {
                        var nextUrl = pendingUrls.shift();
//                        this.echo(this.colorizer.format('<- Popped ' + nextUrl + ' from the stack', { fg: 'blue' }));
                        spider(nextUrl);
                }

        });

}

// Start spidering
casper.start(startUrl, function() {
        spider(startUrl);
});

// Start the run
casper.run();

/*
var casper = require('casper').create();

casper.start('http://casperjs.org/', function() {
    this.echo(this.getTitle());
});

casper.thenOpen('http://phantomjs.org', function() {
    this.echo(this.getTitle());
});

casper.run();
*/
