//TODO:
	// - mapValueToNode, and addDataToNode are all very similar => try to refactor
	// - getRootNode probably belongs outside of this module, with the root node passed in as an argument
	// - other TODO notes scattered within


var _ = require('underscore');
var getRootNode = require('./getRootNode.js');
var deepExtend = require('./deepExtend.js');

var mapping = {
	'project id': ['iati-activity','other-identifier','#'],
	'title': ['iati-activity','title','#'],
	'sector name': ['iati-activity','sector','#'],
	'sector code': ['iati-activity','sector','@','code']
}

var primaryKey = 'project id';

var options = {};

options.primaryKey = primaryKey;

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


//find the root node
//create an object with everything up to the root node
//if primary key then create an empty object
//else create an empty array
//reverse the mapping

//iterate through the data
//for each row either access the right object (by primary key) or create a blank object 
//use the mapping to build that into an object
//extend the destination object with the source object

//set the deepest level of the root object to the new array thing

var rootNode = getRootNode(mapping);

var simplifiedMapping = {}

_.map(mapping, function(m, k) {
	simplifiedMapping[k] = m.slice(rootNode.length, m.length);
})

var buildObjectFromKeyArray = function (keyArray, value) {
	var obj = {};
	if (keyArray.length > 1) {
		obj[keyArray[0]] = buildObjectFromKeyArray(keyArray.slice(1,keyArray.length), value);
	}
	else {
		obj[keyArray[0]] = value;
	}
	return _.clone(obj);
}

var result = options.primaryKey ? {} : [];

data.forEach(function(d) {
	var row = {};
	_.map(simplifiedMapping, function(m, k) {
		var tempObject;
		if (d[k]) {
			tempObject = buildObjectFromKeyArray(m, d[k]);
			row = deepExtend(row, tempObject);
		}
	})
	if (options.primaryKey && !d[options.primaryKey]) {
		throw 'Custom Error: No primary key for row d';
	}
	else if (options.primaryKey) {
		result[d[options.primaryKey]] = result[d[options.primaryKey]] || {};
		result[d[options.primaryKey]] = deepExtend(result[d[options.primaryKey]], row, {arrayify: true, allowDuplicates: false})
	}
	else {
		result.push(row);
	}
})



console.log(JSON.stringify(result));




