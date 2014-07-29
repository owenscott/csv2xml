var _ = require('lodash');

module.exports = buildObjectFromKeyArray = function (keyArray, value) {
	var obj = {};
	if (keyArray.length > 1) {
		obj[keyArray[0]] = buildObjectFromKeyArray(keyArray.slice(1,keyArray.length), value);
	}
	else {
		obj[keyArray[0]] = value;
	}
	return _.clone(obj);
}