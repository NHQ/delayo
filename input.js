// an input is a file =, local or on the web
// also an instrument or stream
exports.createURLSource = function(){
    var url = document.createElement('input');
    url.type = 'url';
    url.placeholder = 'http://...';
    url.classList.add('uxer-flat-text-input');
    url.style.position = 'absolute';
    return url;
};

exports.createFilePickerMono = function(fn){
    fn = fn || function(){};
    var filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.classList.add('uxer-flat-filepicker');
    filePicker.accepts = 'audio/*';
    filePicker.placeholder = '';
    filePicker.addEventListener('change', function(e){
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
    })
    return filePicker;
}
