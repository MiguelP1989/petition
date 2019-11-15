
const {promisfy} = require("util")
var redis = require('redis');


var client = redis.createClient({
    host: 'localhost',
    port: 6379
});

client.on('error', function(err) {
    console.log(err);
});


exports.setex = promisify(client.setex.bind(client))
// bind
// function that attached all functions



// in the Index file


const {setex} = require ("/.redis");

setex("leo",  60, JSON.stringify({name: "leonardo"}).then( ( => {
    console.log("it worked");
    get("leo").then( data => {
        console.log(JSON.parce(data));
    })
}))
