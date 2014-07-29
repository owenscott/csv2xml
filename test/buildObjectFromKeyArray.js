var test = require('tape'),
	buildObjectFromKeyArray = require('./../src/buildObjectFromKeyArray')

var rootNode = ['iati-activities','iati-activity'];

test('buildObjectFromKeyArray: Passing in a key array and a value should result in an object', function(t) {
	t.plan(1);
	t.deepEqual(buildObjectFromKeyArray(rootNode,[]), {'iati-activities':{'iati-activity':[]}},
		'Two level deep nested rootNode array should create equivalent object')
})