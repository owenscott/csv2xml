var test = require('tape'),
	stripMapping = require('./../src/stripMapping');


test('stripMapping: Function removes root node(s) from mapping objects', function(t) {

	var mapping1 = {
		'project id': ['iati-activity','other-identifier','#'],
		'title': ['iati-activity','title','#']
	}

	var rootNode1 = ['iati-activity'];

	var mapping2 = {
		'project id': ['iati-activities', 'iati-activity','other-identifier','#'],
		'title': ['iati-activities','iati-activity','title','#']
	}

	var rootNode2 = ['iati-activities','iati-activity'];

	t.plan(2);

	t.deepEqual(stripMapping(mapping1,rootNode1), {
		'project id':['other-identifier','#'],
		'title':['title','#']
	}, 'Removes a single root node from an object');

	t.deepEqual(stripMapping(mapping2,rootNode2), {
		'project id':['other-identifier','#'],
		'title':['title','#']
	}, 'Removes mutiple root nodes from an object');


})


