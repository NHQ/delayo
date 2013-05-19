var input = require('./input');

module.exports = function(){
  var filePickerMono = input.createFilePickerMono(function(ab, au){
      var el = this;
      var evt = new CustomEvent('source', {detail: {ab: ab, au: au}});
      this.dispatchEvent(evt);
  });

 return filePickerMono

}
