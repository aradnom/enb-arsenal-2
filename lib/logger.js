var config  = require( './config' );
var Winston = require( 'winston' );

// Build new Winston logger and return
module.exports = new (Winston.Logger)({
  transports: [
    new (Winston.transports.Console)({
      colorize: true,
      timestamp: true
    }),
    new (Winston.transports.File)({
      filename: config.basePath + 'logs/' + 'app.log',
      maxsize: 100 * 1024 * 1024,
      maxFiles: 5
    })
  ]
});
