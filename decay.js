module.exports = Decay;
//a = start value
//d = decay increment
//returns 1 to 0 as a factor of a
//

function Decay(a, d){
  var a = a, d = d, b = a;
	return function(aa, dd){
		if(aa){
			a = b = aa;
			if(dd) d = dd
			return 1
		}
		else{
			return Math.max(0, b -= d) / a
		}
	}
}
