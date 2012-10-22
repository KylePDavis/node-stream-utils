var Stream = require("stream");


exports = module.exports = function getThroughStream(write, end, reset){
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

	// Build the Stream to be returned
	var s = new Stream();
	s.writable = s.readable = true;
	s.ended = false;

	// Write handling
	if(!write) write = s.emit.bind(s, "data");
	s.write = function(obj){
		if(s.ended) return false;
		drain();
		return write.call(s, obj);
	};

	// Flow handling
	s.paused = false;
	s.buffer = [];
	s.queue = function(obj){
		s.buffer.push(obj);
		if(!s.paused)
			drain();
	};
	s.dequeue = s.buffer.shift.bind(s.buffer);
	function drain(){
		if(s.paused || !s.buffer.length) return;
		while(s.buffer.length)
			s.emit("data", s.dequeue());
	}
	s.pause = function(){
		if(s.paused) return;
		s.paused = true;

	};
	s.resume = function(){
		if(!s.paused) return;
		s.paused = false;
		drain();
		if(!s.paused)
			s.emit("drain");
	};

	// End handling
	if(!end) end = s.emit.bind(s, "end");
	s.end = function(){
		if(s.ended) return;
		s.ended = true;
		s.readable = false;
		end.call(s);
		drain();
		s.writable = false;
	};

	// Destroy handling
	s.destroy = function(){
		if(!s.ended) s.end();
		s.emit("close");
	};

	// Reset handling
	if(!reset) reset = s.emit.bind(s, "reset");
	s.reset = function(){
		if(s.paused) s.resume(); else drain();
		s.writable = s.readable = true;
		s.ended = false;
		reset.call(s);
	};

	return s;
};
