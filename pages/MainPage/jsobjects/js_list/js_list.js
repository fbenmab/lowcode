export default {
	getCurrentDateTime() {
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
		const dateTimeString = date.toLocaleString('en-US', options);
		return dateTimeString.replace(/GMT\+\d{4}/, '');
	},
	convertArrayToJson(array) {
		const json = array.map((item) => {
			const obj = {};
			item.forEach((element) => {
				const [key, value] = element.split("=");
				obj[key] = value;
			});
			return obj;
		});
		return json;
	},
	convertJsonToArray(json) {
		const array = json.map((item) => {
			const arr = [];
			for (const key in item) {
				arr.push(`${key}=${item[key]}`);
			}
			return arr;
		});
		return array;
	},
	// Parsers ========================================================================
	// OBJECT
	parseConfigValueObject(result, dimensionLevel){
		let paramType = result.parameterResultValues[2];
		let paramMetaType = result.parameterResultValues[5];
		let resultValues = result.resultValues;
		let filtered = [];
		for (let i=0;i<resultValues.length / 3; i++){
			if (resultValues[i*3] == dimensionLevel) {
				let ar = resultValues[i*3+2].split(/[\n\r]+/);
				let res = ar.filter((el) => el !== "" && el !== null);
				res.shift();res.shift();
				filtered.push(res);
			}
		}
		return this.convertArrayToJson(filtered);
	},

	// STRING
	parseConfigValueString(result, dimensionLevel){
		let paramType = result.parameterResultValues[2];
		let paramMetaType = result.parameterResultValues[5];
		let resultValues = result.resultValues;
		let filtered = [];
		for (let i=0;i<resultValues.length / 3; i++){
			if (resultValues[i*3] == dimensionLevel) {
				let ar = resultValues[i*3+2];
				filtered.push({
					"value": ar
				});
			}
		}
		return filtered;
	},
	// Generators ========================================================================
	// OBJECT
	generateConfigDataObject(obj){
		let res = this.convertJsonToArray(obj);
		let pref = `#ParameterProperties\r\n#${this.getCurrentDateTime()}\r\n`;
		let generated = [];
		for (var e in res){
			generated.push(pref + res[e].join("\r\n"));
		}
		return generated;
	},
	
	// Main functions
	readListData(result, dimensionLevel){
		let paramType = result.parameterResultValues[2];
		let paramMetaType = result.parameterResultValues[5];
		let data = [];
		switch (paramMetaType){
			case "OBJECT": data = this.parseConfigValueObject(result, dimensionLevel);break;
			case "PROPERTIES": data = this.parseConfigValueObject(result, dimensionLevel);break;
			case "STRING": data = this.parseConfigValueString(result, dimensionLevel);break;
		}
		return data;
	},
	clear(){
		clearStore();
	}
}