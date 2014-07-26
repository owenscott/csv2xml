//assumptions:
//	csv2xml(data, conf) is a synchronous call (not handled yet)
//	csv2xml(data, conf, callback) is an asynchronous call
//	csv2xml(conf) creates a streaming parser

//everything is still streaming unless there is a primaryKey but no 


//takes csv data as an array of strings and mapping as an object

var fs = require('fs'), 
	WritableStream = require('stream').Writable,
	csvParse = require('csv-parse'),
	flatJsonToNested = require('./src/flatJsonToNested'),
	json2xml = require('js2xmlparser'),
	through = require('through'),
	_ = require('lodash'),
	multipipe = require('multipipe');


module.exports = function Csv2Xml(conf) {

	return through(function write (data) {

		var self = this,
			parser = csvParse({columns:true}),
			group = new WritableStream({ objectMode: true }),
			mapFields = new WritableStream({ objectMode: true }),
			toXML = new WritableStream({ objectMode: true });
			// split = split();

		//converts json to XML and writes to the parent function's queue (to be piped to wherever by the user)
		toXML._write = function(chunk, enc, next) {
			data = JSON.parse(chunk.toString());
			self.queue(json2xml('iati-activity', data))
			self.queue('\n');	
			next();	
		}

		//takes flat JSON and converts to nested JSON according to the user-supplied configuration and writes to 'toXML'
		mapFields._write = function(chunk, enc, next) {
			var data = JSON.parse(chunk.toString());
			toXML.write(JSON.stringify(flatJsonToNested(data, conf)), 'utf8')
			next();
		}

		//takes the raw CSV stream and groups it into batches by primary key nad writes to 'mapFields'
		group._write = function(chunk, enc, next) {

			var data = JSON.parse(chunk.toString());

			this.backlog = this.backlog || [];

			if (data[conf.primaryKey] !== this.currentRecord && this.backlog.length) {
				this.currentRecord = data[conf.primaryKey];
				// console.log('Starting ' + this.currentRecord);
				// console.log('==================================')
				mapFields.write(JSON.stringify(_.clone(this.backlog)), 'utf8');
				this.backlog = [];
			}
			else {
				this.backlog.push(data);
			}
			next();

		};

		//parses the CSV text into flat json objects (one per row) and then writes to 'group'
		parser.on('data', function(data) {
			// console.log('parser');
			group.write(JSON.stringify(data), 'utf8');
		});

		// split.on('data', function(data) {
		// 	parser.write(data);
		// });

		// split.write(data);

		parser.write(data);

	})
}
