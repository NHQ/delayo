webkitAudioContext.prototype.createScriptProcessor = webkitAudioContext.prototype.createJavaScriptNode
if(!window.URL) window.URL = {createObjectURL: window.webkitURL.createObjectURL}

var fs = require('fs');


var enslave = require('work-slave');
var jsynth = require('jsynth');
var amod = require('amod');
var buffers = require('buffers');
var jdelay = require('jdelay');
var floatConcat = require('./floatConcat.js');
var aurora = fs.readFileSync('./aurora.js');
var aac = fs.readFileSync('./aac.js');
var worker = fs.readFileSync('./worker.js');
var code = aurora + aac + worker;
var slave = enslave(code); 


var master = window.master = new webkitAudioContext()
var source = window.source = Object.create(null);

var uri = 'http://www.youtube.com/watch?v=vftIGU8-uqs';
//var uri = 'http://www.youtube.com/watch?v=vWD7k6TrJ-g';
var id = 0;
var actualSampleCount = 0;

var resample;

var a = document.createElement('a');
a.href="#";
a.textContent = 'click here';
document.body.appendChild(a);
var startTime = new Date().getTime();
slave.postMessage({id: id++, uri: uri, sampleRate: master.sampleRate});

slave.onmessage = function(evt){
  if(evt.data.type == 'meta'){
      var data = evt.data.data;
      source.data = data;
      source.buffers = new Array(data.channelsPerFrame);
      for(var x = 0; x < source.buffers.length; x++){
	  source.buffers[x] = buffers(6);
      }
  }
  else if(evt.data.type == 'end'){
      console.log('finished')
      alert((new Date().getTime() - startTime) / 1000)
  }
  else {
      var wsb = source.buffers;
      for(x in evt.data.buffer){
	  wsb[x].push(evt.data.buffer[x]);
//	  console.log(wsb[x], evt.data.buffer[x]);
      }
  }
}

var bz = 256 * 2 * 2 * 2 * 2 * 2;
var synth = master.createScriptProcessor(bz, 2, 2);

var bufIndex = 0;

synth.onaudioprocess = function(evt){
    var channelCount, channels, data, i, n, outputBuffer, _i, _j, _k, _ref;

    outputBuffer = event.outputBuffer;
    channelCount = outputBuffer.numberOfChannels;
    channels = new Array(channelCount);
    for (i = _i = 0; _i < channelCount; i = _i += 1) {
      channels[i] = outputBuffer.getChannelData(i);
    }
    for(var x = 0; x < channels.length; x++){
	channels[x].set(window.source.buffers[x].slice(bufIndex, bufIndex + bz));
    }
    bufIndex+=bz
};

var delayr = jsynth(master, delay);
var check = false;
a.addEventListener('click', function(){
    if(check){
delyr.disconnect();
delayr.connect(master.destination);

}else{
     var sine = master.createOscillator();
     sine.connect(synth);
//      synth.connect(master.destination);
    synth.connect(delayr);
    delayr.connect(master.destination);
      sine.noteOn(0);
 check = true;
}
})

var delayo = jdelay(master.sampleRate * 2.667, .167, 3.867);

function delay (t, i , sample){
    return delayo(sample);
}
