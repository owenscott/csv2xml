var _ = require('underscore');

//gets the deepest common root node for a set of mapping paths
module.exports = function(mapping) {

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