var parseXPath = require('./../src/parseXPath'),
	test = require('tape');

test('parseXPath: Should parse some simply XPath strings into arrays', function(t) {
	t.plan(3);
	t.deepEqual(parseXPath('iati-activities/iati-activity/title', {}), ['iati-activities','iati-activity','title'], 'Parses a simple statement with only elements');
	t.deepEqual(parseXPath('iati-activities/iati-activity/title/text()', {}),['iati-activities','iati-activity','title','#'], 'Parses a simple statement with element text');
	t.deepEqual(parseXPath('iati-activities/iati-activity/title/@lang', {}), ['iati-activities','iati-activity','title','@','lang'], 'Parses a simple statement with an attribute')
});