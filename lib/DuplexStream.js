var Stream = require("stream"),
	events = require("events");


module.exports = (function(){
	// CONSTRUCTOR
	var klass = module.exports = function DuplexStream(writable, readable){

		// Function-mode support
		var self = this instanceof Stream ? this : Object.create(proto);

		// Build the Stream to be returned
		Stream.call(self);
		events.EventEmitter.call(self);	// Can't call the Stream ctor like this in Node for some reason...

		// Keyword-args Object support
		if(arguments.length === 1 && typeof(arguments[0]) === "object" && arguments[0].constructor === Object){
			var o = arguments[0];
			writable = o.writable;
			readable = o.readable;
		}

		// Sanity checks
		if(writable && typeof(writable) !== "object" && writable.writable === true) throw new Error("The writable Stream must be writable.");
		if(readable && typeof(readable) !== "object" && readable.readable === true) throw new Error("The readable Stream must be readable.");

		// Shared close event
		self.closed = false;
		function _close(){
			if(self.closed) return;
			self.emit("close");
			self.closed = true;
		}

		// Hook up writable
		self.writable = self.readable = true;
		["drain", "error", "pipe"].forEach(function(eventName){
			writable.on(eventName, self.emit.bind(self, eventName));
		});
		writable.on("close", _close);
		self.write = writable.write.bind(writable);

		// Hook up readable
		self.ended = false;
		["data", "end", "error"].forEach(function(eventName){
			readable.on(eventName, self.emit.bind(self, eventName));
		});
		readable.on("close", _close);
		self.end = function(){
			if(self.ended) return;
			self.ended = true;
			self.readable = false;
			readable.end();
			writable.end();
			self.writable = false;
		};

		// Flow handling
		self.paused = false;
		self.pause = function(){
			if(self.paused) return;
			self.paused = true;
			readable.pause();
		};
		self.resume = function(){
			if(!self.paused) return;
			self.paused = false;
			readable.resume();
			if(!self.paused)
				self.emit("drain");
		};

		// Hook up destroy
		self.destroy = function(){
			if(!self.ended) self.end();
			readable.destroy();
			writable.destroy();
		};

		// Hook up reset
		self.reset = function(){
			readable.reset();
			writable.reset();
			self.writable = self.readable = true;
			self.ended = self.closed = false;
		};

		return self;
	}, base = Stream, proto = klass.prototype = Object.create(base.prototype, {constructor:{value:klass}});

	return klass;
})()
