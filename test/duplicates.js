var csvData = {},
	fs = require('fs'),
	flatJsonToNested = require('./../src/flatJsonToNested'),
	eliminateDuplicates = require('./../src/eliminateDuplicates'),
	csvParse = require('csv-parse'),
	test = require('tape');


var tables = {
	exampleTable: {
		primaryKey:'project_ID',
		mapping: {
			'project_ID': ['iati-activity','iati-identifier','#'],
			// 'transaction_values': ['iati-activity','transaction','value','#'],
			// 'transaction_type_code': ['iati-activity','transaction','transaction-type','@','code'],
			// 'transaction_type_name': ['iati-activity','transaction','transaction-type','#'],
			// 'project_title': ['iati-activity','title','#'],
			'ad_sector_name': ['iati-activity','sector','#'],
			'ad_sector_code': ['iati-activity','sector','@','code'],
			// 'precision_code': ['iati-activity','location','coordinates','@','precision'],
			// 'geoname_ID': ['iati-activity','location','gazetteer-entry','@','gazetteer-ref'],
			// 'location_type': ['iati-activity','location','location-type','#'],
			// 'location_code': ['iati-activity','location','location-type','@','code'],
			// 'latitude': ['iati-activity','location','coordinates','@','latitude'],
			// 'longitude': ['iati-activity','location','coordinates','@','longitude'],
			// 'placename': ['iati-activity','location','name','#']
		}
	}
}

csvData.exampleTable = fs.readFileSync('./test/data/duplicates.csv').toString();


csvParse(csvData.exampleTable, {columns:true}, function(err, jsonData) {
	
	if (err) {
		throw err;
	}
	
	result = flatJsonToNested(jsonData, tables.exampleTable);


	console.log(JSON.stringify(result['iati-activity'][0].sector));


})

[[[{"#":"Other","@":{"code":"430"}},{"#":"Transport and Storage","@":{"code":"210"}}],{"#":"Other","@":{"code":"430"}}],{"#":"Transport and Storage","@":{"code":"210"}}]