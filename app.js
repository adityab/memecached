var fs  =require('fs');
var http = require('http');
var mongo = require('mongodb');

var db = new mongo.Db('memedb', new mongo.Server("127.0.0.1", 27017));
db.open();

server = http.createServer( function(req, res) {
    // send the latest few database entries to client
    fs.readFile('index.html', function(err, page) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(page);
        res.end();
    });
});
server.listen(8080);

// now.js code
var everyone = require("now").initialize(server);

// publish meme
everyone.now.publish = function(meme) {
    if(meme.name && meme.text.line1 && meme.text.line2) {
        db.collection('memes', function(err, collection) {
            doc = { 
                "name": meme.name, 
                "text": meme.text, 
                "date": Date.now() 
                };

            collection.insert(doc, function(err) {
                if(!err)
                    everyone.now.receiveMeme(doc);
            });
        });
    }
};

// retrieve the latest few memes of a name. If there is no name, retrieve a mixture
everyone.now.getRecent = function(memeName) {
    var client = this;
    console.log("retrieving");
    db.collection('memes', function(err, collection) {
        if(memeName == undefined) {
            collection.find( {}, { sort: [[ "date", "desc" ]], limit: 25 }).toArray( function(err, docs) {
                client.now.getContent(docs);
            });
        }
        else {
            collection.find( {"name": memeName}, { sort: [[ "date", "desc" ]], limit: 25 }).toArray( function(err, docs) {
                client.now.getContent(docs);
            });
        }
    });
};
