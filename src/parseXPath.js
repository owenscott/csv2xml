var _ = require('lodash');

module.exports = function(xqueryString, options) {
	
	var result,
		defaults = {
			attKey: '@',
			textKey: '#'
		},
		lastValue;

	options = options || {};

	options = _.extend(defaults, options);

	result = xqueryString.split('/');

	lastValue = result[result.length - 1];

	if (lastValue === 'text()') {
		result[result.length - 1] = options.textKey; 
	}
	else if (lastValue.substr(0,1) === '@') {
		result[result.length - 1] = options.attKey;
		result.push(lastValue.substr(1,lastValue.length));
	}

	return result;
}