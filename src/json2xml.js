//TODO: handle JSON when nodes are arrays


var through = require('through'),
	_ = require('lodash');



module.exports = function (options) {

	return through (function write (data) {
		
		var queue = this.queue,
			rootObject = options.rootObject;

		console.log(data);

		var toXML = function(jsonData, nodeName, type) {
			
			var attributes = jsonData[options.attKey],
				text = jsonData[options.textKey],
				children = _.chain(jsonData).keys().without(options.attKey, options.textKey).value(),
				shortClose = true,
				rootNodeName;

			if (type === 'opening' || type === 'child') {	
				
				queue ('<' + nodeName);

				if (attributes) {
					_.keys(attributes).forEach(function(a) {
						if ( typeof attributes[a] !== 'string' ) {
							throw new Error ('Attributes must be a string.');
						}
						queue[' ' + a + '="' + attributes[a] + '"']
					})
				}
				
				if (text || children.length) {

					queue('>');
					shortClose = false;

					if (text) {
						if ( typeof text !== 'string' ) {
							throw new Error ('Text must be a string.');
						}
						queue(text);
					}

					children.forEach (function(key) {
						if (_.isArray(jsonData[key])) {
							jsonData[key].forEach(function (d) {
								toXML(d, key, type);
							})
						}
						else {
							toXML(jsonData[key], key, type);
						}
					})

				}

			}

			if (type === 'child' && shortClose === true ) {
				queue('/>')
			}
			else if (type === 'child' || type === 'closing' ) {
				queue('</' + nodeName + '>')
			}

		}

		if (!this.started && rootObject) {
			if (_.chain(rootObject).keys().omit(options.attKey).value().length > 1) {
				throw new Error('Cannot have a root object wiht more than one non-attribute key at first level');
			}
			rootNodeName = _.chain(rootObject).keys().omit(options.attKey).first().value()
			console.log(rootNodeName);
			if (_.isObject(rootObject[rootNodeName])) {
				toXML(rootObject[rootNodeName], rootNodeName, 'opening');
			}
			else {
				queue('<' + rootNodeName + '>');
			}
			this.started = true;
		}

		if (data[options.attKey]) {
			throw new Error ('The top-level object of the data piped into the parser should never have an attribute key');
		}

		_.keys(data).forEach(function(key) {
			toXML(data[key], key, 'child')
		});
	
	});

	// },

	// function end () {

	// 	// var rootNodeName;

	// 	// if (options.rootObject) {
	// 	// 	rootNodeName = _.chain(rootObject).keys().omit(options.attKey).first().value()
	// 	// 	toXML(options.rootObject[rootNodeName], rootNodeName, 'closing');
	// 	// }

	// 	this.queue(null);

	// })
	
}

