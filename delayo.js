var fs = require('fs');
var onoff = require('uxer/switch');
var trow = require('./throw');
var createDial = require('./superdial');
var jsynth = require('jsynth');
var Delay = require('../delay');
var reqFrame = require('./reqFrame')();
// window / DOM stuff

//var _audio = new AudioContext();
var audio = new webkitAudioContext();

window.audio = window.master = audio;

window.source = window.synth = undefined

if(!audio.createScriptProcessor) audio.createScriptProcessor = audio.createJavaScriptNode;

window.SAMPLERATE = audio.sampleRate;

window.synth = jsynth(audio, delayometer);

//synth.connect(audio.destination);

// source parameters

// delayo parameters

var param = {};
param.dlength = 0;
param.feedback = 0;
param.mix = 0;
param.spinMultiplier = 200;
param.dsmoothing = 128 * 2 * 2 * 2;

var delayo = Delay(param.dlength, param.feedback, param.mix, SAMPLERATE * 5);

var getdl = trow(param.dlength, param.dlength, param.dsmoothing); 

// interfaces

// source input

// file picker

var sourceCap = require('./sourceCap.js')(audio);
sourceCap.style.width = '400px';
sourceCap.style.float = 'right';
console.log(sourceCap);

document.body.appendChild(sourceCap);
sourceCap.addEventListener('sourceCap', function(e){

    if(source) {
      source.mediaElement.stop();
      source.disconnect();
    };

    window.source = e.detail;
//    source.mediaElement.playbackRate = 1.337;

//    source.connect(synth);

});

//

// delay dials

var dlength = createDial({width:220, color:'green', bgcolor:'#000', top: 30, left: 10});
dlength.ticker.value = param.dlength;
dlength.node.addEventListener('spin', function(e){

    var x = param.dlength;

    param.dlength += e.detail.delta * param.spinMultiplier
    param.dlength = Math.max(0, param.dlength);

    getdl = trow(x, param.dlength, param.dsmoothing)

})

var dfeedback = createDial({width:100, color:'orange', bgcolor:'#000', top: 30, left: 290});
dfeedback.node.addEventListener('spin', function(e){
  param.feedback += e.detail.delta / 360;

},false)


var dmix = createDial({width:100, color:'pink', bgcolor:'#000', top: 30, left: 420});
dmix.node.addEventListener('spin', function(e){
  param.mix += e.detail.delta / 360;

},false)

var dspinMultiplier = createDial({width:100, color:'brown', bgcolor:'#000', top: 160, left: 290});
dspinMultiplier.node.addEventListener('spin', function(e){
  param.spinMultiplier += e.detail.delta / 360 * 100;

},false)

var dsmoothing = createDial({width:100, bgcolor:'#000', top: 160, left: 420});
dsmoothing.node.addEventListener('spin', function(e){
    param.dsmoothing += e.detail.delta / 360 * 1000;

},false)
                                

reqFrame(function(){

  dlength.ticker.value = param.dlength;
  dmix.ticker.value = param.mix;  
  dfeedback.ticker.value = param.feedback;  
  dspinMultiplier.ticker.value = param.spinMultiplier;  
  dsmoothing.ticker.value = param.dsmoothing;  
})


function delayometer(time, i, sample){
//  var d = getdl();
  var x = delayo(sample, param.dlength, param.feedback.toFixed(2), param.mix.toFixed(2))
  return x
}

document.addEventListener('on', function(){

    var synth = jsynth(audio, delayometer)


    var sine = audio.createOscillator();
    synth.connect(audio.destination);

});
