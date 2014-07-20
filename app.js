
//takes csv data as an array of strings and mapping as an object

var flatJsonToNested = require('./src/flatJsonToNested'),
	csvParse = require('csv-parse'),
	json2xml = require('js2xmlparser');




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

		result = flatJsonToNested(jsonData, tables.exampleTable);

		result = json2xml('iati-activities', result);

		//TODO: make async
		callback({}, result);

	})



}