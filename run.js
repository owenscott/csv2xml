var fs = require('fs'),
	Csv2Xml = require('./app.js');

var tables = {
	exampleTable: {
		primaryKey:'project_ID',
		sorted: true,
		mapping: {
			'project_ID': ['iati-activities','iati-activity','iati-identifier','#'],
			'transaction_values': ['iati-activities','iati-activity','transaction','value','#'],
			'transaction_type_code': ['iati-activities','iati-activity','transaction','transaction-type','@','code'],
			'transaction_type_name': ['iati-activities','iati-activity','transaction','transaction-type','#'],
			'transaction_date': ['iati-activities','iati-activity','transaction','transaction-date','#'],
			'project_title': ['iati-activities','iati-activity','title','#'],
			'ad_sector_name': ['iati-activities','iati-activity','sector','#'],
			'ad_sector_code': ['iati-activities','iati-activity','sector','@','code'],
			'precision_code': ['iati-activities','iati-activity','location','coordinates','@','precision'],
			'geoname_ID': ['iati-activities','iati-activity','location','gazetteer-entry','@','gazetteer-ref'],
			'location_type': ['iati-activities','iati-activity','location','location-type','#'],
			'location_code': ['iati-activities','iati-activity','location','location-type','@','code'],
			'latitude': ['iati-activities','iati-activity','location','coordinates','@','latitude'],
			'longitude': ['iati-activities','iati-activity','location','coordinates','@','longitude'],
			'placename': ['iati-activities','iati-activity','location','name','#'],
			'donors': ['iati-activities','iati-activity','participating-org','#'],
			'iati_donor_codes': ['iati-activities','iati-activity','participating-org','@','ref'],
			'status': ['iati-activities','iati-activity','activity-status','#']
		}
	}
}

var test = new Csv2Xml(tables.exampleTable);

var inFile = fs.createReadStream('./test/data/np_join_split.csv');
var outFile = fs.createWriteStream('./result.xml');

inFile.pipe(test).pipe(outFile);