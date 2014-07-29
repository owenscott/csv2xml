var _ = require('lodash');

module.exports = function(mapping, rootNodes) {
	
	_.keys(mapping).forEach(function(key) {

		//error checking (TODO: this could be removed given unit tests)
		rootNodes.forEach(function(node,i){
			m = mapping[key];
			if (m[i] !== node) {
				throw new Error('One of the mappings is not congruent with the calculated root node.');
			} 
		})

		//actual work
		mapping[key] = mapping[key].slice(rootNodes.length , mapping[key].length );

	});

	return mapping;

}