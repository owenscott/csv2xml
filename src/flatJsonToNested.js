

var _ = require('underscore');
var getRootNode = require('./getRootNode.js');
var deepExtend = require('./deepExtend.js');

module.exports = function(data, options) {

	var rootNode = getRootNode(options.mapping);

	var simplifiedMapping = {}

	_.map(options.mapping, function(m, k) {
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

	var rootObject = buildObjectFromKeyArray(rootNode,[]);

	var result = options.primaryKey ? {} : [];

	data.forEach(function(d) {

		var row = {};

		//use the mapping to create an properly formatted object for reach row
		_.map(simplifiedMapping, function(m, k) {
			var tempObject;
			if (d[k]) {
				tempObject = buildObjectFromKeyArray(m, d[k]);
				row = deepExtend(row, tempObject);
			}
		})


		//extend the result object by the row object
		if (options.primaryKey && !d[options.primaryKey]) {
			throw 'Custom Error: No primary key for row ' + JSON.stringify(d)  ;
		}
		else if (options.primaryKey) {
			result[d[options.primaryKey]] = result[d[options.primaryKey]] || {};
			result[d[options.primaryKey]] = deepExtend(result[d[options.primaryKey]], row, {arrayify: true, allowDuplicates: false})
			// console.log(result[d[options.primaryKey]])			
		}
		else {
			result.push(row);
		}
	})

	var tempResult = [];

	if (_.isObject(result) && !_.isArray(result)) {
		result = _.map(result, function(r) {return r;});
	}


	var assignResultToRootObject = function(rootObject, result) {
		var key = _.keys(rootObject)[0]
		if (key) {
			rootObject[key] = assignResultToRootObject(rootObject[key], result);
		}
		else {
			rootObject = result;
		}
		return rootObject;
	}

	rootObject = assignResultToRootObject(rootObject, result);

	return rootObject;

}


