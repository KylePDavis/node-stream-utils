var ThroughStream = require("./ThroughStream"),
	DuplexedStream = require("./DuplexedStream"),
	PipelineStream = require("./PipelineStream");

exports = module.exports = {
	ThroughStream: ThroughStream,		through: ThroughStream,
	DuplexedStream: DuplexedStream,		duplex: DuplexedStream,
	PipelineStream: PipelineStream,		pipeline: PipelineStream
};
