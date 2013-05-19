module.exports = function(evt){
  // change event for number of inputs

}

function singleFile(e){
	var self = this;

	if(this.files[0].size > 10e6){
	    var audio = new Audio();
	    audio.src = window.URL.createObjectURL(this.files[0]);
	    audio.addEventListener('canplay', function(){
		fn.call(self, null, audio);
	    }, true);
	}
	else{
	    var reader = new FileReader();
	    console.log(this.files[0])
	    reader.onload = function(e){
		fn.call(self, this.result, null);
	    };
	    reader.readAsArrayBuffer(this.files[0]);
	}
}

