var dialItIn = require('../flatdial');
var spin = require('uxer/spin');
var shims = require('uxer/shims');

shims.disableWindowBounce();

module.exports = function (opts){

  var dial = dialItIn(opts);
  var wrap = document.createElement('div');
  var ticker = document.createElement('input');
  ticker.type = 'number';
  wrap.appendChild(ticker);

  dial.ticker = ticker;
  dial.parentNode = wrap;

  wrap.style.position = 'absolute';
  wrap.style.left = opts.left + 'px';
  wrap.style.top = opts.top + 'px';

  wrap.appendChild(dial.node);

  document.body.appendChild(wrap);

  document.body.appendChild(dial.style);

  spin(dial.node);

  dial.node.spinDegree = 0;
 
  dial.node.addEventListener('spin', function(e){

    this.spinDegree += e.detail.delta;

//    this.style['-webkit-transform'] = 'rotateZ('+(this.spinDegree)+'deg)'

  }, true);

  return dial
}
