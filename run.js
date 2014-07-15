var csvJson2XmlJson = require('./src/csvJson2XmlJson.js'),
	getRootNode = require('./src/getRootNode.js'),
	test = require('tape');


var mapping = {
	'project id': ['iati-activity','other-identifier','#'],
	'title': ['iati-activity','title','#'],
	'sector name': ['iati-activity','sector','#'],
	'sector code': ['iati-activity','sector','@','code']
}

var primaryKey = 'project id';


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

var result = {"iati-activity":[{"other-identifier":[{"#":"1","@":{}}],"title":[{"#":"Example Project 1","@":{}}],"sector":[{"#":"Agriculture","@":{"code":"A"}},{"#":"Food Production","@":{"code":"FP"}}]},{"other-identifier":[{"#":"2","@":{}}],"title":[{"#":"Example Project 2","@":{}}],"sector":[{"#":"Noise Pollution","@":{"code":"NP"}}]}]};

var rootNode = getRootNode(mapping);

var options = {
	primaryKey: primaryKey,
	mapping: mapping,
	rootNode: rootNode
}

console.log(csvJson2XmlJson(data, options), null, 1)