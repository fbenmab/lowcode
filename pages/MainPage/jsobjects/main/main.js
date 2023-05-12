export default {
	clearSt() {
		clearStore();
	},
	async init(){
		let usedDimensions = [];
		this.clearParamInfoText();
		utils.storeVal("TREE.PARAMS", []);
		utils.storeVal("TABLE.LIST_PARAMS", []);
		utils.storeVal('SELECTED_TAB', "t_main");
		utils.storeVal("EDIT.ENUM", "");
		utils.storeVal("SELECTED.APPTYPE", "");
		storeValue("EDIT.RECTANGLE","0,0,0,0");
		storeValue("EDIT.PROPERTIES","");
		storeValue("EDIT.PROPERTIES.UPDATED","");
		storeValue("EDIT.ENUM_OPTIONS.data", []);
		storeValue("FONT.CONTAINER.IS_VISIBLE", false);
		storeValue("FONT_SIZE", "");
		storeValue("DIMENSION_SELECTED", "");
		storeValue("LIST.APPTYPE", []);
		storeValue("DEBUG", false);
		storeValue("TABLE.PARAM_INFO", false);
		TabsMain["shouldShowTabs"] = false;
		TabsVal["shouldShowTabs"] = false;
		// ContainerParameterInfo["maxDynamicHeight"] = 0;
		// ContainerParameterInfo["minDynamicHeight"] = 0;

		await this.getSession()
			.then((session) => {
				utils.storeVal('AUTH.SESSION', session);
				showAlert(`Session ID: ${session.sessionId}`);
			})
			.catch(() => {
				showAlert(`Erro: Cannot get session !`);
				return 0;
			});

		//--------------------------------------------------
		const clusterList = await this.getClusters();
		utils.storeVal("LIST.CLUSTER", clusterList);
		utils.storeVal("SELECTED.CLUSTER", clusterList[0] ? clusterList[0].label : undefined);
		if (clusterList[0]) usedDimensions.push("CONFIG_CLUSTER");
		// --------------------------------------------------
		const apptypeList = await this.getAppTypes();
		utils.storeVal("LIST.APPTYPE", apptypeList);
		utils.storeVal("SELECTED.APPTYPE", apptypeList[0] ? apptypeList[0].label : undefined);
		if (apptypeList[0]) usedDimensions.push("CONFIG_APPTYPE");
		// -------------------------------------------------- 
		const hostList = await this.getHosts();
		utils.storeVal("LIST.HOST", hostList);
		utils.storeVal("SELECTED.HOST", hostList[0] ? hostList[0].label : undefined);
		if (hostList[0]) usedDimensions.push("CONFIG_HOST");
		// -------------------------------------------------- 
		const stationList = await this.getStations();
		utils.storeVal("LIST.STATION", stationList);
		utils.storeVal("SELECTED.STATION", stationList[0] ? stationList[0].label : undefined);
		if (stationList[0]) usedDimensions.push("CONFIG_STATION");
		// -------------------------------------------------- 
		const userList = await this.getUsers();
		utils.storeVal("LIST.USER", userList);
		utils.storeVal("SELECTED.USER", userList[0] ? userList[0].label : undefined);
		if (userList[0]) usedDimensions.push("CONFIG_USER");
		// -------------------------------------------------- 
		const siteList = await this.getSites();
		utils.storeVal("LIST.SITE", siteList);
		utils.storeVal("SELECTED.SITE", siteList[0] ? siteList[0].label : undefined);
		if (siteList[0]) usedDimensions.push("CONFIG_SITE"); 
		// -------------------------------------------------- 
		const groupList = await this.getGroups();
		utils.storeVal("LIST.GROUP", groupList);
		utils.storeVal("SELECTED.GROUP", groupList[0] ? groupList[0].label : undefined);
		if (groupList[0]) usedDimensions.push("CONFIG_SITE");
		// --------------------------------------------------
		utils.storeVal("USED_DIMENSIONS", usedDimensions);
		let res = utils.removeAttributes(appsmith.store, ["AUTH", "PARAM_TABLE"]);
		return res;


	},
	async getSession() {
		try{
			let sessions = await api_sessions.run();
			return sessions;
		}
		catch (error) {

		}
	},
	async getAppTypes() {
		let dimensionFilter = {"dimension": "CONFIG_APPTYPE"};
		let configGetDimensionValues = await api_configGetDimensionValues.run(dimensionFilter);
		let error_code = configGetDimensionValues.result.return_value;
		if (error_code != 0) {
			showAlert("api_configGetDimensionValues(CONFIG_APPTYPE): imsAPI error " + error_code);
			return [];
		}
		let resultValues = configGetDimensionValues.result.resultValues;
		let extra = {
			"label": "ApplicationServer",
			"value": "ApplicationServer"
		};
		let result = utils.transToSelect(resultValues);
		result = [extra, ...result];
		return result;
	},
	async getClusters() {
		let dimensionFilter = {"dimension": "CONFIG_CLUSTER"};
		let configGetDimensionValues = await api_configGetDimensionValues.run(dimensionFilter);

		let error_code = configGetDimensionValues.result.return_value;
		if (error_code != 0) {
			showAlert("api_configGetDimensionValues(CONFIG_CLUSTER): imsAPI error " + error_code);
			return [];
		}
		let resultValues = configGetDimensionValues.result.resultValues;
		let result = utils.transToSelect(resultValues);
		return result;
	},

	async getHosts() {
		let dimensionFilter = {"dimension": "CONFIG_HOST"};
		let configGetDimensionValues = await api_configGetDimensionValues.run(dimensionFilter);
		let error_code = configGetDimensionValues.result.return_value;
		if (error_code != 0) {
			showAlert("api_configGetDimensionValues(CONFIG_HOST): imsAPI error " + error_code);
			return [];
		}
		let resultValues = configGetDimensionValues.result.resultValues;
		let result = utils.transToSelect(resultValues);
		return result;
	},

	async getStations() {
		let dimensionFilter = {"dimension": "CONFIG_STATION"};
		let configGetDimensionValues = await api_configGetDimensionValues.run(dimensionFilter);
		let error_code = configGetDimensionValues.result.return_value;
		if (error_code != 0) {
			showAlert("api_configGetDimensionValues(CONFIG_STATION): imsAPI error " + error_code);
			return [];
		}
		let resultValues = configGetDimensionValues.result.resultValues;
		let result = utils.transToSelect(resultValues);
		return result;
	},
	async getUsers() {
		let dimensionFilter = {"dimension": "CONFIG_USER"};
		let configGetDimensionValues = await api_configGetDimensionValues.run(dimensionFilter);
		let error_code = configGetDimensionValues.result.return_value;
		if (error_code != 0) {
			showAlert("http_configGetDimensionValues(CONFIG_USER): imsAPI error " + error_code);
			return [];
		}
		let resultValues = configGetDimensionValues.result.resultValues;
		let result = utils.transToSelect(resultValues);
		return result;
	},
	async getSites() {
		let dimensionFilter = {"dimension": "CONFIG_SITE"};
		let configGetDimensionValues = await api_configGetDimensionValues.run(dimensionFilter);
		let error_code = configGetDimensionValues.result.return_value;
		if (error_code != 0) {
			showAlert("api_configGetDimensionValues(CONFIG_SITE): imsAPI error " + error_code);
			return [];
		}
		let resultValues = configGetDimensionValues.result.resultValues;
		let result = utils.transToSelect(resultValues);
		return result;
	},
	async getGroups() {
		let dimensionFilter = {"dimension": "CONFIG_GROUP"};
		let configGetDimensionValues = await api_configGetDimensionValues.run(dimensionFilter);
		let error_code = configGetDimensionValues.result.return_value;
		if (error_code != 0) {
			showAlert("api_configGetDimensionValues(CONFIG_GROUP): imsAPI error " + error_code);
			return [];
		}
		let resultValues = configGetDimensionValues.result.resultValues;
		let result = utils.transToSelect(resultValues);
		return result;
	},
	async getParamTree() {
		let parameterResultValues = [];
		let resultValues = []; 
		let scope = {"scope": appsmith.store.SELECTED.APPTYPE};
		let configGetParameters = await api_configGetParameters.run(scope);
		let error_code = configGetParameters.result.return_value;
		if (error_code != 0) {
			showAlert("api_configGetParameters: imsAPI error " + error_code);
			return parameterResultValues;
		}
		parameterResultValues = configGetParameters.result.parameterResultValues;
		for (var i=0;i<parameterResultValues.length/11;i++){
			resultValues.push({
				"PARAMETER_COMMENT": String(parameterResultValues[i*11+0]),
				"PARAMETER_DESCRIPTION": String(parameterResultValues[i*11+1]),
				"PARAMETER_DIMPATH": String(parameterResultValues[i*11+2]),
				"PARAMETER_ID": parseInt(parameterResultValues[i*11+3]),
				"PARAMETER_NAME": String(parameterResultValues[i*11+4]),
				"PARAMETER_PARENT_ID": String(parameterResultValues[i*11+5]),
				"PARAMETER_SCOPE": String(parameterResultValues[i*11+6]),
				"PARAMETER_TYPE_ID": String(parameterResultValues[i*11+7]),
				"PARAMETER_TYPE_NAME": String(parameterResultValues[i*11+8]),
				"PARAMETER_METATYPE_ID": String(parameterResultValues[i*11+9]),
				"PARAMETER_METATYPE_NAME": String(parameterResultValues[i*11+10]),
				"label": String(parameterResultValues[i*11+4]).split(".").pop(),
				"value": String(parameterResultValues[i*11+4]),
				"isParam": false
			});
		}
		let paramTree = utils.parseNestedJson(utils.transformJsonToTree(resultValues));
		utils.storeVal("TREE.PARAMS", paramTree);
		return paramTree;
	},
	async loadConfigTable(paramName="MesSuite") {
		if (paramName == undefined) paramName = appsmith.store.APPTYPE_LOADED;
		if (!paramName) return [];
		let paramTree = appsmith.store.TREE.PARAMS;
		let id = utils.findValue(paramTree, "PARAMETER_NAME", paramName, "PARAMETER_ID");
		let resultObj = utils.getNestedValue(paramTree, utils.stepBackPath(utils.getPathsToKeyValue(paramTree, "PARAMETER_ID", id)));

		if (!utils.getBlankIfKeyUndefined(resultObj, "isParam")) {
			resultObj = utils.findSubChildren([resultObj], "PARAMETER_ID", id);
		}
		resultObj = utils.filterJsonByKeys(utils.getParamObjects(resultObj), 
																					["label", "PARAMETER_ID", "PARAMETER_DIMPATH", "PARAMETER_DESCRIPTION","PARAMETER_TYPE_ID", "PARAMETER_TYPE_NAME","PARAMETER_METATYPE_NAME"]);
		resultObj = utils.renameJsonKey(resultObj, "label", "name");
		resultObj = utils.renameJsonKey(resultObj, "PARAMETER_ID", "id");
		resultObj = utils.renameJsonKey(resultObj, "PARAMETER_DIMPATH", "dimensions");
		resultObj = utils.renameJsonKey(resultObj, "PARAMETER_DESCRIPTION", "description"); 
		resultObj = utils.renameJsonKey(resultObj, "PARAMETER_TYPE_ID", "typeId"); 
		resultObj = utils.renameJsonKey(resultObj, "PARAMETER_TYPE_NAME", "typeName");
		resultObj = utils.renameJsonKey(resultObj, "PARAMETER_METATYPE_NAME", "metaTypeName");
		utils.storeVal("TABLE.LIST_PARAMS", resultObj);
		this.clearParamInfoText();
		return resultObj;
	},
	async loadAppType() {
		await this.clearParamInfoText();
		await api_sessions.run();
		utils.storeVal("APPTYPE_LOADED", appsmith.store.SELECTED.APPTYPE);
		utils.storeVal("SELECTED_VALUE","");
		utils.storeVal("TABLE.PARAMS", []);
		await main.getParamTree();
	},
	clearParamInfoText(){
		utils.storeVal("TABLE.SELECTED_PARAM", undefined);
	}
}