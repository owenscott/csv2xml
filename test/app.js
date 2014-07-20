var app = require('./../app.js');

// var csvData = {
// 	exampleTable: 'project id,title,sector name,sector code\r\n1,Example Project 1,Agriculture,A\r\n1,Example Project 1,Food Production,FP\r\n2,Example Project 2,Noise,N'
// }

var csvData = {};

// var csvData = { exampleTable: 'project_ID,transaction_values,transaction_date,transaction_baseYear,transaction_type_code,transaction_type_name,projectLocation_ID,precision_code,geoname_ID,placename,latitude,longitude,location_type,location_code,loc_type_desc,project_title,date_of_effectiveness,actual_start_date,date_of_agreement,donors,iati_donor_codes,ad_sector_code,ad_sector_name,status\r\n' +
// 	'8723851781,0,2001-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,210,Transport and Storage,\r\n' +
// 	'8723851781,0,2001-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,210,Transport and Storage,'
// };

var tables = {
	exampleTable: {
		primaryKey:'project_ID',
		mapping: {
			'project_ID': ['iati-activity','iati-identifier','#'],
			'transaction_values': ['iati-activity','transaction','value','#'],
			'transaction_type_code': ['iati-activity','transaction','transaction-type','@','code'],
			'transaction_type_name': ['iati-activity','transaction','transaction-type','#'],
			'project_title': ['iati-activity','title','#'],
			'ad_sector_name': ['iati-activity','sector','#'],
			'ad_sector_code': ['iati-activity','sector','@','code'],
			'precision_code': ['iati-activity','location','coordinates','@','precision'],
			'geoname_ID': ['iati-activity','location','gazetteer-entry','@','gazetteer-ref'],
			'location_type': ['iati-activity','location','location-type','#'],
			'location_code': ['iati-activity','location','location-type','@','code'],
			'latitude': ['iati-activity','location','coordinates','@','latitude'],
			'longitude': ['iati-activity','location','coordinates','@','longitude'],
			'placename': ['iati-activity','location','name','#']
		}
	}
}

var fs = require('fs');

csvData.exampleTable = fs.readFileSync('./test/data/np_join_split_big.csv').toString();

app(csvData, tables, function(err, res) {

	fs.writeFileSync('./result.xml', res)
})

//projectLocation_ID			loc_type_desc		date_of_effectiveness	actual_start_date	date_of_agreement	donors	iati_donor_codes	ad_sector_code	ad_sector_name	status

// {
// 	project_ID: 'iati-activity/iati-identifier/text()',
// 	project_title: 'iati-activity/title/text()',
// 	ad_sector_name: 'iati-activity/sector/text()',
// 	ad_sector_code: 'iati-activity/sector/@code',
// 	precision_code: 'iati-activity/location/coordinates/@precision',
// 	geoname_ID: 'iati-activity/location/gazetteer-entry/@gazetteer-ref',
// 	location_type: 'iati-activity/location/location-type/text()',
// 	location_code: 'iati-activity/location/location-type/@code',
// 	latitude: 'iati-activity/location/coordinates/@latitude',
// 	longitude: 'iati-activity/location/coordinates/@longitude',
// 	placename: 'iati-activity/location/name/text()'
// }


// 8723851781,0,2000-01-01,2011,C,Commitment,8723851781_7289707,4,7289707,Central Region,27.45436,85.22301,first-order administrative division,ADM1,"a primary administrative division of a country, such as a state in the United States",District Roads Support Program (DRSP) Phase IV,2010-07-17,2010-07-17,2006-11-09,Swiss Agency for Development and Cooperation,11000,430,Other,On-Going
// 8723851781,0,2001-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,210,Transport and Storage,
// 8723851781,0,2002-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2003-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2004-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2005-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2006-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2007-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2008-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2009-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,18469928.83,2010-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2011-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,3779472.45,2012-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,4024139.09,2013-01-01,2013,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2001-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2002-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2003-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2004-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2005-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2006-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2007-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2008-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2009-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,6609115.45,2010-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,3789109.01,2011-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,8415711.52,2012-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,5074451.059,2013-01-01,2013,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2000-01-01,2011,C,Commitment,8723851781_7289708,4,7289708,Eastern Region,27.23998,87.14802,first-order administrative division,ADM1,"a primary administrative division of a country, such as a state in the United States",District Roads Support Program (DRSP) Phase IV,2010-07-17,2010-07-17,2006-11-09,Swiss Agency for Development and Cooperation,11000,430,Other,On-Going
// 8723851781,0,2001-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,210,Transport and Storage,
// 8723851781,0,2002-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2003-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2004-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2005-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2006-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2007-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2008-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2009-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,18469928.83,2010-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2011-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,3779472.45,2012-01-01,2011,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,4024139.09,2013-01-01,2013,C,Commitment,,,,,,,,,,,,,,,,,,
// 8723851781,0,2001-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2002-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2003-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2004-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2005-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2006-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2007-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2008-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,0,2009-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,6609115.45,2010-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,3789109.01,2011-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,8415711.52,2012-01-01,2011,D,Disbursement,,,,,,,,,,,,,,,,,,
// 8723851781,5074451.059,2013-01-01,2013,D,Disbursement,,,,,,,,,,,,,,,,,,