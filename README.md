CSV2XML
=======

A JavaScript utility for converting CSV data to arbitrarily structured XML.

[![browser support](https://ci.testling.com/owenscott/csv2xml.png)
](https://ci.testling.com/owenscott/csv2xml)

How to Use
----------

The CSV2XML module is simply a constructor which takes a configuration object and returns a <a href="http://nodejs.org/api/stream.html#stream_class_stream_transform">transform stream</a>. To use the returned object, pipe in CSV text, and then pipe the resulting XML to a destination of your choice.

    // example uses an XML structure from the International Aid Transparency Initiative XML Schema
    // see: http://iatistandard.org/

    $ npm install csv2xml

    var CSV2XML = require('csv2xml');
    var fs = require('fs');

    // create new parser by passing an configuration to the parser
    
    var parser = new CSV2XML({
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
		});

		// pipe a readable stream to the parser and then to a writable stream
		
		var inFile = fs.createReadStream('./some-file.csv');
		var outFile = fs.createWriteStream('./some-other-file.xml');

		inFile.pipe(parser).pipe(outFile);

Note: As of right now you *must* pass in 'sorted:true' as part of your configuration object. In the future the API will support CSVs which are sorted or unsorted by primary key (sorted CSVs allow streaming processing, which is faster and uses less memory), but this implementation only supports sorted CSVs.

Road Map
---------

This is a very new module and the API should not be considered stable. Next steps include:

* Supporting an optional callback API in addition to the streaming implementation
* Supporting CSVs without explicit primary keys
* Allowing the user to specify "constants" which are added to every XML object
* Supporting multiple input CSVs and arbitrary joins based on user configuration