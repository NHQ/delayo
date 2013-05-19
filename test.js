var close = require('closeness');

module.exports = function(start, seek, denom){
    var f = seek
    var a = start
    var d = denom || 128
    var e = a - f 
    var closeEnough = close(f, 5)
    return function(){
	e = a - f;
        if(!(closeEnough(a))){
	    if(e>0){
		a *= Math.pow(2,-1/d);
		console.log(a);
		if(a<=f) {
		    console.log(x)
		}
	    }
	    else{
		a *= Math.pow(2,1/d);
		console.log(a);
		if(a>=f) {
		    console.log(x)
		}
	    }

	    return a

        }

	return f

    }
}
