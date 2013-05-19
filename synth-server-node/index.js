webkitAudioContext.prototype.createScriptProcessor = webkitAudioContext.prototype.createJavaScriptNode
if(!window.URL) window.URL = {createObjectURL: window.webkitURL.createObjectURL}

var fs = require('fs');
var enslave = require('work-slave');
var buffers = require('buffers');

var floatConcat = require('./floatConcat.js');

var worker = fs.readFileSync(__dirname + '/worker.js', 'utf8');
var aurora = fs.readFileSync(__dirname + '/aurora.js');
var aac = fs.readFileSync(__dirname + '/aac.js');

var code = aurora + aac + worker;

var slave = undefined 
var id = 0;

module.exports = function(master, uri, cb){
    var master = master;
    var source = Object.create(null);
    var slave = slave || enslave(code);

    slave.postMessage({id: id++, uri: uri, sampleRate: master.sampleRate});

    slave.onmessage = function(evt){
	if(evt.data.type == 'meta'){

	    var data = evt.data.data;
	    source.data = data;
	    source.buffers = new Array(data.channelsPerFrame);

	    for(var x = 0; x < source.buffers.length; x++){
		source.buffers[x] = buffers(6);
	    }

	    var startTime = new Date().getTime();

	    var bufSize = 256 * 2 * 2 * 2 * 2 * 2;

	    var synth = master.createScriptProcessor(bufSize, data.channelsPerFrame, data.channelsPerFrame);
	    synth.bufSize = bufSize;
	    synth.bufIndex = 0;
	    synth.id = id;
	    synth.currentTime = function(t){// t in seconds
		synth.bufIndex = t * master.sampleRate
	    };

	    synth.onaudioprocess = function(evt){
		var outputBuffer = event.outputBuffer;
		var channelCount = outputBuffer.numberOfChannels;
		var channels = new Array(channelCount);
		for (i = _i = 0; _i < channelCount; i = _i += 1) {
		    channels[i] = outputBuffer.getChannelData(i);
		}
		for(var x = 0; x < channels.length; x++){
		    channels[x].set(source.buffers[x].slice(this.bufIndex, this.bufIndex + this.bufSize));
		}
		this.bufIndex+=this.bufSize
	    };

	    cb(null, synth)

	}
	else if(evt.data.type == 'end'){

//	    alert((new Date().getTime() - startTime) / 1000)
	}
	else if(evt.data.type == 'progress'){
	    console.log(evt.data.data);
	}
	else {
	    var wsb = source.buffers;
	    for(x in evt.data.buffer){
		wsb[x].push(evt.data.buffer[x]);
	    }
	}
    }


}

