var test = require('tape'),
	deepExtend = require('./../src/deepExtend.js');

console.log(deepExtend);
console.log(deepExtend({},{}))

var original = {};

var extend1 = {
	'iati-activity': {
		'title': {
			'#': 'An activity'
		}
	}
}

var extend2 = {
	'iati-activity': {
		'other-identifier': {
			'#': '2'
		}
	}
}

test('Deep extend works with two basic objects and arrayify=false', function(t) {
	
	var extended1,
		extened2;

	t.plan(2);

	extended1 = deepExtend(original, extend1, {arrayify:false});
	extended2 = deepExtend(extend1, extend2, {arrayify:false});

	t.deepEqual(extended1, {"iati-activity":{"title":{"#":"An activity"}}}, 'Result of the first extension is correct');
	t.deepEqual(extended2, {"iati-activity":{"title":{"#":"An activity"},"other-identifier":{"#":"2"}}}, 'Result of second extension is correct')

});

test('Deep extend works with two basic objects and arrayify=true', function(t) {
	
	var extended1,
		extened2;

	t.plan(2);

	extended1 = deepExtend(original, extend1, {arrayify:true});
	extended2 = deepExtend(extend1, extend2, {arrayify:true});

	t.deepEqual(extended1, {"iati-activity":{"title":{"#":"An activity"}}}, 'Result of the first extension is correct');
	t.deepEqual(extended2, {"iati-activity":[{"title":{"#":"An activity"}},{"other-identifier":{"#":"2"}}]}, 'Result of second extension is correct')

});
