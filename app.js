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
	multipipe = require('multipipe'),
	getRootNode = require('./src/getRootNode');


module.exports = function Csv2Xml(conf) {

	var self = this,
		parser = csvParse({columns:true}),
		group,
		mapFields,
		toXML,
		defaults;
	
	defaults = {
		sorted: false,
		mapping: [],
		primaryKey: ''
	}

	conf = _.extend(defaults, conf);

	//argument checking

	if (!conf.primaryKey) {
		throw new Error('Sorry. Right now csv2xml only supports CSVs with explicit primary keys. Add a "primaryKey" key-value pair to your configuration object.')
	}

	if (!conf.sorted) {
		throw new Error('Sorry. Right now csv2xml only supports CSVs which are sorted by primary key. Pass in an explicit "sorted:true" with your configuration.');
	}

	//takes the raw CSV stream and groups it into batches by primary key nad writes to 'mapFields'
	group = through( function write(data) { 

		this.backlog = this.backlog || [];
		this.history = this.history || [];

		if (data[conf.primaryKey] !== this.currentRecord && this.backlog.length) {
			this.currentRecord = data[conf.primaryKey];
			if (this.history.indexOf(this.currentRecord) > -1) {
				throw new Error('Your CSV is supposed to be sorted but you have used this primary key already. ' + this.currentRecord)
			}
			else {
				this.history.push(this.currentRecord);
			}
			console.log('Starting ' + this.currentRecord);
			console.log('==================================')
			this.queue(_.clone(this.backlog));
			this.backlog = [];
		}
		else {
			this.backlog.push(data);
		}

	});

	//takes flat JSON and converts to nested JSON according to the user-supplied configuration and writes to 'toXML'
	mapFields = through( function write (data) {
		this.queue(flatJsonToNested(data, conf))
	})


	//converts json to XML and writes to the parent function's queue (to be piped to wherever by the user)
	toXML = through( function write (data) {
		this.queue(json2xml('iati-activity', data))
		this.queue('\n');	
	});

	// combine above meothods and return as transform stream
	return multipipe(parser, group, mapFields, toXML);

}
