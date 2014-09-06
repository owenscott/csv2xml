//assumptions:
//	csv2xml(data, conf) is a synchronous call (not handled yet)
//	csv2xml(data, conf, callback) is an asynchronous call
//	csv2xml(conf) creates a streaming parser

//everything is still streaming unless there is a primaryKey but no 

//TODO: add more unit tests for JSON-XML conversion


//takes csv data as an array of strings and mapping as an object

var fs = require('fs'), 
	WritableStream = require('stream').Writable,
	csvParse = require('csv-parse'),
	flatJsonToNested = require('./src/flatJsonToNested'),
	json2xml = require('js2xmlparser'),
	through = require('through'),
	_ = require('lodash'),
	multipipe = require('multipipe'),
	getRootNode = require('./src/getRootNode'),
	stripMapping = require('./src/stripMapping'),
	buildObjectFromKeyArray = require('./src/buildObjectFromKeyArray'),
	deepExtend = require('./src/deepExtend'),
	json2xml = require('./src/json2xml'),
	parseXPath = require('./src/parseXPath');


module.exports = function Csv2Xml(conf) {

	var self = this,
		parser = csvParse({columns:true}),
		group,
		mapFields,
		toXML,
		defaults,
		rootNode,
		rootObject;
	
	defaults = {
		sorted: false,
		mapping: [],
		primaryKey: ''
	}

	conf = _.extend(defaults, conf);


	// ------------------------------------
	// | argument checking and processing |
	// ------------------------------------

	_.keys(conf.mapping).forEach(function(key) {
		conf.mapping[key] = parseXPath(conf.mapping[key]);
	});

	if (!conf.primaryKey) {
		throw new Error('Sorry. Right now csv2xml only supports CSVs with explicit primary keys. Add a "primaryKey" key-value pair to your configuration object.')
	}

	if (!conf.sorted) {
		throw new Error('Sorry. Right now csv2xml only supports CSVs which are sorted by primary key. Pass in an explicit "sorted:true" with your configuration.');
	}

	rootNode = getRootNode(conf.mapping);

	conf.mapping = stripMapping(conf.mapping, rootNode);
	conf.rootElementName = _.last(rootNode);
	rootNode = _.first(rootNode, rootNode.length - 1);

	// ---------------------
	// |       code        |
	// ---------------------

	//methods
	//=======

	//groups the CSV stream into batches by primary key
	group = through( 

		function write(data) { 
			this.backlog = this.backlog || [];
			this.history = this.history || [];
			this.currentRecord = this.currentRecord || data[conf.primaryKey];

			if (data[conf.primaryKey] !== this.currentRecord && this.backlog.length) {
				this.currentRecord = data[conf.primaryKey];			
				if (this.history.indexOf(this.currentRecord) > -1) {
					throw new Error('Your CSV is supposed to be sorted but you have used this primary key already. ' + this.currentRecord)
				}
				else {
					this.history.push(this.currentRecord);
				}
				this.queue(_.clone(this.backlog));
				this.backlog = [];
			}
			else {
				this.backlog.push(data);
			}
		}, 

		function end() {
			this.queue(_.clone(this.backlog));
			this.queue(null);
		}

	);

	//maps the flat CSV-parsed JSON objects to the nested structure indicated by the user-supplied mapping
	mapFields = through( function write (data) {
		this.queue(flatJsonToNested(data, conf))
	})

	//converts final json to XML
	toXML = new json2xml({
		attKey: '@',
		textKey: '#',
		rootObject:rootNode
	})

	//execution
	//=========

	// combine above methods and return as transform stream
	return multipipe(parser, group, mapFields, toXML);

}