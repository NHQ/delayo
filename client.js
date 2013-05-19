var fs = require('fs');
var onoff = require('uxer/switch');
var jsynth = require('jsynth');
var reqFrame = require('./reqFrame')();
var masterNodes = require('./createMaster')();

var master = window.master = masterNodes.master;//new webkitAudioContext();
var masterGainMono = window.masterGainMono = masterNodes.gain

if(!master.createScriptProcessor) master.createScriptProcessor = master.createJavaScriptNode;
var sources = window.sources = [];
var FX = window.FX = [];

var sourceCap = require('./sourceCap.js')(master);

var fst = sourceCap.style;
fst.position = 'absolute';
fst.top = '30px'
fst.right = '30px';
fst.width = '400px';

document.body.appendChild(sourceCap);

sourceCap.addEventListener('sourceCap', function(e){
    var source = e.dtail;
    source._id = new Date().getTime(); 
    sources.push(source);
});
