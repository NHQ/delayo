var fs = require('fs');
var css = fs.readFileSync('../css/flatfield.css', 'utf8');
var html = require('hyperscript');
var touchdown = require('touchdown');
var appendCSS = require('uxer/appendCSS');
var hover = require('mouse-around')

module.exports = function(sourceEvents){

    var change = sourceEvents.change;
    var click = sourceEvents.click;
    
    appendCSS(css, 'uxer-flatfield')

    var _fieldset = html('fieldset.uxer-flat-fieldset.sourceCapture');
    var _legend =  html('legend.uxer-flatfield-legend', '+ ADD AUDIO SOURCE +')

    _fieldset.appendChild(_legend);

    var options = html('div.sourceCapOpts')
    _fieldset.appendChild(options);
  
    var mode = html('div.sourceCapMode')
    _fieldset.appendChild(mode);
 
    var samplesLabel = html('label.uxer-flatfield-label.sourceCapOptsLabel');
    var samples = html('button.uxer-flat-button', 
		       {textContent: 'LOAD SAMPLES',
			name: 'samplebank',
			ontouchdown: function(e){click.call(samples, e)}
		       });

    hover(_fieldset, function(evt, node, pos, start, stop){ })
    touchdown.start(samples);
    samplesLabel.appendChild(samples);
    options.appendChild(samplesLabel);


    var ytextLabel = html('div.uxer-flatfield-label.sourceCapOptsLabel');
    var ytext = html('input.uxer-flatfield-input', 
		     {value: 'http://www.youtube.com/watch?v=1OixqPThDNE', 
		      placeholder: 'PASTE YOUTUBE LINK',
		      type: 'url',
		      name: 'sourceURL'
		     });
    var ytextModeButton = html('button.uxer-flat-button',
			   {textContent: 'USE INTERNET AUDIO', 
			    ontouchdown: function(e){e.preventDefault();click.call(ytext, e)}
			    });

    touchdown.start(ytextModeButton)

    var ytextModeInfo = html('p.infoHelp', 
      [ 'You can load audio from almost anywhere on the internet: youtube, vimeo, soundcloud, bandcamp, synth.fm, or a direct link to an audio or video file. Soon you\'ll be able to search those same sources for multiple results, and even capture live ogg/mp3 streams.' 
      , html('br')
      , html('br')
      , html('h3', 'Examples:')
      , html('ul', [
	  html('li', 'http://www.youtube.com/watch?v=1OixqPThDNE'),
	  html('li', 'http://synth.fm/UdP4RuL3z')
      ])
      , html('h3', 'Supported audio File Types:')
      , html('ul', ['mp3', 'wav', 'ogg', 'aac'].map(function(k){
	    return html('li', k)
	}))
      ]) 

    var fileModeInfo = html('p.infoHelp', [
	html('h3', 'Load one or more files from your computer'),
	html('h3', 'Supported File Types:'),
	html('ul', ['mp3', 'wav', 'ogg', 'aac'].map(function(k){
	    return html('li', k)
	}))
    ]) 

    var sampleModeInfo = html('p.infoHelp', [
	'Load a one of your saved samples, your friend\'s samples, or search synth.fm.',
	html('div.sourceSamples')
    ]) 

    var micLineModeInfo = html('p.infoHelp', [
	'This will turn your mic or line-input into an audio source! Do it!'
    ]) 



    var ytextMode = html('div#sourceURL');
    var fileMode = html('div#soureceFile');
    var micLineMode = html('div#sourceMicLine');
    var sampleMode = html('div#sourceSample');

    mode.appendChild(ytextMode);
    mode.appendChild(fileMode);
    mode.appendChild(micLineMode);
    mode.appendChild(sampleMode);

    ytextLabel.appendChild(ytext);
    ytextLabel.appendChild(ytextModeButton);

    ytextMode.appendChild(ytextLabel)
    ytextMode.appendChild(ytextModeInfo)

    fileMode.appendChild(fileModeInfo);
    micLineMode.appendChild(micLineModeInfo)
    sampleMode.appendChild(sampleModeInfo)



// start of options ... ?

    var ytextOptionLabel = html('div.uxer-flatfield-label.sourceCapOptsLabel');
    var ytextOptionButton = html('button.uxer-flat-button',
			   {textContent: 'USE INTERNET AUDIO', 
			    ontouchdown: function(e){e.preventDefault();click.call(ytext, e)}
			    });

//    touchdown.start(ytextButton);
//    ytextLabel.appendChild(ytext);
    ytextOptionLabel.appendChild(ytextOptionButton);
    options.appendChild(ytextOptionLabel);

    var fileCapLabel = html('label.uxer-flatfield-label.sourceCapOptsLabel');
    var fileCap = html('input.uxer-flatfield-input', {type: 'file', name: 'file', onchange: change});
    var fileCapButton = html('button.uxer-flat-button',
			   {textContent: 'OPEN A LOCAL AUDIO FILE', 
			    name: 'file'
			    });


    touchdown.start(fileCapButton);
    fileCapLabel.appendChild(fileCap);
    fileCapLabel.appendChild(fileCapButton);
    options.appendChild(fileCapLabel);


    var miclineLabel = html('label.uxer-flatfield-label.sourceCapOptsLabel');
    var micline = html('button.uxer-flat-button', 
		       {textContent: 'CAPTURE MIC / LINE-IN',
			name: 'line', 
			ontouchdown: function(e){click.call(micline, e)}
		       });


    touchdown.start(micline);
    miclineLabel.appendChild(micline);
    options.appendChild(miclineLabel);

    var playbuttonLabel = html('label.uxer-flatfield-label');
    var playbutton = html('button.uxer-flat-button', 
		       {textContent: 'PLAY',
			name: 'play',
			ontouchdown: function(e){click.call(playbutton, e)}
		       });

 //   touchdown.start(playbutton);
 //   playbuttonLabel.appendChild(playbutton);
 //   _fieldset.appendChild(playbuttonLabel);
    
    document.body.appendChild(_fieldset)

    var fset = _fieldset;

    return _fieldset;

}

function makeStyle(str){
  var style = document.createElement('style');
  style.id = 'uxer-flatfield-style';
  style.textContent = str;
  return style
}

function preventDefault(e){e.preventDefault()};
