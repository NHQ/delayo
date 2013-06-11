var fs = require('fs');
var css = fs.readFileSync('../flat-radio-field/assets/flatfield.css', 'utf8');
var hyperquest = require('hyperquest');
var url = require('url');
var ssn = require('./synth-server-node');
var html = require('hyperscript');
var touchdown = require('touchdown');


module.exports = function(context){

    var es = document.getElementById('uxer-flatfield-style');

    if(es){
	es.parentNode.insertBefore(makeStyle(css), es.nextSibling)
    }
    else{
	document.head.insertBefore(makeStyle(css), document.head.childNodes[0]);
    }

    var _fieldset = html('fieldset.uxer-flat-fieldset');
    var _legend =  html('legend.uxer-flatfield-legend', 'ADD A NEW SOURCE')

    _fieldset.appendChild(_legend);

    var ytextLabel = html('div.uxer-flatfield-label');
    var ytext = html('input.uxer-flatfield-input', 
		     {value: 'http://www.youtube.com/watch?v=1OixqPThDNE', 
		      placeholder: 'PASTE YOUTUBE LINK',
		      type: 'url',
		      name: 'url'
		     });

    var ytextButton = html('button.uxer-flat-button',
			   {textContent: 'CAPTURE INTERNET AUDIO', 
			    ontouchdown: function(e){e.preventDefault();click.call(ytext, e)}
			    });

    touchdown.start(ytextButton);
    ytextLabel.appendChild(ytext);
    ytextLabel.appendChild(ytextButton);
    _fieldset.appendChild(ytextLabel);

    var fileCapLabel = html('label.uxer-flatfield-label');
    var fileCap = html('input.uxer-flatfield-input', {type: 'file', name: 'file', onchange: change});
    var fileCapButton = html('button.uxer-flat-button',
			   {textContent: 'OPEN LOCAL AUDIO FILE', 
			    name: 'file'
			    });


    touchdown.start(fileCapButton);
    fileCapLabel.appendChild(fileCap);
    fileCapLabel.appendChild(fileCapButton);
    _fieldset.appendChild(fileCapLabel);


    var miclineLabel = html('label.uxer-flatfield-label');
    var micline = html('button.uxer-flat-button', 
		       {textContent: 'CAPTURE MIC/LINE IN',
			name: 'line',
			ontouchdown: function(e){click.call(micline, e)}
		       });


    touchdown.start(micline);
    miclineLabel.appendChild(micline);
    _fieldset.appendChild(miclineLabel);

    var playbuttonLabel = html('label.uxer-flatfield-label');
    var playbutton = html('button.uxer-flat-button', 
		       {textContent: 'PLAY',
			name: 'play',
			ontouchdown: function(e){click.call(playbutton, e)}
		       });

    touchdown.start(playbutton);
    playbuttonLabel.appendChild(playbutton);
    _fieldset.appendChild(playbuttonLabel);
    
    document.body.appendChild(_fieldset)

    var fset = _fieldset;


    return _fieldset;

    function change(e){
	if(this.name == 'url') return
	if(this.name == 'file'){

	    if(this.files[0].size > 1920000){
		var audio = new Audio();
		audio.src = window.URL.createObjectURL(this.files[0]);
		audio.addEventListener('canplay', function(){
		    var source = context.createMediaElementSource(audio);
		    var evt = new CustomEvent('sourceCap', {bubbles: true, detail: source});
//		    window.dispatchEvent(evt)
		    fset.dispatchEvent(evt);
		}, true)
	    }
	    else{
		var reader = new FileReader();
		reader.onload = function(e){
		    var buffer = e.target.result;
		    var source = context.createBufferSource();
		    try{
			var buf = context.createBuffer(buffer, true);
			source.buffer = buf;
			var evt = new CustomEvent('sourceCap', {bubbles: true, detail: source});
			fset.dispatchEvent(evt);
		    } 
		    catch(e){
			alert('Error: Probably an unsupported file type.')
			// and this is where you would decode it with Aurora ...
		    }
		};
		try{
		    reader.readAsArrayBuffer(this.files[0]);
		} 
		catch(e){
		    alert('Error: Probably an unsupported file type.')
		}
	    }
	}
    }

    function click(e){

	if(this.name == 'url'){
	    e.preventDefault();
	    var uri = this.value;
	    if(uri.length){
		var parsed = url.parse(uri, true);
	
		if(((parsed.slashes || parsed.protocol) && (parsed.hostname.match('youtube.com'))) || 
		   (parsed.pathname && parsed.pathname.match('youtube.com'))) {

		    if(Modernizr.touch){

			var source = ssn(master, uri, function(err, source){
			    var evt = new CustomEvent('sourceCap', {bubbles: true, detail: source});
			    fset.dispatchEvent(evt);
			});

		    }

		    else{

			// this is not gonna happen...
			var id = parsed.hostname === 'youtu.be' 
			    ? parsed.pathname.slice(1) : parsed.query.v;

			hyperquest('http://localhost:11002/get_info?'+uri, function(err, res){
			    res.on('data', function(data){

				var URI = data;
				var video = document.createElement('video');
				video.src = URI;
				video.addEventListener('loadstart', function(){
			
				    var source = context.createMediaElementSource(video);
				    var evt = new CustomEvent('sourceCap', {bubbles: true, detail: source});
				    fset.dispatchEvent(evt);

				});

			    })
			})

		    }
		}
		else console.log('nup');
	    }
	}
	if(this.name == 'file'){
	}
	if(this.name == 'line'){ // getUserMedia
	    navigator.webkitGetUserMedia({audio: true, video: false}, function(stream){
		var source = context.createMediaStreamSource(stream);
		var evt = new CustomEvent('sourceCap', {bubbles: true, detail: source});
		fset.dispatchEvent(evt);
	    })
	}
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
}

function makeStyle(str){
  var style = document.createElement('style');
  style.id = 'uxer-flatfield-style';
  style.textContent = str;
  return style
}

function preventDefault(e){e.preventDefault()};
