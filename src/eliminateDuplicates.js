var _ = require('lodash');

var objectWithDuplicates = {"1":{"other-identifier":[{"#":"1"},{"#":"1"}],"title":[{"#":"Example Project 1"},{"#":"Example Project 1"}],"sector":[{"#":"Agriculture","@":{"code":"A"}},{"#":"Food Production","@":{"code":"FP"}}]},"2":{"other-identifier":{"#":"2"},"title":{"#":"Example Project 2"},"sector":{"#":"Noise Pollution","@":{"code":"NP"}}}}

var eliminateDuplicates = function(obj) {

	var hashArray,
		tempArray;

	if (_.isArray(obj)) {

		//iterate through array and remove duplicates from each item
		obj.forEach(function(item, i) {
			obj[i] = eliminateDuplicates(item);
		});

		tempArray = _.uniq(obj, function(o) {
			return JSON.stringify(o);
		})
		if (tempArray.length === 1) {
			obj = tempArray[0];
		}
		else {
			obj = tempArray;
		}
	}
	//if it's an object call self on keys recursively to look for nested arrays
	else if (_.isObject(obj)) {
		_.keys(obj).forEach( function(key) {
			obj[key] = eliminateDuplicates(obj[key])
		});
	}
	
	return _.clone(obj);
}

module.exports = eliminateDuplicates;

