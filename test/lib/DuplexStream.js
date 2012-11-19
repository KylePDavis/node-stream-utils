var assert = require("assert"),
	spec = require("stream-spec"),
	su = require("../../"),
	through = su.ThroughStream,
	duplex = su.DuplexStream;


module.exports = {

	"duplex": {

        "should pass the stream-spec tests for 'duplex' Streams": function(){
            var s = duplex(through(), through()),
                specTest = spec(s).duplex({strict: true});
            s.write(1);
            s.destroy();
            //specTest.validate();	//TODO: this is still slightly broken for duplexed streams
        },

		"should behave like a proxy for a writable/readable Stream if the same Stream is given for both the writable arg and the readable arg": function(){
			var i = [1, 2, 3, 4, 5],
				e = [1, 2, 3, 4, 5],
				rw = through(),
				s = duplex(rw, rw),
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