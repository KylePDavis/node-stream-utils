var assert = require("assert"),
	su = require("../../"),
	through = su.ThroughStream,
	pipeline = su.PipelineStream;


module.exports = {

	"pipeline": {

		"should be able to combine 0 no-op Streams without side effects (and it should be reusable)": function(){
			var i = [1, 2, 3, 4, 5],
				e = [1, 2, 3, 4, 5],
				s = pipeline(),
				a = [];
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
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
		},

		"should be able to combine 1 no-op Stream without side effects (and it should be reusable)": function(){
			var i = [1, 2, 3, 4, 5],
				e = [1, 2, 3, 4, 5],
				s = pipeline(through()),
				a = [];
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
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
		},

		"should be able to combine 2 no-op Streams without side effects (and it should be reusable)": function(){
			var i = [1, 2, 3, 4, 5],
				e = [1, 2, 3, 4, 5],
				s = pipeline(through()),
				a = [];
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
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
		},

		"should be able to combine multiple no-op Streams without side effects (and it should be reusable)": function(){
			var i = [1, 2, 3, 4, 5],
				e = [1, 2, 3, 4, 5],
				s = pipeline(through(), through(), through()),
				a = [];
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
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
		},

		"should be able to combine multiple Object transformation Streams without side effects (and it should be reusable)": function(){
			var i = [1, 2, 3, 4, 5],
				e = [1, 2, 3, 4, 5],
				s = pipeline(through(), through(), through()),
				a = [];
			s.on("data", a.push.bind(a));
			i.forEach(s.write.bind(s));
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


if (!module.parent)(new(require("mocha"))()).ui("exports").reporter("spec").addFile(__filename).run(process.exit);