var test = require('tape'),
	deepExtend = require('./../src/deepExtend.js');


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

var extend3 = 	{'foo':'bar'}

var extend4 = 	{'foo':'nachos'}



test('deepExtend: Deep extend works with two basic objects and arrayify=false', function(t) {
	
	var extended1,
		extened2;

	t.plan(2);

	extended1 = deepExtend(original, extend1, {arrayify:false});
	extended2 = deepExtend(extend1, extend2, {arrayify:false});

	t.deepEqual(extended1, {"iati-activity":{"title":{"#":"An activity"}}}, 'Result of the first extension is correct');
	t.deepEqual(extended2, {"iati-activity":{"title":{"#":"An activity"},"other-identifier":{"#":"2"}}}, 'Result of second extension is correct')

});

test('deepExtend: Deep extend works with two basic objects and arrayify=true', function(t) {
	
	var extended1,
		extened2;

	t.plan(2);

	extended1 = deepExtend(original, extend1, {arrayify:true});
	extended2 = deepExtend(extend1, extend2, {arrayify:true});

	t.deepEqual(extended1, {"iati-activity":{"title":{"#":"An activity"}}}, 'Result of the first extension is correct');
	t.deepEqual(extended2, {"iati-activity":[{"title":{"#":"An activity"}},{"other-identifier":{"#":"2"}}]}, 'Result of second extension is correct')

});


test('Deep extend works with two duplicate objects and arrayify=true', function(t) {
	
	var extended1,
		extended2,
		extended3;

	t.plan(2);

	extended1 = deepExtend(original, extend3, {arrayify:true});
	extended2 = deepExtend(extended1, extend4, {arrayify:true})
	extended3 = deepExtend(extended2, extend3, {arrayify:true});


	t.deepEqual(extended1, {'foo':'bar'}, 'Result of the first extension is correct');
	t.deepEqual(extended2, {'foo':['bar','nachos']}, 'Result of the second extension is an array')
	
	//took this out b/c extrictated eliminateDuplicates from deepExtend to improve performance
	// t.deepEqual(extended3, {'foo':['bar','nachos']}, 'Extending again by an array member results in no change');

});
