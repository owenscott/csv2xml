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

	var self = this,
		parser = csvParse({columns:true}),
		group,
		mapFields,
		toXML;
		// split = split();

	//converts json to XML and writes to the parent function's queue (to be piped to wherever by the user)
	toXML = through( function write (data) {
		this.queue(json2xml('iati-activity', data))
		this.queue('\n');	
	});

	//takes flat JSON and converts to nested JSON according to the user-supplied configuration and writes to 'toXML'
	mapFields = through( function write (data) {
		this.queue(flatJsonToNested(data, conf))
	})

	//takes the raw CSV stream and groups it into batches by primary key nad writes to 'mapFields'
	group = through( function write(data) { 

		this.backlog = this.backlog || [];

		if (data[conf.primaryKey] !== this.currentRecord && this.backlog.length) {
			this.currentRecord = data[conf.primaryKey];
			// console.log('Starting ' + this.currentRecord);
			// console.log('==================================')
			this.queue(_.clone(this.backlog));
			this.backlog = [];
		}
		else {
			this.backlog.push(data);
		}

	});

	//parses the CSV text into flat json objects (one per row) and then writes to 'group'

	return multipipe(parser, group, mapFields, toXML);

}
