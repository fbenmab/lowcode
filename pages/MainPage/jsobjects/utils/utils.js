export default {
	transToSelect(resultValues){
		let result = [];
		for (var el in resultValues){
			result.push({
				"label": String(resultValues[el]),
				"value": String(resultValues[el])
			});
		}
		return result;
	},
	transformJsonToTree(inputArray){
		const outputArray = [];
		inputArray.forEach(obj => {
			const pathArr = obj.value.split('.');
			let currentObj = outputArray;
			pathArr.forEach((part, index) => {
				const existingObj = currentObj.find(o => o.value === pathArr.slice(0, index + 1).join('.'));
				if (existingObj) {
					currentObj = existingObj.children;
				} else {
					const newObj = {
						value: pathArr.slice(0, index + 1).join('.'),
						label: (index === pathArr.length - 1) ? obj.label : null,
						...obj,
						children: []
					};
					currentObj.push(newObj);
					currentObj = newObj.children;
				}
			});
		});
		return outputArray;
	}, 
	/*
	parseNestedJson(obj)
	This function is used to identify all config parameters in the config selection tree
	and will tag all editable parameters with ⚡ (:zap:).
	*/
	parseNestedJson(obj){
		function _parseNestedJson(myObj){
			for (let key in myObj) {
				if (typeof myObj[key] === 'object') {
					_parseNestedJson(myObj[key]); // Recursively call function if value is an object
				} else {
					if ((myObj.children.length == 0) && (key === "label")) {
						myObj.label = "⚡ " + myObj.label;
						myObj.isParam = true;
					}
				}
			}
			return myObj;
		}
		return _parseNestedJson(obj);
	},
	/*
	getNestedValue(obj, indexStr)
	This function will retreive the sub object from the main object based on the provided indexStr
	*/
	getNestedValue(obj, indexStr){
		let keys = indexStr.split('.'); // Split index string into an array of keys
		let value = obj;
		for (let i = 0; i < keys.length; i++) {
			value = value[keys[i]];
		}
		return value;
	},
	/*
	stepBackPath(path)
	This function is returning the path of the parent element
	*/
	stepBackPath(path){
		let keys = String(path).split(".").slice(0,-1);
		return keys.join(".");
	},
	/*
	getPathsToKeyValue((obj, key, value)
	This function is returning the complete path to a particular sub object having the given (key, value)
	*/
	getPathsToKeyValue(obj, key, value){
		function _getPathsToKeyValue(obj, key, value, path = ''){
			let paths = [];
			for (let prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					let propValue = obj[prop];
					if (typeof propValue === 'object') {
						let nestedPath = path + prop + '.';
						let nestedPaths = _getPathsToKeyValue(propValue, key, value, nestedPath);
						paths = paths.concat(nestedPaths);
					} else if (prop === key && propValue === value) {
						paths.push(path + prop);
					}
				}
			}
			return paths;
		}
		return _getPathsToKeyValue(obj, key, value);
	},
	/*
	findSubChildren(json, key, value)
	This function is returning the sub children of a given json object based on the given (key,value) contained in the children object
	*/
	findSubChildren(json, key, value){
		function _findSubChildren(json, key, value) {
			for (let i = 0; i < json.length; i++) {
				const obj = json[i];
				if (obj[key] === value) {
					return obj.children;
				}
				else if (obj.children.length > 0) {
					const subChildren = _findSubChildren(obj.children, key, value);
					if (subChildren) {
						return subChildren;
					}
				}
			}
			return null;
		}
		return _findSubChildren(json, key, value);
	},
	/*
	filterJsonByKeys(sourceJson, keysList)

	*/
	filterJsonByKeys(sourceJson, keysList){
		if (Array.isArray(sourceJson)) {
			let resultArray = [];
			for (let i = 0; i < sourceJson.length; i++) {
				let sourceObj = sourceJson[i];
				let resultObj = {};

				for (let j = 0; j < keysList.length; j++) {
					let key = keysList[j];
					if (sourceObj.hasOwnProperty(key)) {
						resultObj[key] = sourceObj[key];
					}
				}
				resultArray.push(resultObj);
			}
			return resultArray;
		} else {
			let resultObj = {};
			for (let i = 0; i < keysList.length; i++) {
				let key = keysList[i];
				if (sourceJson.hasOwnProperty(key)) {
					resultObj[key] = sourceJson[key];
				}
			}
			return resultObj;
		}
	},
	/*
	getParamObjects(obj) 
	*/
	getParamObjects(obj){
		function _getParamObjects(obj) {
			let result = [];
			if (obj instanceof Array) {
				for (let i = 0; i < obj.length; i++) {
					result = result.concat(_getParamObjects(obj[i]));
				}
			} else if (obj instanceof Object) {
				if (obj.hasOwnProperty("isParam") && obj["isParam"] === true) {
					result.push(Object.assign({}, obj));
				}
				for (let key in obj) {
					result = result.concat(_getParamObjects(obj[key]));
				}
			}
			return result;
		}
		return _getParamObjects(obj);
	},
	/*
	renameJsonKey(sourceJson, oldKey, newKey) 
	*/
	renameJsonKey(sourceJson, oldKey, newKey){
		if (Array.isArray(sourceJson)) {
			// Handle an array of JSON objects
			let resultArray = [];

			for (let i = 0; i < sourceJson.length; i++) {
				let sourceObj = sourceJson[i];
				let resultObj = {};

				for (const key in sourceObj) {
					if (sourceObj.hasOwnProperty(key)) {
						if (key === oldKey) {
							resultObj[newKey] = sourceObj[key];
						} else {
							resultObj[key] = sourceObj[key];
						}
					}
				}
				resultArray.push(resultObj);
			}
			return resultArray;
		} else {
			const resultJson = {};
			for (const key in sourceJson) {
				if (sourceJson.hasOwnProperty(key)) {
					if (key === oldKey) {
						resultJson[newKey] = sourceJson[key];
					} else {
						resultJson[key] = sourceJson[key];
					}
				}
			}
			return resultJson;
		}
	},
	/*
	findValue(data, key1, value1, key2)
	*/
	findValue(data, key1, value1, key2){
		function _findValue(data, key1, value1, key2) {
			if (typeof data === 'object') {
				if (data.hasOwnProperty(key1) && data[key1] === value1) {
					return data[key2];
				} else {
					for (let prop in data) {
						let result = _findValue(data[prop], key1, value1, key2);
						if (result !== null) {
							return result;
						}
					}
				}
			}
			return null;
		}
		return _findValue(data, key1, value1, key2);
	},
	showJsonInfoSide(obj, side){
		let info = "";
		for (var e in obj){
			if (side == "L") info += (info ? "\n" : "") + e + " : ";
			if (side == "R") {
				if (e == "name") {info += (info ? "\n" : "") + obj[e].split(" ")[1];}
				else {
					info += (info ? "\n" : "") + obj[e];
				}
			}
		}
		return info;
	},
	getOptions(){
		let obj = {
			"id": "123",
			"typeName": "string"
		}

		return this.getBlankIfKeyUndefined(obj, "typeName");
	},
	getBlankIfKeyUndefined(obj, key){
		if (!obj) {
			return "";
		}
		if (obj.hasOwnProperty(key)) {
			return obj[key];
		} 
		else if (Array.isArray(obj)) {
			if (key in obj) return obj[key];
			return "";
		}
		else {
			return obj;
		}

	},
	getBlankArrIfKeyUndefined(obj, key){
		if (!obj) {
			return [];
		}
		if (obj.hasOwnProperty(key)) {
			return obj[key];
		} 
		else if (Array.isArray(obj)) {
			if (key in obj) return obj[key];
			return [];
		}
		else {
			return obj;
		}

	},
	getUsedDimensions(dimension="{B,C}") {
		const regex = /\{(.*?)\}/;
		const matches = regex.exec(dimension);

		if (matches) {
			return matches[1].split(",");
		} else {
			return dimension.split(",");
		}
	},
	checkValuesInList(val, list){
		if (!Array.isArray(list)) {
			list = [list];
		}
		if (list.indexOf(val) > -1) {
			return true;
		}
		return false;
	},
	storeVal(variable, value){
		let varAr = variable.split(".");
		if (varAr.length==1) {
			storeValue(varAr[0], value);
		}
		else {
			let val = appsmith.store[varAr[0]];
			if (!val) val = {};
			val[varAr[1]] = value;
			storeValue(varAr[0],val);
		}
	},
	removeAttributes(obj, keysToRemove) {
		for (let key of keysToRemove) {
			delete obj[key];
		}
		return obj;
	},
	getCurrentDateTime(millis=false) {
		const date = new Date();
		const options = {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: false,
			timeZoneName: 'short'
		};
		if (millis) options.fractionalSecondDigits = 3;
		const dateTimeString = date.toLocaleString('en-US', options);
		return dateTimeString.replace(/GMT\+\d{4}/, '');
	},
	insertElement(arr, index, ...newItems){
		return [
		...arr.slice(0, index),
		...newItems,
		...arr.slice(index)
			];
		},
	moveElementInJsonArray(jsonArray, oldIndex, newIndex) {
		const copy = JSON.parse(JSON.stringify(jsonArray));
		const [removed] = copy.splice(oldIndex, 1);
		copy.splice(newIndex, 0, removed);
		return copy;
	},
	updateJsonArrayValues(jsonArray, propertyName, newValue) {
		jsonArray.forEach(item => {
			if (item.hasOwnProperty(propertyName)) {
				item[propertyName] = newValue;
			}
		});
		return jsonArray;
	},
	updateProperties(obj, prop, val) {
		function _updateProperties(obj, prop, val) {
			for (var key in obj) {
				if (typeof obj[key] === 'object' && obj[key] !== null) {
					_updateProperties(obj[key], prop, val);
				} else if (key === prop) {
					obj[key] = val;
				}
			}
 		 return obj;
		}
		return _updateProperties(obj, prop, val);
	},
	getDateTime() { //Fri May 05 09:05:50 WAT 2023
		let dt = moment().utc().format('ddd MMM DD hh:mm:ss z YYYY');
		return dt;
	},
	numberToHex(number) {
		const hexString = _.padStart(_.toInteger(number).toString(16).toUpperCase(), 2, '0');
		return hexString;
	},
	test() { 
		
	}
}