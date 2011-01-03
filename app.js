var inherits = require('inherits')
var emitter = require('events').EventEmitter
var fs = require('fs');
var appendCSS = require('uxer/appendCSS');

var css = fs.readFileSync('../css/app.css', 'utf8');
var png = fs.readFileSync('./search.png', 'base64');

var loadSrc = require('./loadSrc')
var createSource = require('./createSource');

appendCSS(css, 'synthFM')
 
var app = new emitter();
//inherits(app, emitter);

app.master = window.master = new webkitAudioContext();
app.sources = []
app.synths = []
app.user = {}
app.micLine = null
app.loadSrc = loadSrc(app)

app.loadSrc(createSource)
 
//app.on('sourceCap', createSource)

app.on('error', function(err){
    console.log(err)
})
