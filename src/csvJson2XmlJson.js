//TODO:
	// - mapValueToNode, and addDataToNode are all very similar => try to refactor
	// - getRootNode probably belongs outside of this module, with the root node passed in as an argument
	// - other TODO notes scattered within


var _ = require('underscore');
var getRootNode = require('./getRootNode.js');



var JsonMapper = function(options) {
	
	var mapping = options.mapping,
		primaryKey = options.primaryKey,
		rootNode = options.rootNode,
		columns = _.keys(mapping),
		reversedMapping,
		mapValueToNode,
		result;

	//assigns a value to a child node (defined by path) of given node
	mapValueToNode = function(currentNode, path, value) {
		
		var nextStep;

		if (path.length > 1) {
			nextStep = path[0];
			currentNode[nextStep] = currentNode[nextStep] || {};
			mapValueToNode(currentNode[nextStep], path.slice(1,path.length), value);
		}
		else {
			nextStep = path[0];
			currentNode[nextStep] = value; 
		}
		return currentNode;
	
	}

	//reverses the mapping provided by the user into a more traversable format
	reverseMapping = function(mapping) {
		var result = {};
		_.keys(mapping).forEach(function(key) {
			result = mapValueToNode(result, mapping[key], key)
		})
		return result;
	}


	serializeChildren = function (nodes) {
		return _.chain(nodes).map(serializeNode).uniq().value();
	}

	serializeNode = function (node) {
		return JSON.stringify(node);
	}
	
	//adds XML-style data to a node of a json document based on options.mapping supplied to child nodes
	addDataToNode = function (node, options) {

		var mapping = options.mapping,
			data = options.data;

		node = _.clone(node); //just to be safe (dev)

		_.keys(mapping).forEach(function(m) {
			
			var attributes = mapping[m]['@'],
				text = data[_.pick(mapping[m],'#')['#']],
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
				//TODO: do something (probably call self recursively)
			}

			if (!_.contains(serializeChildren(node[m]),serializeNode(newNode))){
				node[m].push(newNode);
			}

		})

		return _.clone(node);
	
	}

	//TODO: this step is the only thing that actually gets partially applied in the constructor
	reversedMapping = reverseMapping(mapping);

	//===================================================
	//this is a constructor so returns a function (partial application)
	return function(data) {

		var result = {},
			tempArr = [];
			

		//TODO: this is a hack, it will break if the rootNode is ever more than one level deep
		reversedMapping = reversedMapping[rootNode]; 

		result[rootNode] = {};

		data.forEach(function(row) {
			
			var primaryKeyValue = row[primaryKey];		
			
			result[rootNode][primaryKeyValue] = result[rootNode][primaryKeyValue] || {};

			result[rootNode][primaryKeyValue] = addDataToNode(result[rootNode][primaryKeyValue], {
				mapping:reversedMapping,
				data:row
			});

		});

		_.keys(result[rootNode]).forEach(function(key) {
			tempArr.push(result[rootNode][key]);
		})

		result[rootNode] = tempArr;

		return _.clone(result);
	}
	//===================================================

}


module.exports = function(data, options) {
	return new JsonMapper(options)(data);
}

