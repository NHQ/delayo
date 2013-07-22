module.exports = function(){

  var master = new webkitAudioContext();
  var masterGain = master.createGain();
  masterGain.channelCount = 1;
  masterGain.channelCountMode = 'explicit';
  masterGain.channelInterpretation = 'speakers';
  masterGain.connect(master.destination);

  return {master: master, gain: masterGain}

}
