module.exports = function(e){
	if(this.name == 'play'){

	    if(window.source.mediaElement) {

		window.source.connect(window.synth);
		synth.connect(master.destination);
		window.source.mediaElement.play();

	    }
	    else if(window.source.noteOn) window.source.noteOn(0)
	    else{
		var sine = master.createOscillator();
		//		sine.connect(window.source);
		window.source.connect(window.synth);
		window.synth.connect(master.destination);
		sine.noteOn(0);
	    }
	}
}
