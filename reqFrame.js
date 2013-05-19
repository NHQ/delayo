var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

window.requestAnimationFrame = requestAnimationFrame;

window.requestFunctions = window.requestFunctions || Object.create(null);

module.exports = function(){

  anim8();

  return function(fn){
    window.requestFunctions[fn] = fn
  }
    
  requestAnimationFrame(anim8);
  
  function anim8(){
    for(var q in window.requestFunctions){
	window.requestFunctions[q]()
    }
    requestAnimationFrame(anim8)
  }



}
