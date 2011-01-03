var streamNode = require('./');
var jsynth = require('jsynth');
var jdelay = require('jdelay');

var master = new webkitAudioContext();
var uri = 'http://www.youtube.com/watch?v=vftIGU8-uqs';

var source = streamNode(master, uri);

var delayo = jdelay(master.sampleRate * 1.333, .99, .33);

var delay = jsynth(master, delayr)

var a = document.createElement('a');
a.href="#";
a.textContent = 'click here';
document.body.appendChild(a);

var check = false;

a.addEventListener('click', function(){
    if(check){
	delay.disconnect();
	//delayr.connect(master.destination);
	check = false;
    }else{

	var sine = master.createOscillator();
	sine.connect(source);
	//      synth.connect(master.destination);
	source.connect(delay);
	delay.connect(master.destination);
	sine.noteOn(0);
	check = true;
    }
})


function delayr(t, i, sample){
  return delayo(sample);
}
