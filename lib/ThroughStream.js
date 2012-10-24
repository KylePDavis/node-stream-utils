var Stream = require("stream"),
	events = require("events");


exports = module.exports = (function(){
	// CONSTRUCTOR
	var base = Stream, proto, klass = function ThroughStream(write, end, reset){

		// Function-mode support
		var self = this instanceof Stream ? this : Object.create(proto);

		// Build the Stream to be returned
		Stream.call(self);
		events.EventEmitter.call(self);	// Can't call the Stream ctor like this in Node for some reason...

		// Keyword-args Object support
		if(arguments.length === 1 && typeof(arguments[0]) === "object" && arguments[0].constructor.name === "Object"){
			var o = arguments[0];
			write = o.write;
			end = o.end;
			reset = o.reset;
		}

		// Sanity checks
		if(write && typeof(write) !== "function") throw new Error("The write handler must be a Function.");
		if(end && typeof(end) !== "function") throw new Error("The end handler must be a Function.");
		if(reset && typeof(reset) !== "function") throw new Error("The reset handler must be a Function.");

		self.writable = self.readable = true;
		self.ended = false;

		// Write handling
		if(!write) write = self.emit.bind(self, "data");
		self.write = function(obj){
			if(self.ended) return false;
			drain();
			return write.call(self, obj);
		};

		// Flow handling
		self.paused = false;
		self.buffer = [];
		self.queue = function(obj){
			self.buffer.push(obj);
			if(!self.paused)
				drain();
		};
		self.dequeue = self.buffer.shift.bind(self.buffer);
		function drain(){
			if(self.paused || !self.buffer.length) return;
			while(self.buffer.length)
				self.emit("data", self.dequeue());
		}
		self.pause = function(){
			if(self.paused) return;
			self.paused = true;

		};
		self.resume = function(){
			if(!self.paused) return;
			self.paused = false;
			drain();
			if(!self.paused)
				self.emit("drain");
		};

		// End handling
		if(!end) end = self.emit.bind(self, "end");
		self.end = function(){
			if(self.ended) return;
			self.ended = true;
			self.readable = false;
			end.call(self);
			drain();
			self.writable = false;
		};

		// Destroy handling
		self.destroy = function(){
			if(!self.ended) self.end();
			self.emit("close");
		};

		// Reset handling
		if(!reset) reset = self.emit.bind(self, "reset");
		self.reset = function(){
			if(self.paused) self.resume(); else drain();
			self.writable = self.readable = true;
			self.ended = false;
			reset.call(self);
		};

		return self;
	};
	proto = klass.prototype = Object.create(base.prototype, {constructor:{value:klass}});

	// STATIC MEMBERS
	klass.ThroughStream = klass;	// self-reference to make using the Class via Node more obvious

	return klass;
})();
