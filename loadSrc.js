var sourceSelect = require('./sourceCap');
var sourceEvents = require('./sourceEvent');
var overlay = require('./overlay');

module.exports = function(app){

	// this should initialize the source capture view
	// allowing user to select from source options
	// src is an object
	// when the src loads, or starts loading,
	// the cb will be called with (err, src)
	// and the src will appended to app.sources
	// and the previous view will be restored 

    var sourceSelectElement = sourceSelect(sourceEvents(app));
//    var overlay = overlay
//    var app = app

    return function(cb){
	
	var oley = overlay(sourceSelectElement)

	oley.emit('show');

	app.once('sourceCap', function(err, src){
	    oley.emit('remove');
	    if(src) app.sources.push(src)
	    if(err) app.emit('error', err)
	    app.removeAllListeners('cancel')
	    cb(err, src)
	})

	app.once('cancel', function(){
	    app.removeAllListeners('sourceCap')
	    oley.emit('remove');
	})
    }
}
