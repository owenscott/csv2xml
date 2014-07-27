var test = require('tape'),
	eliminateDuplicates = require('./../src/eliminateDuplicates.js');

var objectWithDuplicates = {"1":{"other-identifier":[{"#":"1"},{"#":"1"}],"title":[{"#":"Example Project 1"},{"#":"Example Project 1"}],"sector":[{"#":"Agriculture","@":{"code":"A"}},{"#":"Food Production","@":{"code":"FP"}}]},"2":{"other-identifier":{"#":"2"},"title":{"#":"Example Project 2"},"sector":{"#":"Noise Pollution","@":{"code":"NP"}}}}

var expectedResult = {"1":{"other-identifier":{"#":"1"},"title":{"#":"Example Project 1"},"sector":[{"#":"Agriculture","@":{"code":"A"}},{"#":"Food Production","@":{"code":"FP"}}]},"2":{"other-identifier":{"#":"2"},"title":{"#":"Example Project 2"},"sector":{"#":"Noise Pollution","@":{"code":"NP"}}}};

test('eliminateDuplicates: Eliminate duplicates works for a simple object', function(t) {
	t.plan(1);
	t.deepEqual(eliminateDuplicates(objectWithDuplicates), expectedResult, 'Result is an object without duplicates or single item arrays');
});