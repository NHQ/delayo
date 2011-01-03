var url = require('url');
var ssn = require('./synth-server-node');
var hyperquest = require('hyperquest');

module.exports = function(app){

    var context = app.master;

    return {change: change, click: click}

    function change(e){
	if(this.name == 'url') return
	if(this.name == 'file'){

	    if(this.files[0].size > 1920000){
		var audio = new Audio();
		audio.src = window.URL.createObjectURL(this.files[0]);
		audio.addEventListener('canplay', function(){
		    var source = context.createMediaElementSource(audio);
		    app.emit('sourceCap', null, source)
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
			app.emit('sourceCap', null, source)
		    } 
		    catch(e){
			var err = new Error('Error: Probably an unsupported file type.')
			app.emit('sourceCap', err, null)
			// and this is where you would decode it with Aurora ...
		    }
		};
		try{
		    reader.readAsArrayBuffer(this.files[0]);
		} 
		catch(e){
		    var err = new Error('Error: Probably an unsupported file type.')
		    app.emit('sourceCap', err, null)
		}
	    }
	}
    }

    function click(e){

	if(this.name == 'sourceURL'){

	    e.preventDefault();
	    var uri = this.value;
	    if(uri.length){
		var parsed = url.parse(uri, true);
		
		if(((parsed.slashes || parsed.protocol) && (parsed.hostname.match('youtube.com'))) || 
		   (parsed.pathname && parsed.pathname.match('youtube.com'))) {

		    if(Modernizr.Touch || true){

			var source = ssn(master, uri, function(err, source){
			    app.emit('sourceCap', err, source)
			});

		    }

		    else{

			var id = parsed.hostname === 'youtu.be' 
			    ? parsed.pathname.slice(1) : parsed.query.v;

			hyperquest('http://localhost:11002/get_info?'+uri, function(err, res){
			    res.on('data', function(data){

				var URI = data;
				var video = document.createElement('video');
				video.src = URI;
				video.addEventListener('canplay', function(){
				    var source = context.createMediaElementSource(video);
				    app.emit('sourceCap', null, source)
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
		app.emit('sourceCap', null, source);
	    })
	}
    }


    function makeStyle(str){
	var style = document.createElement('style');
	style.id = 'uxer-flatfield-style';
	style.textContent = str;
	return style
    }

    function preventDefault(e){e.preventDefault()};
}
