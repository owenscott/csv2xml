var _ = require('underscore');

//gets the deepest common root node for a set of mapping paths
module.exports = function(mapping, result) {

	var mappingAsArray = _.map(mapping, function(m) {return m});

	result = result || [];

	var getUniqueValues = function(mapping, depth) {
		return _.chain(mappingAsArray).map(function(m) {return m[depth]}).uniq().value();
	}

	var iterate = function(depth) {	

		if (getUniqueValues(mapping, depth).length > 1) {
			return getUniqueValues(mapping, depth - 1);
		}
		else {
			result.push(getUniqueValues(mapping, depth)[0])
			return iterate(depth + 1);
		}
	}

	iterate(0);

	//use <xml> as the default case if for some reason there is no common root node
	if (!result.length) {
		result = ['xml'];
	}

	return result;

}