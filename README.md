stream-utils
============
Stream utilities with support for stream resets.


exports
-------
 * through([write], [end], [reset]) - creates a new "through" Streams which readable and writable that acts based on the given write, end, and reset handler functions.
 * duplex(writable, readable) - combines a writable stream and a readable stream into a through Stream.
 * pipeline(stream1, stream2, ...) - creates a new Stream that sends data to all of the given Streams.


Examples
--------
``` js
var su = require("stream-utils");


```


License
-------
MIT / Apache2
