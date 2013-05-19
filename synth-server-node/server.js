var http = require('http');
var hyperquest = require('hyperquest');
var path = require('path');
var url = require('url');
var ytdl = require('ytdl');
var flv = require('flv');
var uuid = require('uuid');
var fs = require('fs');
var pause = require('pause-stream');
var filed = require('filed');

var tracks = {};

var server = http.createServer(function(req, res){

    if(req.method === 'OPTIONS') {
	var header = {
	    'Access-Control-Allow-Origin' : '*',
	    'Access-Control-Allow-Headers' : 'Range',
	    'Access-Control-Expose-Method' : 'GET',
	    'Access-Control-Allow-Credentials' : true
	};

	res.writeHead(200, header);
	res.end();
    }
    if(req.method === 'GET') {
	var header = {
	    'Access-Control-Allow-Origin' : '*',
	    'Access-Control-Allow-Headers' : 'Range',
	    'Access-Control-Expose-Method' : 'GET',
	    'Access-Control-Allow-Credentials' : true
	};

	var uri = url.parse(req.url).search;
	var range = req.headers['range'];
	var offset = Number(range.split('=')[1].split('-')[0]);
	var end = Number(range.split('=')[1].split('-')[1]);
	var length = end - offset;
	console.log(range, offset, end, length);

	if(uri){

	    uri = uri.slice(1);

	    var parsed = url.parse(uri);

	    res.writeHead(200, header);

	    var stat = fs.statSync('./audio/'+encodeURIComponent(parsed.href)+'.aac');

	    var file = fs.createReadStream('./audio/'+encodeURIComponent(parsed.href)+'.aac', {start: offset, end: end});

	    file.pipe(res);

	}
    }
    else if(req.method === 'HEAD'){

	var header = {
	    'Access-Control-Allow-Origin' : '*',
	    'Access-Control-Expose-Headers' : 'Content-Length',
	    'Access-Control-Allow-Credentials' : true
	};

	var uri = url.parse(req.url).search;

	if(uri){
	    uri = uri.slice(1);
	    var parsed = url.parse(uri);

	    if(((parsed.slashes || parsed.protocol) && (parsed.hostname.match('youtube.com'))) || 
	       (parsed.pathname && parsed.pathname.match('youtube.com'))) {
		var decoder = new flv.Decoder();
		var Data;
		decoder.on('metadata', function (name, data) {
		    Data = data;
		    var l = (data.audiodatarate / data.totaldatarate) * data.bytelength
		    var length = data.duration * data.audiodatarate * 1000;
		    header['Content-Type'] = 'audio/aac';
		    header['Content-Length'] = Math.ceil(l);
		    res.writeHead(200, header);
		    res.end();
		});
		decoder.on('audio', function (audio) {
		    var file = fs.createWriteStream('./audio/'+encodeURIComponent(parsed.href)+'.aac')
		    audio.pipe(file)
		});
		var stat = null;
		try{
		    stat = fs.statSync('./audio/'+encodeURIComponent(parsed.href)+'.aac');
		    }catch(err){
		}
		console.log(stat);
		if(!stat){
		    ytdl(parsed.href, {filter: function(format){ return format.container === 'flv'}}).pipe(decoder);
		}
		else{
		    header['Content-Type'] = 'audio/aac';
		    header['Content-Length'] = stat.size;
		    res.writeHead(200, header);
		    res.end();		    
		}
	    }
	    else {
		header['Content-Length'] = 0;
		res.writeHead(404, header);
		res.end();
	    }
	};
	
    }


}).listen(11002);
