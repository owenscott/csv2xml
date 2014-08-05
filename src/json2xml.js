//TODO: handle JSON when nodes are arrays


var through = require('through'),
	_ = require('lodash');



var toXML = function(jsonData, nodeName, type, options) {

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

			if (_.chain(rootObject).keys().omit(options.attKey).value().length > 1) {
				throw new Error('Cannot have a root object wiht more than one non-attribute key at first level');
			}
			rootNodeName = _.chain(rootObject).keys().omit(options.attKey).first().value()
			if (_.isObject(rootObject[rootNodeName])) {
				toXML.apply(context, [rootObject[rootNodeName], rootNodeName, 'opening', options]);
			}
			else {
				this.queue('<' + rootNodeName + '>');
			}
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

		var rootNodeName;

		if (options.rootObject) {
			rootNodeName = _.chain(options.rootObject).keys().omit(options.attKey).first().value()
			toXML.apply(this, [options.rootObject[rootNodeName], rootNodeName, 'closing', options]);
		}

		this.queue(null);

	})
	
}

