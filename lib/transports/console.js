var util  = require('util');
var _     = require('lodash');
var clc   = require('cli-color');

var levels = {
  info:   clc.blue
, debug:  clc.green
, warn:   clc.yellow
, error:  clc.red
, fatal:  clc.redBright
};

module.exports = function( options ){
  options = _.defaults( options || {}, {
    maxDataLines: 5
  , truncationStr: '...'
  });

  return function( entry ){
    var data;

    if ( Object.keys( entry.data ).length > 0 ){
      try {
        data = JSON.stringify( entry.data, true, '  ' );
      } catch ( e ){
        data = util.inspect( entry.data );
      }
    } else {
      data = '';
    }

    if ( data.split('\n').length > options.maxDataLines && options.maxDataLines !== -1 ){
      data = data.split('\n').slice( 0, options.maxDataLines );
      data.push( options.truncationStr, '}' );
      data = data.join('\n');
    }

    var args = [];

    if ( entry.component ){
      args.push( ( levels[ entry.level ] || levels.info )(
        '[' + entry.parents.concat( entry.component ).join('.') + ']' )
      );
    }

    args.push( entry.message );
    args.push( data );

    console.log.apply( console, args );
  };
};