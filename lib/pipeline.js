var Stream = require("stream"),
	duplex = require("./duplex");


exports = module.exports = function getPipelineStream(throughStreams){
	var t = typeof(throughStreams) == "object" && typeof(throughStreams.length) === "number" ? throughStreams : Array.prototype.slice.call(arguments, 0);

	if(t.length === 0)
		return through();

	if(t.length === 1)
		return t[0];

	for(var i = 0, l = t.length - 1; i < l; i++){   // chain events together for the inner streams
		t[i].pipe(t[i + 1]);
		//TODO: get sub-stream initiated end, error, reset, close, etc working
	}

	var s = duplex(t[0], t[l]);

	s.end = function(){
		for(var i = 0, l = t.length; i < l; i++)
			t[i].end();
		s.ended = true;
	};

	s.reset = function(){
		for(var i = 0, l = t.length - 1; i < l; i++){   // chain events together for the inner streams
			t[i].pipe(t[i + 1]);
			t[i].reset();
		}
		t[l].reset();
		s.ended = false;
	};

	return s;
};
