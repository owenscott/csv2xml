var test = require('tape'),
	flatJsonToNested = require('./../src/flatJsonToNested.js');

var mapping = {
	'project id': ['other-identifier','#'],
	'title': ['title','#'],
	'sector name': ['sector','#'],
	'sector code': ['sector','@','code']
}

var primaryKey = 'project id';

var options = {};

options.primaryKey = primaryKey;
options.mapping = mapping;
options.rootElementName = 'iati-activity';

var data = [
	{
		'project id':'1',
		'title':'Example Project 1',
		'sector name':'Agriculture',
		'sector code':'A'
	},
	{
		'project id':'1',
		'title':'Example Project 1',
		'sector name':'Food Production',
		'sector code':'FP'
	},
	{
		'project id':'2',
		'title':'Example Project 2',
		'sector name':'Noise Pollution',
		'sector code':'NP'
	}
]

var expectedResult = {"iati-activity":[{"other-identifier":{"#":"1"},"title":{"#":"Example Project 1"},"sector":[{"#":"Agriculture","@":{"code":"A"}},{"#":"Food Production","@":{"code":"FP"}}]},{"other-identifier":{"#":"2"},"title":{"#":"Example Project 2"},"sector":{"#":"Noise Pollution","@":{"code":"NP"}}}]};

test('flatJsonToNested: Mapping of flat csv-like JSON object to nested object returns expected result for a given mapping and pkey', function(t) {
	t.plan(1);
	t.deepEqual(flatJsonToNested(data, options), expectedResult);
})