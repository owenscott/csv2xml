var _ = require('underscore');
var getRootNode = require('./getRootNode.js');
var deepExtend = require('./deepExtend.js');
var eliminateDuplicates = require('./eliminateDuplicates');
var buildObjectFromKeyArray = require('./buildObjectFromKeyArray');

module.exports = function(data, options) {

	var simplifiedMapping = options.mapping;

	var rootObject = buildObjectFromKeyArray([options.rootElementName],[]);

	var result = options.primaryKey ? {} : [];

	data.forEach(function(d, i) {

		var row = {};

		//use the mapping to create an properly formatted object for each row
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

	rootObject = eliminateDuplicates(rootObject);

	return rootObject;

}


