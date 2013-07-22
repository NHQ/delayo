var ee = require('events').EventEmitter
var fs = require('fs')
var html = require('hyperscript')
var center = require('uxer/center')
var css = fs.readFileSync('../css/overlay.css', 'utf8');
var appendCSS = require('./appendCSS')

appendCSS(css)

var overlay = html('div.overlay');

module.exports = function(el){

    var em = new ee();

    em.on('show', function(){

	document.body.appendChild(overlay)

	overlay.appendChild(el);

	center(el)
	
    })

    em.on('remove', function(){
	
	document.body.removeChild(overlay)

	overlay.removeChild(el)

    })

    return em

}
