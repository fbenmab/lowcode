export default {
	
	async confGetValue(dimension="CLUSTER", payload = {}) {
		// let session = await api_sessions.run();
		let value = "";
		if (!Array.isArray(dimension)) {
				dimension = dimension.split(",");
		}
		if (!payload.hasOwnProperty("configContext")) {
			payload.configContext = [];
		}
		let selectedValues = [];
		for (var e in dimension) {
				selectedValues[e] = appsmith.store.SELECTED[dimension[e]]; 
				payload.configContext.push({
					"key": String("CONFIG_" + dimension[e]),
					"value": String(selectedValues[e])
				});
		}
		if (!payload.hasOwnProperty("configContext")) {
			payload.configContext = [{
            "key":"CONFIG_CLUSTER",
            "value": "mesIPCtest"
      }];
		}
		if (!payload.hasOwnProperty("parameterFilter")) {
			payload.parameterFilter = [{
            "key":"PARAMETER_ID",
            "value": 441
      }];
		}
		if (!payload.hasOwnProperty("resultKeys")) {
			payload.resultKeys = [
        "CONFIG_DIMSET", "CONFIG_KEY", "CONFIG_VALUE", "ERROR_CODE"
    	];
		}
		if (!payload.hasOwnProperty("parameterResultKeys")) {
			payload.parameterResultKeys = [
        "PARAMETER_SCOPE", "PARAMETER_TYPE_ID", "PARAMETER_TYPE_NAME", "PARAMETER_PROPERTIES", "PARAMETER_METATYPE_ID", "PARAMETER_METATYPE_NAME"
    	];
		}
		console.error(payload);
		try {
			let configGetValues = await api_configGetValues.run(payload);
			let error_code = configGetValues.result.return_value;
			if (error_code != 0) {
				showAlert("configGetValues : imsAPI error " + error_code);
				return [];
			}
			let parameterResultValues = configGetValues.result.parameterResultValues;
			let resultValues = configGetValues.result.resultValues;
			if (dimension.join(",") != String(resultValues[0])){
				resultValues[2] = "";
			}
			value = {
				"errorCode": 0,
				"errorText": "",
				"isUsed": dimension.join(",") == resultValues[0],
				"parameterResultKeys": payload.parameterResultKeys,
				"parameterResultValues":parameterResultValues,
				"resultKeys": payload.resultKeys,
				"resultValues": resultValues
			}
		}
		catch (error) {
			value = {
				"errorCode": 1,
				"errorText": error.message,
				"isUsed": false,
				"resultKeys":  payload.resultKeys,
				"resultValues": []
			}
			console.log(error);
			throw(error);
		}
		return value;
	},
	
	async confUpdateValue(dimension="CLUSTER", payload = {}) {
		// let session = await api_sessions.run();
		let value = "";
		if (!Array.isArray(dimension)) {
				dimension = dimension.split(",");
		}
		if (!payload.hasOwnProperty("configContext")) {
			payload.configContext = [];
		}
		let selectedValues = [];
		for (var e in dimension) {
				selectedValues[e] = appsmith.store.SELECTED[dimension[e]]; 
				payload.configContext.push({
					"key": String("CONFIG_" + dimension[e]),
					"value": String(selectedValues[e])
				});
		}
		if (!payload.hasOwnProperty("configContext")) {
			payload.configContext = [{
            "key":"CONFIG_CLUSTER",
            "value": "mesIPCtest"
      }];
		}
		if (!payload.hasOwnProperty("uploadKeys")) {
			payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_KEY", "CONFIG_VALUE"];
		}
		if (!payload.hasOwnProperty("uploadValues")) {
			payload.uploadValues = [
        "CLUSTER", 1267, "one", "111",
        "CLUSTER", 1267, "two", "222"        
    	];
		}
		if (!payload.hasOwnProperty("resultKeys")) {
			payload.resultKeys = [
        "CONFIG_DIMSET", "CONFIG_KEY", "CONFIG_VALUE", "ERROR_CODE"
    	];
		}
		console.error(payload);
		try {
			let configUpdateValues = await api_configUpdateValues.run(payload);
			let error_code = configUpdateValues.result.return_value;
			if (error_code != 0) {
				showAlert("configUpdateValues : imsAPI error " + error_code);
				return [];
			}
			let resultValues = configUpdateValues.result.resultValues;
			value = {
				"errorCode": 0,
				"errorText": "",
				"resultKeys": payload.resultKeys,
				"resultValues": resultValues
			}
		}
		catch (error) {
			value = {
				"errorCode": 1,
				"errorText": error.message,
				"resultKeys": payload.resultKeys,
				"resultValues": []
			}
			throw(error);
		}
		return value;
	},
	
	async confDeleteValue(parameterId=438, dimension="CLUSTER") {
		// let session = await api_sessions.run();
		let value = "";
		let resultKeys = [
        "CONFIG_DIMSET",
        "ERROR_CODE",
        "PARAMETER_ID"
    ];
		try {
			if (!Array.isArray(dimension)) {
				dimension = dimension.split(",");
			}
			let configParameters = {};
			let configContext = [];
			let selectedValues = [];
			let uploadValues = [dimension.join(','), parameterId];
			for (var e in dimension) {
				selectedValues[e] = appsmith.store.SELECTED[dimension[e]]; 
				configContext.push({
					"key": String("CONFIG_" + dimension[e]),
					"value": String(selectedValues[e])
				});
			}
			configParameters.configContext = configContext;
			configParameters.uploadValues = uploadValues;
			let configDeleteValues = await api_configDeleteValues.run(configParameters);
			let error_code = configDeleteValues.result.return_value;
			if (error_code != 0) {
				showAlert("configDeleteValues : imsAPI error " + error_code);
				return [];
			}
			let resultValues = configDeleteValues.result.resultValues;
			value = {
				"errorCode": 0,
				"errorText": "",
				"resultKeys": resultKeys,
				"resultValues": resultValues
			}
		}
		catch (error) {
			value = {
				"errorCode": 1,
				"errorText": error.message,
				"resultKeys": resultKeys,
				"resultValues": []
			}
			console.log(error);
			throw(error);
		}
		return value;
	},
}