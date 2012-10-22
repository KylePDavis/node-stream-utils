var Stream = require("stream");


exports = module.exports = function getDuplexedStream(writable, readable){
	// Keyword-args Object support
	if(arguments.length === 1 && typeof(arguments[0]) === "object" && arguments[0].constructor.name === "Object"){
		var o = arguments[0];
		writable = o.writable;
		readable = o.readable;
	}

	// Sanity checks
	if(writable && typeof(writable) !== "object" && writable.writable === true) throw new Error("The writable Stream must be writable.");
	if(readable && typeof(readable) !== "object" && readable.readable === true) throw new Error("The readable Stream must be readable.");

	var s = new Stream();

	// Shared close event
	s.closed = false;
	function _close(){
		if(s.closed) return;
		s.emit("close");
		s.closed = true;
	}

	// Hook up writable
	s.writable = s.readable = true;
	["drain", "error", "pipe"].forEach(function(eventName){
		writable.on(eventName, s.emit.bind(s, eventName));
	});
	writable.on("close", _close);
	s.write = writable.write.bind(writable);

	// Hook up readable
	s.ended = false;
	["data", "end", "error"].forEach(function(eventName){
		readable.on(eventName, s.emit.bind(s, eventName));
	});
	readable.on("close", _close);
	s.end = function(){
		if(s.ended) return;
		s.ended = true;
		s.readable = false;
		readable.end();
		writable.end();
		s.writable = false;
	};

	// Flow handling
	s.paused = false;
	s.pause = function(){
		if(s.paused) return;
		s.paused = true;
		readable.pause();
	};
	s.resume = function(){
		if(!s.paused) return;
		s.paused = false;
		readable.resume();
		if(!s.paused)
			s.emit("drain");
	};

	// Hook up destroy
	s.destroy = function(){
		if(!s.ended) s.end();
		readable.destroy();
		writable.destroy();
	};

	// Hook up reset
	s.reset = function(){
		readable.reset();
		writable.reset();
		s.writable = s.readable = true;
		s.ended = s.closed = false;
	};

	return s;
};
