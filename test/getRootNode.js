var test = require('tape'),
	getRootNode = require('./../src/getRootNode.js');


var mapping = {
	'project id': ['iati-activity','other-identifier','#'],
	'title': ['iati-activity','title','#'],
	'sector name': ['iati-activity','sector','#'],
	'sector code': ['iati-activity','sector','@','code']
}

var mapping2 = {
	'project id': ['iati-activities','iati-activity','other-identifier','#'],
	'title': ['iati-activities', 'iati-activity', 'title'],
	'sector name': ['iati-activities', 'iati-activity', 'sector', '#'],
	'sector code': ['iati-activities', 'iati-activity', 'sector', '@', 'code']
}

test('getRootNode: Get root node should return the deepest common node for a set of mappings', function(t) {
	t.plan(2);
	t.deepEqual(getRootNode(mapping), ['iati-activity'], 'Mapping should be [\'iati-activity\'] for a shallow set of mappings.');
	//failing test:
	t.deepEqual(getRootNode(mapping2), ['iati-activities', 'iati-activity'], 'Mapping should be [\'iati-activities\', \'iati-activity\'] for a deepers set of mappings.')
})