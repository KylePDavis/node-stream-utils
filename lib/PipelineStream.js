var Stream = require("stream"),
	events = require("events"),
	through = require("./ThroughStream"),
	duplex = require("./DuplexedStream");


exports = module.exports = (function(){
	// CONSTRUCTOR
	var base = Stream, proto, klass = function PipelineStream(throughStreams){

		// Function-mode support
		var self = this instanceof klass ? this : Object.create(proto);

		// Build the Stream to be returned
		Stream.call(self);
		events.EventEmitter.call(self);	// Can't call the Stream ctor like this in Node for some reason...

		var t = typeof(throughStreams) == "object" && typeof(throughStreams.length) === "number" ? throughStreams : Array.prototype.slice.call(arguments, 0);

		if(t.length === 0){
			through.call(self);
			return self;
		}else if(t.length === 1){
			return t[0];
		}else{

			for(var i = 0, l = t.length - 1; i < l; i++){   // chain events together for the inner streams
				t[i].pipe(t[i + 1]);
				//TODO: get sub-stream initiated end, error, reset, close, etc working
			}

			//var self = duplex(t[0], t[l]);
			duplex.call(self, t[0], t[l]);

			self.end = function end(){
				for(var i = 0, l = t.length; i < l; i++)
					t[i].end();
				self.ended = true;
			};

			self.reset = function reset(){
				t[0].resume();
				for(var i = 0, l = t.length - 1; i < l; i++){   // chain events together for the inner streams
					t[i].removeAllListeners("data");	//TODO: find a better way to do this or prevent the need for it...
					t[i].pipe(t[i + 1]);
					t[i].reset();
					//TODO: get sub-stream initiated end, error, reset, close, etc working
				}
				t[l].reset();
				self.writable = self.readable = true;
				self.ended = false;
			};

		}

		return self;
	};
	proto = klass.prototype = Object.create(base.prototype, {constructor:{value:klass}});

	// STATIC MEMBERS
	klass.PipelineStream = klass;	// self-reference to make using the Class via Node more obvious

	return klass;
})();
