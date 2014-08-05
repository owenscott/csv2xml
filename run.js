var fs = require('fs'),
	Csv2Xml = require('./app.js');

var table = {
	primaryKey:'project_ID',
	sorted: true,
	mapping: {
		'project_ID': 'iati-activities/iati-activity/iati-identifier/text()',
		'transaction_values': 'iati-activities/iati-activity/transaction/value/text()',
		'transaction_type_code': 'iati-activities/iati-activity/transaction/transaction-type/@code',
		'transaction_type_name': 'iati-activities/iati-activity/transaction/transaction-type/text()',
		'transaction_date': 'iati-activities/iati-activity/transaction/transaction-date/text()',
		'project_title': 'iati-activities/iati-activity/title/text()',
		'ad_sector_name': 'iati-activities/iati-activity/sector/text()',
		'ad_sector_code': 'iati-activities/iati-activity/sector/@code',
		'precision_code': 'iati-activities/iati-activity/location/coordinates/@precision',
		'geoname_ID': 'iati-activities/iati-activity/location/gazetteer-entry/@gazetteer-ref',
		'location_type': 'iati-activities/iati-activity/location/location-type/text()',
		'location_code': 'iati-activities/iati-activity/location/location-type/@code',
		'latitude': 'iati-activities/iati-activity/location/coordinates/@latitude',
		'longitude': 'iati-activities/iati-activity/location/coordinates/@longitude',
		'placename': 'iati-activities/iati-activity/location/name/text()',
		'donors': 'iati-activities/iati-activity/participating-org/text()',
		'iati_donor_codes': 'iati-activities/iati-activity/participating-org/@ref',
		'status': 'iati-activities/iati-activity/activity-status/text()'
	}
}

var test = new Csv2Xml(table);

var inFile = fs.createReadStream('./test/data/np_join_split.csv');
var outFile = fs.createWriteStream('./result.xml');

inFile.pipe(test).pipe(outFile);