export default {
	convertConfigEnumToSelectOptions(prop){
		let props = prop.split("\n");
		props.push(null);
		let dataType = props[0];
		let filtered = props.filter((el) => el !== "" && el !== null);
		filtered.shift();

		let obj = [];
		for (var op in filtered){
			obj.push({
				"label": filtered[op].split("=")[1],
				"value": dataType + " " + filtered[op].split("=")[1]
			});
		}
		let result = {};
		result.dataType = dataType;
		result.data = obj;
		return result;
	}
}