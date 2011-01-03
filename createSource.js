var waveform = require('jsynth-waveform');
var elAnalyrzer = require('./elAnalyzer');
module.exports = function(err, node){

    console.log(node)

    if(node.mediaElement){
	// gotta get the data out
	document.body.appendChild(node.mediaElement)

	node.connect(window.master.destination);
	node.mediaElement.playbackRate = 4;
	node.mediaElement.play()	
    }



    var canvas = document.createElement('canvas');
    var h = 150, w = 600;
    canvas.height = h * 2;
    canvas.width = w * 2;
    canvas.style.display = 'block';
    canvas.style.padding = canvas.style.margin = '0';
    canvas.style.border = '3px solid OrangeRed';
    document.body.appendChild(canvas);

    var o = {};
    o.source = node;
    o.canvas = canvas;
    o.chunkSize = Math.floor(master.sampleRate / 360);
    o.positive = 'rgba(20,20,20,1)';
    o.negative = 'rgba(255,255,255,.1)'; // the default
    o.in = null; //default to 0
    o.out = null//default to buffer length
    o.x = 0;
    o.y = h/2;
    o.width = w * 2;
    o.height = h; 
//    waveformer(o);

}
