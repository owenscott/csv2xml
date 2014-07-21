
//takes csv data as an array of strings and mapping as an object

var flatJsonToNested = require('./src/flatJsonToNested'),
	csvParse = require('csv-parse'),
	json2xml = require('js2xmlparser'),
	fs = require('fs'),
	_ = require('lodash');




module.exports = function(csvData, tables, callback) {


	
	var result;

	csvData = csvData || {};
	tables = tables || {};


	//TODO: this is a hack (exampleTable)
	csvParse(csvData.exampleTable, {columns:true}, function(err, jsonData) {
		
		if (err) {
			throw err;
		}
		
		console.log('csv parsed')


		if (callback) {

			result = flatJsonToNested(jsonData, tables.exampleTable);

			result = json2xml('iati-activities', result);

			//TODO: make async
			callback({}, result);

		}


		else {

			var keys = _.chain(jsonData).pluck(tables.exampleTable.primaryKey).uniq().value();

			var result = fs.createWriteStream('./result.xml');

			jsonData = _.groupBy(jsonData, function(d) {return d[tables.exampleTable.primaryKey]});



			_.keys(jsonData).forEach(function(key, i) {
				
				var query = {};

				console.log(i + ' of ' + keys.length);

				query[tables.exampleTable.primaryKey] = key;

				var data = _.clone(jsonData[key]),
					partialResult = flatJsonToNested(data, tables.exampleTable);

				result.write(json2xml('foo', partialResult));

			})
		}

	})



}