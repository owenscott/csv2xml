	//assigns a value to a child node (defined by path) of given node
	var mapValueToNode = function(currentNode, path, value) {
		
		var nextStep;

		if (path.length > 1) {
			nextStep = path[0];
			currentNode[nextStep] = currentNode[nextStep] || {};
			mapValueToNode(currentNode[nextStep], path.slice(1,path.length), value);
		}
		else {
			nextStep = path[0];
			currentNode[nextStep] = value; 
		}
		return currentNode;
	
	}

//map value to node takes a path and a value, and iterates through the depth of an object at each level of the path
//at each level it checks if the next path string exists
//if it does exist, it 


//this woudl all be better as deep extend

//{one:{two:three:'foo'}} extends {one:{bar:'baz'}} to {one{bar:'baz', two:{three:'foo'}}
//config takes overwrite or array when you have a matching value


	addDataToNode = function (node, options) {

		var mapping = options.mapping,
			data = options.data;

		node = _.clone(node); //just to be safe (dev)

		_.keys(mapping).forEach(function(m) {
			
			var attributes = mapping[m]['@'],
				text = data[_.pick(mapping[m],'#')['#']],
				children = _.omit(mapping[m], ['@','#']),
				newNode = {};

			node[m] = node[m] || [];

			newNode['#'] = text;
			newNode['@'] = {};

			_.keys(attributes).forEach(function(a) {

				var attributeText = data[attributes[a]];
				if (attributeText) {
					newNode['@'][a] = attributeText
				}

			})

			if (children) {
				//TODO: do something (probably call self recursively)
			}

			if (!_.contains(serializeChildren(node[m]),serializeNode(newNode))){
				node[m].push(newNode);
			}

		})

		return _.clone(node);
	
	}