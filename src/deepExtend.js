//TODO: the conditionals are a duplicative mess. this is primed for refactoring. but it works :)

var _ = require('underscore'),
	eliminateDuplicates = require('./eliminateDuplicates.js');

var nodeType = function(node, key) {
	
	if (_.isArray(node)) {
		return 'array'
	}
	else if (!node[key]) {
		return 'not defined'
	}
	else if(_.isObject(node[key])) {
		return 'object'
	}
	else {
		return 'literal'
	}
}

var deepExtend = function(original, extension, options) {

	var result = _.clone(original);

	var defaults = {
		arrayify: false,
		allowDuplicates: false
	}

	var keys = _.keys(extension);

	options = _.extend(defaults, options);

	//short-circuit the rest of the function if the original is an array that we want to push to
	if (nodeType(original) === 'array' && options.arrayify === true) {
		result.push(extension);
		if (options.allowDuplicates === false) {
			result = eliminateDuplicates(result);
		}
		return(_.clone(result));
	}	

	_.keys(extension).forEach(function(key) {

		var originalNodeType =  nodeType(result, key),
			extensionNodeType = nodeType(extension, key),
			temp;

		//target is empty or it's an array that we're going to overwrite
		if (originalNodeType === 'not defined' || (originalNodeType === 'array' && options.arrayify === false) ) {
			if (extensionNodeType === 'object') {
				result[key] = {};
				result[key] = deepExtend(result[key], extension[key], {arrayify:options.arrayify, allowDuplicates:true})
			}
			else {
				result[key] = extension[key];
			}
		}

		//target is an object or literal which will be extended or overwritten
		else if ((originalNodeType === 'object' || originalNodeType === 'literal') && options.arrayify === false) {
			if (extensionNodeType === 'object') {
				result[key] = deepExtend(result[key], extension[key], {arrayify:options.arrayify, allowDuplicates:true});
			}
			else {
				result[key] = extension[key];
			}
		}

		//target is an object or literal which will be converted to an array and pushed to
		else if ((originalNodeType === 'object' || originalNodeType === 'literal') && options.arrayify === true) {

			result[key] = _.clone(result[key]); //indiscriminate but fixed a bug

			if (!_.isArray(result[key])) {
				temp = _.clone(result[key]);
				result[key] = [];
				result[key].push(temp);
			}

			if (extensionNodeType === 'object') {
				result[key].push(extension[key])
			}
			else if (extensionNodeType === 'array') {
				result[key] = result[key].concat(extension[key]);
			}
			else if (extensionNodeType === 'literal') {
				result[key].push(extension[key]);
			}

		}

		//this should never happen...
		else {
			throw 'custom error: unhandled function input'
		}

	})


	
	// console.log('not allowed...');
	// if (options.allowDuplicates === false) {
	// 	console.log('ALLOWED');
	// 	result = eliminateDuplicates(result);
	// }

	return result;

}


module.exports = deepExtend;