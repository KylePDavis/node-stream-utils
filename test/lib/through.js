var assert = require("assert"),
	through = require("../../lib/through"),
	spec = require("stream-spec");


exports = module.exports = {

	"through": {

		"should not fail if no args are given": function(){
			through();
		},

		"should pass the stream-spec tests for 'through' Streams": function(){
			var s = through(),
				specTest = spec(s).through({strict: true});
			s.write(1);
			s.destroy();
			specTest.validate();
		},

		"should use default pass-thru write handler if arg not given": function(){
			var i = [1, 2, 3, 4, 5],
				e = [1, 2, 3, 4, 5],
				a = [],
				s = through();
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
			s.end();
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},

		"should allow for custom write handler as arg #1": function(){
			var e = true,
				a = false,
				s = through(function(){ a = true; });
			s.write(1);
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},
		"should allow for custom write handler in keyword args": function(){
			var e = true,
				a = false,
				s = through({
					write: function(){ a = true; }
				});
			s.write(1);
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},

		"should allow for custom end handler as arg #2": function(){
			var e = true,
				a = false,
				s = through(null, function(){ a = true; });
			s.end();
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},
		"should allow for custom end handler in keyword args": function(){
			var e = true,
				a = false,
				s = through({
					end: function(){ a = true; }
				});
			s.end();
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},

		"should allow for custom reset handler as arg #3": function(){
			var e = true,
				a = false,
				s = through(null, null, function(){ a = true; });
			s.reset();
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},
		"should allow for custom reset handler in keyword args": function(){
			var e = true,
				a = false,
				s = through({
					reset: function(){ a = true; }
				});
			s.reset();
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},

		"should be able to transform every data Object in the Stream": function(){
			var i = [1, 2, 3, 4, 5],
				e = [2, 4, 6, 8, 10],
				a = [],
				s = through(function doubler(x){
					this.queue(x*2);
				});
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},

		"should be able to transform every other data Object in the Stream": function(){
			var i = [1, 2, 3, 4, 5],
				e = [2, 6, 10],
				a = [],
				s = (function(){
					var i = 0;
					return through({
						write: function everyOtherSkipper(x){
							if(i++ % 2 === 0)
								this.queue(x * 2);
						},
						reset: function resetEveryOtherSkipper(){
							i = 0;
						}
					});
				})();
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
			// Ensure that it's reusable after reset, too
			s.reset();
			a.length = 0;	// clear the array
			i.forEach(s.write.bind(s));
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},

		"should be able to duplicate and transform every other data Object in the Stream": function(){
			var i = [1, 2, 3, 4, 5],
				e = [1, 2, 3, 6, 5, 10],
				a = [],
				s = (function(){
					var i = 0;
					return through({
						write: function dupeAndDoubleEveryOtherOnly(x){
							if(i++ % 2 === 0){
								this.queue(x);
								this.queue(x * 2);
							}
						},
						reset: function resetDupeAndDoubleEveryOtherOnly(){
							i = 0;
						}
					});
				})();
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
			// Ensure that it's reusable after reset, too
			s.reset();
			a.length = 0;	// clear the array
			i.forEach(s.write.bind(s));
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		},

		"should be able to queue output until the end and then burst results": function(){
			var i = [1, 2, 3, 4, 5],
				e = [2, 4, 6, 8, 10],
				a = [],
				s = (function(){
					var buffer = [];
					return through({
						write: function doubler(x){
							buffer.push(x * 2);
						},
						end: function endDoubler(){
							for(var i = 0, l = buffer.length; i < l; i++)
								this.queue(buffer[i]);
							buffer.length = 0;
						 }
					});
				})();
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
			assert.equal(JSON.stringify(a), JSON.stringify([]), "Unexpected value!");
			assert.deepEqual(a, [], "Unexpected value (not deepEqual)!");
			s.end();
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
			// Ensure that it's reusable after reset, too
			s.reset();
			a.length = 0;	// clear the array
			i.forEach(s.write.bind(s));
			s.end();
			assert.equal(JSON.stringify(a), JSON.stringify(e), "Unexpected value!");
			assert.deepEqual(a, e, "Unexpected value (not deepEqual)!");
		}

	}

};


if(!module.parent) (new (require("mocha"))()).ui("exports").reporter("spec").addFile(__filename).run();
