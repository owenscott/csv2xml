var test = require('tape'),
	Json2xml = require('./../src/json2xml'),
	Stream = require('stream'),
	through = require('through');

var fs = require('fs');

// var inStream = fs.createReadStream('./test/data/example.json');

test('json2xml: Converts a simple JSON object to XML', function(t) {
	
	t.plan(1);

	var testObj = {
		"title":{
			"#":"example object"
		},
		"author":{
			"#":"owen"
		}
	}

	var result = '';

	//stream to test
	var toXML = new Json2xml({
		attKey: '@',
		textKey: '#',
		rootObject:['foo']
	});

	//stream to turn data into json
	var transform = through(
		function write(data) {
			this.queue(JSON.parse(data.toString()));
		}
	);

	//stream for queuing up data
	var jsonStream = new Stream.Transform();

	//gather up all of the stream output into an object
	toXML.on('data', function(d) {
		result = result + d;
	})

	//actual test here
	toXML.on('end', function() {
		t.equal(result, '<foo><title>example object</title><author>owen</author></foo>', 'Simple JSON object is converted to XML');
	})

	jsonStream.pipe(transform).pipe(toXML);

	jsonStream.push(JSON.stringify(testObj));
	jsonStream.push(null);


});


test('json2xml: Sanitizes the "&" character', function(t) {
	
	t.plan(1);

	var testObj = {
		"title":{
			"#": "night & day & fun"
		},
		"author":{
			"#": "someone famous"
		}
	}

	var result = '';

	//stream to test
	var toXML = new Json2xml({
		attKey: '@',
		textKey: '#',
		rootObject:['foo']
	});

	//stream to turn data into json
	var transform = through(
		function write(data) {
			this.queue(JSON.parse(data.toString()));
		}
	);

	//stream for queuing up data
	var jsonStream = new Stream.Transform();

	//gather up all of the stream output into an object
	toXML.on('data', function(d) {
		result = result + d;
	})

	//actual test here
	toXML.on('end', function() {
		t.equal(result, '<foo><title>night &amp; day &amp; fun</title><author>someone famous</author></foo>', 'Simple JSON object with the "&" character is converted to XML')
	})

	jsonStream.pipe(transform).pipe(toXML);

	jsonStream.push(JSON.stringify(testObj));
	jsonStream.push(null);


});