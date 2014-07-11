var _ = require('underscore');
var js2xmlparser = require("js2xmlparser");

var mapping = {
	'project id': ['iati-activity','other-identifier','#'],
	'title': ['iati-activity','title','#'],
	'sector name': ['iati-activity','sector','#'],
	'sector code': ['iati-activity','sector','@','code']
}

var reverseMapping = function(mapping) {
	var result = {};
	_.keys(mapping).forEach(function(key) {
		result = mapValueToNode(result, mapping[key], key)
	})
	return result;
}

function mapValueToNode(currentNode, path, value) {
	if (path.length > 1) {
		var nextStep = path[0];
		currentNode[nextStep] = currentNode[nextStep] || {};
		mapValueToNode(currentNode[nextStep], path.slice(1,path.length), value);
	}
	else {
		var nextStep = path[0];
		currentNode[nextStep] = value; 
	}
	return currentNode;
}


console.log(JSON.stringify(reverseMapping(mapping)));

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

var getRootNode = function(mapping) {

	var mappingAsArray = _.map(mapping, function(m) {return m});

	var getUniqueValues = function(mapping, depth) {
		return _.chain(mappingAsArray).map(function(m) {return m[depth]}).uniq().value();
	}

	var iterate = function(depth) {	
		if (getUniqueValues(mapping, depth).length > 1) {
			return getUniqueValues(mapping, depth - 1);
		}
		else {
			return iterate(depth + 1);
		}
	}

	return iterate(0);

}

var rootNode = getRootNode(mapping);

var columns = _.keys(mapping);

var result = {};

result[rootNode] = {};


var alternativeMapping = reverseMapping(mapping)[rootNode];

function serializeChildren (nodes) {
	return _.chain(nodes).map(serializeNode).uniq().value();
}

function serializeNode(node) {
	return JSON.stringify(node);
}

function addDataToNode(node, options) {


	var children,
		text,
		attributes,
		mapping = options.mapping,
		data = options.data;

	node = _.clone(node); //just to be safe (dev)

	_.keys(mapping).forEach(function(m) {
		

		var attributes = mapping[m]['@'];
		text = data[_.pick(mapping[m],'#')['#']];
		children = _.omit(mapping[m], ['@','#']),
		newNode = {};

		node[m] = node[m] || [];

		newNode['#'] = text;
		newNode['@'] = {};

		_.keys(attributes).forEach(function(a) {
			var attributeText = data[attributes[a]];
			if (attributeText) {
				newNode['@'][a] = attributeText
			}
		})


		if (children) {
			//do something (probably call self recursively)
		}

		if (!_.contains(serializeChildren(node[m]),serializeNode(newNode))){
			node[m].push(newNode);
		}

	})

	return _.clone(node);
}



data.forEach(function(row) {


	
	result[rootNode][row[primaryKey]] = result[rootNode][row[primaryKey]] || {};

	result[rootNode][row[primaryKey]] = addDataToNode(result[rootNode][row[primaryKey]], {
		mapping:alternativeMapping,
		data:row
	});


});



var tempArr = [];

_.keys(result[rootNode]).forEach(function(key) {
	tempArr.push(result[rootNode][key]);
})

result[rootNode] = tempArr;



console.log(js2xmlparser('iati-activities', result))
