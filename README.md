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
Here's a simple and somewhat contrived example of how you might use the through stream helper to apply a math operation.
``` js
var su = require("stream-utils");

var inputs = [1, 2, 3],
  outputs = [],
  doubler = su.through(function(val){ // on data queue doubled value
    this.queue(val * 2);
  })
    .on("data", function(val2){ // on data push into outputs
      outputs.push(val2);
    });

inputs.forEach(doubler.write);

// --> outputs is: [2, 4, 6]
```


Why?
----
I needed a set of Stream utilities that would make it easier to build and reuse chains of complex Object stream mutators.
Originally I used the `event-stream` package but I ran into a few issues with my use cases that drove me to roll my own solution based on what I had learned from that code.


License
-------
MIT / Apache2
