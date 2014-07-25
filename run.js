var fs = require('fs'),
	Csv2Xml = require('./app.js');


var tables = {
	exampleTable: {
		primaryKey:'project_ID',
		mapping: {
			'project_ID': ['iati-activity','iati-identifier','#'],
			'transaction_values': ['iati-activity','transaction','value','#'],
			'transaction_type_code': ['iati-activity','transaction','transaction-type','@','code'],
			'transaction_type_name': ['iati-activity','transaction','transaction-type','#'],
			'transaction_date': ['iati-activity','transaction','transaction-date','#'],
			'project_title': ['iati-activity','title','#'],
			'ad_sector_name': ['iati-activity','sector','#'],
			'ad_sector_code': ['iati-activity','sector','@','code'],
			'precision_code': ['iati-activity','location','coordinates','@','precision'],
			'geoname_ID': ['iati-activity','location','gazetteer-entry','@','gazetteer-ref'],
			'location_type': ['iati-activity','location','location-type','#'],
			'location_code': ['iati-activity','location','location-type','@','code'],
			'latitude': ['iati-activity','location','coordinates','@','latitude'],
			'longitude': ['iati-activity','location','coordinates','@','longitude'],
			'placename': ['iati-activity','location','name','#'],
			'donors': ['iati-activity','participating-org','#'],
			'iati_donor_codes': ['iati-activity','participating-org','@','ref'],
			'status': ['iati-activity','activity-status','#']

		}
	}
}


var test = new Csv2Xml(tables.exampleTable);

var inFile = fs.createReadStream('./test/data/np_join_split.csv');
var outFile = fs.createWriteStream('./result.xml');

inFile.pipe(test).pipe(outFile);