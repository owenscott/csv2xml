//assumptions:
//	csv2xml(data, conf) is a synchronous call (not handled yet)
//	csv2xml(data, conf, callback) is an asynchronous call
//	csv2xml(conf) creates a streaming parser

//everything is still streaming unless there is a primaryKey but no 


//takes csv data as an array of strings and mapping as an object

var flatJsonToNested = require('./src/flatJsonToNested'),
	csvParse = require('csv-parse'),
	json2xml = require('js2xmlparser'),
	fs = require('fs'),
	_ = require('lodash'),
	through = require('through'),
	WritableStream = require('stream').Writable;



var fs = require('fs'), 
	WritableStream = require('stream').Writable,
	csvParse = require('csv-parse'),
	flatJsonToNested = require('./src/flatJsonToNested'),
	json2xml = require('js2xmlparser'),
	through = require('through'),
	_ = require('lodash');


module.exports = function Csv2Xml(conf) {

	return through(function write (data) {

		var self = this,
			parser = csvParse({columns:true}),
			group = WritableStream(),
			mapFields = WritableStream(),
			toXML = WritableStream(),
			splitter = WritableStream();

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
		})


		parser.write(data);

	})
}



// module.exports = function csv2xml (dataOrConf, conf, callback) {

// 	csvData = csvData || {};
// 	tables = tables || {};

// 	//lazy assumption that if callback is present other args are present
// 	if ((callback) {
// 			//TODO: implement with callback
// 			//need to pipe the result into the other streams, aggregate it all, and then send it to the callback
// 	}

// 	//return a stream
// 	else {

// 		(function() {

// 			var primaryKey = tables[TABLE_NAME].primaryKey,
// 				parser = csvParse({columns:true}),
// 				group,
// 				mapFields,
// 				toXML;

// 				mapFields = WritableStream():

// 				mapFields._write = function(chunk, enc, next) {
// 					this.queue(flatJsonToNested(data, tables.exampleTable));
// 				})

// 				group = WritableStream();
					
// 				group._write = function(chunk, enc, next) {

// 					this.backlog = this.backlog || [];

// 					if (data[primaryKey] !== this.currentRecord) {
// 						this.currentRecord = data[primaryKey];
// 						console.log('Starting ' + this.currentRecord);
// 						console.log('==================================')
// 						mapFields.write(this.backlog);
// 						this.backlog = [];
// 					}
// 					this.backlog.push(chunk);
// 				};

			

// 				toXML = through (function write(data) {
// 					var options = {declaration: {
// 						include: false
// 					}}
// 					this.queue (json2xml('iati-activity', data))
// 					this.queue('\n');
// 				})

// 		})();
// 	}

// }





// 			// output.write('<foo>');

// input.pipe(parser).pipe(group).pipe(mapFields).pipe(toXML).pipe(output);

// 			// output.write('</foo>');

// 			// jsonData = _.groupBy(jsonData, function(d) {return d[tables.exampleTable.primaryKey]});



// 			// _.keys(jsonData).forEach(function(key, i) {
				
// 			// 	var query = {};

// 			// 	console.log('==========================================================================')
// 			// 	console.log((i+1) + ' of ' + keys.length);
// 			// 	console.log(key);
// 			// 	console.log('==========================================================================')


// 			// 	query[tables.exampleTable.primaryKey] = key;

// 			// 	var data = _.clone(jsonData[key]),
// 			// 		partialResult = _.clone(flatJsonToNested(data, tables.exampleTable));

// 			// 	result.write(json2xml('foo', partialResult));

// 		// 	})
// 		// }
// 	// })
// }