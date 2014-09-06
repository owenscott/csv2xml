//TODO: handle JSON when nodes are arrays


var through = require('through'),
	_ = require('lodash');



var toXML = function(jsonData, nodeName, type, options) {

	// console.log(jsonData);

	var context = this;

	var attributes = jsonData[options.attKey],
		text = jsonData[options.textKey],
		shortClose = true,
		children,
		rootNodeName;

	if (_.isArray(jsonData)) {
		shortClose = false;
		jsonData.forEach(function(d) {
			toXML.apply(context, [d, nodeName, type, options]);
		})
	}

	else {

		children = _.chain(jsonData).keys().without(options.attKey, options.textKey).value();


		if (type === 'opening' || type === 'child') {	
			
			context.queue ('<' + nodeName);

			if (attributes) {

				_.keys(attributes).forEach(function(a) {
					if ( typeof attributes[a] !== 'string' ) {
						throw new Error ('Attributes must be a string.');
					}
					context.queue(' ' + a + '="' + attributes[a] + '"');
				})
			}
			
			if (text || children.length || type === 'opening') {

				context.queue('>');
				shortClose = false;

				if (text) {
					if ( typeof text !== 'string' ) {
						throw new Error ('Text must be a string.');
					}
					text = text.replace(/&/g, '&amp;')
					context.queue(text);
				}

				children.forEach (function(key) {
					toXML.apply(context, [jsonData[key], key, type, options]);
				})

			}

		}

		if (type === 'child' && shortClose === true ) {
			context.queue('/>')
		}
		else if (type === 'child' || type === 'closing' ) {
			context.queue('</' + nodeName + '>')
		}

	}
}

module.exports = function (options) {

	return through (function write (data) {
		
		var rootObject = options.rootObject,
			context = this;
		
		if (!this.started && rootObject) {

			rootObject.forEach(function(node) {
				context.queue('<' + node + '>')
			});

			this.started = true;
		}

		if (data[options.attKey]) {
			throw new Error ('The top-level object of the data piped into the parser should never have an attribute key');
		}

		_.keys(data).forEach(function(key) {
			toXML.apply(context, [data[key], key, 'child', options])
		});
	
	},

	function end () {

		var context = this;

		_.chain(options.rootObject).reverse().each(function(node) {
			context.queue('</' + node + '>')
		});		

		this.queue(null);

	})
	
}

