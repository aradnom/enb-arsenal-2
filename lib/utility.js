/**
 * Contains generic functionality that doesn't fit better elsewhere.
 */

 /**
  * Attempt to pull specified key from both the POST and GET side of a request.
  * Will prefer POST side over GET side if both are set.
  *
  * @param  {String} key Key to attempt to retrieve
  * @param  {String} req Express Request object
  * @return {String}     Returns the value if it exists or null
  **/
 module.exports.getRequestValue = function ( key, req ) {
   if ( req ) {
     if ( req.body && req.body[ key ] ) { return req.body[ key ]; }
     if ( req.query && req.query[ key ] ) { return req.query[ key ]; }
   }

   // Well something shore went wrong
   return null;
 };
