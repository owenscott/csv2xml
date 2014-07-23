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

var TABLE_NAME = 'exampleTable';

module.exports = function csv2xml (dataOrConf, conf, callback) {

	csvData = csvData || {};
	tables = tables || {};

	//lazy assumption that if callback is present other args are present
	if ((callback) {
			//TODO: implement with callback
			//need to pipe the result into the other streams, aggregate it all, and then send it to the callback
	}

	else {
		(function() {

			var primaryKey = tables[TABLE_NAME].primaryKey,
				parser = csvParse({columns:true}),
				group,
				mapFields,
				toXML;

				mapFields = WritableStream():

				mapFields._write = function(chunk, enc, next) {
					this.queue(flatJsonToNested(data, tables.exampleTable));
				})

				group = WritableStream();
					
				group._write = function(chunk, enc, next) {

					this.backlog = this.backlog || [];

					if (data[primaryKey] !== this.currentRecord) {
						this.currentRecord = data[primaryKey];
						console.log('Starting ' + this.currentRecord);
						console.log('==================================')
						mapFields.write(this.backlog);
						this.backlog = [];
					}
					this.backlog.push(chunk);
				};

			

				toXML = through (function write(data) {
					var options = {declaration: {
						include: false
					}}
					this.queue (json2xml('iati-activity', data))
					this.queue('\n');
				})

		})();
	}

}




			var 

			// output.write('<foo>');

			input.pipe(parser).pipe(group).pipe(mapFields).pipe(toXML).pipe(output);

			// output.write('</foo>');

			// jsonData = _.groupBy(jsonData, function(d) {return d[tables.exampleTable.primaryKey]});



			// _.keys(jsonData).forEach(function(key, i) {
				
			// 	var query = {};

			// 	console.log('==========================================================================')
			// 	console.log((i+1) + ' of ' + keys.length);
			// 	console.log(key);
			// 	console.log('==========================================================================')


			// 	query[tables.exampleTable.primaryKey] = key;

			// 	var data = _.clone(jsonData[key]),
			// 		partialResult = _.clone(flatJsonToNested(data, tables.exampleTable));

			// 	result.write(json2xml('foo', partialResult));

		// 	})
		// }
	// })
}