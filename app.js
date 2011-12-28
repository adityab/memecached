var http = require('http');
var mongo = require('mongodb');

var db = new mongo.Db('memedb', new mongo.Server('localhost', 92277));

server = http.createServer( function(req, res) {
    // send the latest few database entries to client
});
server.listen(8080);

// now.js code
var everyone = require("now").initialize(server);

// publish meme
everyone.now.publish = function(memeName, memeText) {
    if(memeText.line1 && memeText.line2)
        db.collection('memes', function(err, collection) {
            doc = { 
                "name": memeName, 
                "text": memeText, 
                "date": Date.now() 
                };

            collection.insert(doc, function(err) {
                if(!err)
                    everyone.now.receiveMeme(doc);
            });
        });
};

// retrieve the latest few memes of a name. If there is no name, retrieve a mixture
everyone.now.retrieve = function(memeName) {
    var client = this;
    db.collection('memes', function(err, collection) {
        collection.find( {"name": memeName}, { sort: [[ "date", "desc" ]], 25 }).toArray( function(err, docs) {
            console.log("Retrieved memes named " + memeName, docs);
            client.now.getContent(docs);
        });
    });
};
