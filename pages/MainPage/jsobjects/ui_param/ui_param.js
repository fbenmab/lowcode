export default {
	dataTypes: ["STRING", "INTEGER", "LONG", "DOUBLE","FLOAT", "SHORT", "BOOLEAN", "TEXT", "LIST", "MAP", "ENUM"],
	compName : {
			"STRING": "InputString",
			"INTEGER": "InputInteger",
			"LONG": "InputLong",
			"DOUBLE": "InputDouble",
			"FLOAT": "InputFloat",
			"BOOLEAN": "SelectBoolean",
			"TEXT": "InputText",
			"LIST": "TableList",
			"MAP": "TableMap",
			"ENUM": "SelectEnum"
	},
	async init() {
		let result = [];
		let SelectDim = [];
		SelectDim = [Select1, Select2, Select3, Select4, Select5, Select6];

		let selectDefault = new Array(6).fill("");
		for (let w in SelectDim){
			storeValue(String("SELECT_DEFAULT_" + w), undefined);
			storeValue(String("SELECT_LIST_" + w), undefined);
			SelectDim[w].isVisible = false;
		}
		function _fillOptions(dimension){
			let result = [];
			switch (dimension){
				case "Cluster": result=appsmith.store.LIST.CLUSTER;break;
				case "Apptype": result=appsmith.store.LIST.APPTYPE;break;
				case "Host": result=appsmith.store.LIST.HOST;break;
				case "Station": result=appsmith.store.LIST.STATION;break;
				case "User": result=appsmith.store.LIST.USER;break;
				case "Site": result=appsmith.store.LIST.SITE;break;
				case "Group": result=appsmith.store.LIST.GROUP;break;
				default: result=[];
			}

			return result;
		}
		let availableDim = appsmith.store.USED_DIMENSIONS;
		var fillOptionList = [];
		for (let p in availableDim) {
			let label = availableDim[p].replace("CONFIG_","").replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
			fillOptionList = _fillOptions(label);
			storeValue(String("SELECT_LIST_" + p), fillOptionList);
			selectDefault[p] = fillOptionList[0];
			storeValue("SELECT_DEFAULT", selectDefault);
			SelectDim[p].labelText = label;
			SelectDim[p].isVisible = true;
			SelectDim[p].options = fillOptionList;
		}
		return selectDefault;
	},
	init_dimension_list() {
		let param_dimensions = appsmith.store.EDITED_PARAMETER ? appsmith.store.EDITED_PARAMETER.dimensions : [];
		if (param_dimensions) param_dimensions = String(param_dimensions).replaceAll("},{","}|{").split("|");
		// showAlert(param_dimensions);
		let result = [];
		for (var el in param_dimensions){
			result.push({
				"label": param_dimensions[el],
				"value": param_dimensions[el]
			});
		}
		storeValue("DIMENSION_LIST", result);
		storeValue("DIMENSION_SELECTED", result[0] ? result[0]["value"] : "");
		return result;
	}, 
	// EDIT -------------------------------------------------------------------
	async editParam(){
		// await utils.storeVal("EDITED_PARAMETER", TableParameterList.tableData[TableParameterList.selectedRowIndex]);
		await storeValue("EDITED_PARAMETER", TableParameterList.selectedRow);
	
		// let paramTypeId = utils.getBlankIfKeyUndefined(TableParameterList.tableData[TableParameterList.selectedRowIndex], "typeId");
		// let paramType = utils.getBlankIfKeyUndefined(TableParameterList.tableData[TableParameterList.selectedRowIndex], "typeName");
		let paramTypeId = utils.getBlankIfKeyUndefined(await appsmith.store["EDITED_PARAMETER"], "typeId");
		let paramType =utils.getBlankIfKeyUndefined(await appsmith.store["EDITED_PARAMETER"], "typeName");
		let paramMetaType =utils.getBlankIfKeyUndefined(await appsmith.store["EDITED_PARAMETER"], "metaTypeName");
		let storeParam = String("EDIT." + paramType);
		await utils.storeVal(storeParam, "");
		switch (paramType) {
			case "MAP": 
			case "LIST": ui_param.navControl(true);break;
			default: ui_param.navControl(false);break;
		}
		let editTab = ui_param.getEditParameterTab(paramTypeId);
		if ((editTab == "LIST") && (paramMetaType == "PROPERTIES")) {
			editTab = "t_text";
		}
		storeValue("SELECTED_TYPE_TAB", editTab);
		storeValue("SELECTED_TAB", "t_edit_param");
		
		await ui_param.init();
		await ui_param.init_dimension_list();
		
		let selectedDimension = await appsmith.store["DIMENSION_SELECTED"];
		// showAlert(selectedDimension ? `dimension ${selectedDimension}` : `dimension empty`);
		await this.loadParam(appsmith.store.EDITED_PARAMETER , selectedDimension);
		await utils.storeVal("SELECTED_TAB", "t_edit_param");
	},
	
	// LOAD -------------------------------------------------------------------
	async loadParam(editedParameter={"typeName": "MAP", "id": 1242, "metaTypeData":"OBJECT"}, selectedDimensionLevel="CLUSTER"){
		let storeParam = String("EDIT." + editedParameter.typeName);
		await utils.storeVal(storeParam, "");
		// selectedDimensionLevel = SelectDimensionLevel.selectedOptionValue ?  SelectDimensionLevel.selectedOptionValue : appsmith.store.DIMENSION_LIST[0];
		selectedDimensionLevel = appsmith.store.DIMENSION_SELECTED;
		let usedDimension = await utils.getUsedDimensions(selectedDimensionLevel).join(",");
		// confGetValue ============================================================
		let payload = {};
		payload.parameterFilter = [
			{
            "key":"PARAMETER_ID",
            "value": editedParameter.id
 			}
    ];
		let result = await api_config.confGetValue(usedDimension, payload);
		
		// =========================================================================
		// LOAD
		switch (editedParameter.typeName){ 
			case "STRING":
			case "INTEGER":
			case "FLOAT":
			case "SHORT":
			case "DOUBLE":
			case "LONG":
			case "BOOLEAN":
			case "TEXT":
				storeValue("INPUT_PARAM_VAL_DISABLED", !result.isUsed);
				utils.storeVal(storeParam, await result.resultValues[2]);
				break;
			case "PROPERTIES":
				let propValue = js_property.parseConfigValueProperty(result, usedDimension);
				utils.storeVal(storeParam, propValue);
				break;
			case "ENUM":
				storeValue("INPUT_PARAM_VAL_DISABLED", result.resultValues[2] == "");
				utils.storeVal(storeParam, result.resultValues[2]);
				let properties = result.parameterResultValues[3];
				let options = js_enum.convertConfigEnumToSelectOptions(properties);
				utils.storeVal("EDIT.ENUM_OPTIONS",options);
				utils.storeVal("EDIT.ENUM",result.resultValues[2]);
				showAlert(`ENUM ${result.resultValues[2]}`);
				break;
				
			case "LIST":
				// utils.storeVal("LIST_TABLE", [{}]);
				utils.storeVal(storeParam, await result);
				let resList = js_list.readListData(await appsmith.store.EDIT.LIST, usedDimension);
				// utils.storeVal("LIST_TABLE", TableList.triggeredRow);
				TableList.columnOrder = [];
				utils.storeVal("LIST_TABLE", resList); 
				TableList = utils.updateProperties(TableList, "isVisible", true);
				TableList = utils.updateProperties(TableList, "isCellVisible", true);
				TableList = utils.updateProperties(TableList, "isEditable", true);
				TableList = utils.updateProperties(TableList, "isCellEditable", true);
				TableList = utils.updateProperties(TableList, "isSaveVisible", true);
				TableList = utils.updateProperties(TableList, "isDiscardVisible", true);
				break;
			case "MAP":
				
				utils.storeVal(storeParam, await result.resultValues);
				let resMap = js_map.readMapData(await appsmith.store.EDIT.MAP, usedDimension); 
				utils.storeVal("MAP_TABLE", resMap); 
				TableMap = utils.updateProperties(TableMap, "isVisible", true);
				TableMap = utils.updateProperties(TableMap, "isCellVisible", true);
				TableMap = utils.updateProperties(TableMap, "isEditable", true);
				TableMap = utils.updateProperties(TableMap, "isCellEditable", true);
				TableMap = utils.updateProperties(TableMap, "isSaveVisible", true);
				TableMap = utils.updateProperties(TableMap, "isDiscardVisible", true);
				break;
				
			case "FONT":
				storeValue("INPUT_PARAM_VAL_DISABLED", result.resultValues[2] == "");
				let val = await result.resultValues[2];
				await utils.storeVal(storeParam, val); 
				await storeValue("SELECTED_FONT_CODE", val);
				let selected = js_font.updateFont(val);
				// await storeValue("SELECTED_FONT", selected);
				await storeValue("FONT_IS_BOLD", selected.isBold);
				await storeValue("FONT_IS_ITALIC",  selected.isItalic);
				await storeValue("FONT_SIZE", selected.fontSize);
				
				break;
			case "COLOR":
				storeValue("INPUT_PARAM_VAL_DISABLED", result.resultValues[2] == "");
				let colorVal = await result.resultValues[2];
				storeValue("RGBA", js_color.getRgbaFromConfigValue(colorVal));
				break;
				
			case "RECTANGLE":
				storeValue("INPUT_PARAM_VAL_DISABLED", result.resultValues[2].replace(",","") == "");
				let rectangleVal = await result.resultValues[2];
				storeValue("EDIT.RECTANGLE", rectangleVal);
				break;
			default: break;
		}
		return appsmith.store.SELECTED_FONT;
		// return result;
	}, 
	
	// SAVE -------------------------------------------------------------------
	async saveParam(selectedDimensionLevel="CLUSTER"){
		let usedDimension = utils.getUsedDimensions(selectedDimensionLevel).join(",");
		let editedParam = appsmith.store.EDITED_PARAMETER;
		let value = "";
		let parameterId = editedParam.id;
		let payload = {};
		// SAVE
		switch (editedParam.typeName){ 
			case "STRING":
			case "INTEGER":
			case "FLOAT":
			case "SHORT":
			case "DOUBLE":
			case "LONG":
			case "TEXT":
				value = window[this.compName[editedParam.typeName]]["text"];
				payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_VALUE"];
				payload.uploadValues = [usedDimension, parameterId, value];    
				break;
			case "BOOLEAN":
				value = window[this.compName[editedParam.typeName]]["selectedOptionValue"];
				payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_VALUE"];
				payload.uploadValues = [usedDimension, parameterId, value == "1" ? 1 : 0];  
				break;
			case "ENUM":
				value = window[this.compName[editedParam.typeName]]["selectedOptionValue"];
				payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_VALUE"];
				payload.uploadValues = [usedDimension, parameterId, value];   
				// showAlert(`save value: "${value}"`);
				// showAlert(`save parameterId: "${parameterId}"`);
				// showAlert(`save usedDimension: "${usedDimension}"`);
				break;
			case "LIST":
				let valueJsonList = appsmith.store.LIST_TABLE;
				payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_VALUE"];
				payload.uploadValues = [];    
				value = [];
				for (let e in valueJsonList) {
					payload.uploadValues.push(usedDimension, parameterId, valueJsonList[e].value);
				}
				break;
			case "MAP":
				let valueJsonMap = appsmith.store.MAP_TABLE;
				payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_KEY", "CONFIG_VALUE"];
				payload.uploadValues = [];  
				value = [];
				for (let e in valueJsonMap) {
					// value.push(usedDimension ,valueJsonMap[e].key, valueJsonMap[e].value);
					payload.uploadValues.push(usedDimension, parameterId, valueJsonMap[e].key, valueJsonMap[e].value);
				}
				break;
			case "FONT": 
				let valueFont = appsmith.store.SELECTED_FONT_CODE;
				payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_VALUE"];
				payload.uploadValues = [usedDimension, parameterId, valueFont];  
				break;
			case "PROPERTIES":
				let valueEditProperties = InputProperty.text;
				let currentDateTime = utils.getCurrentDateTime();
				let valueProperties = js_property.buildPropertyValue(valueEditProperties, currentDateTime);
				payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_VALUE"];
				payload.uploadValues = [usedDimension, parameterId, valueProperties];  
				// storeValue("EDIT.PROPERTIES", valueEditProperties);
				break;
			case "COLOR":
				let valueColor = js_color.rgbaToHexConfig(appsmith.store.RGBA);
				payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_VALUE"];
				payload.uploadValues = [usedDimension, parameterId, valueColor];  
				break;
				
			case "RECTANGLE":
				let valueRectangle = [InputRecX.text, InputRecY.text, InputRecW.text, InputRecH.text].join(",");
				if (!InputRecX["isValid"]) storeValue("VALIDATION.X", "Value is out of range");
				if (!InputRecY["isValid"]) storeValue("VALIDATION.Y", "Value is out of range"); 
				if (!InputRecW["isValid"]) storeValue("VALIDATION.W", "Value is out of range"); 
				if (!InputRecH["isValid"]) storeValue("VALIDATION.H", "Value is out of range");
				if (!InputRecX["isValid"] || !InputRecY["isValid"] || !InputRecW["isValid"] || !InputRecH["isValid"]) return 0;
				storeValue("EDIT.RECTANGLE", valueRectangle);
				payload.uploadKeys = ["CONFIG_DIMSET", "PARAMETER_ID", "CONFIG_VALUE"];
				payload.uploadValues = [usedDimension, parameterId, valueRectangle];  
				break;
			default: break;
		}
		// let t = InputText;
		
		// let result = await api_config.confUpdateValue(parameterId, usedDimension, value);
		let result = await api_config.confUpdateValue(usedDimension, payload);
		return value;
	},
	
	
	// DELETE -------------------------------------------------------------------
	async deleteParam(selectedDimensionLevel){
		let usedDimension = utils.getUsedDimensions(selectedDimensionLevel).join(",");
		let editedParameter = appsmith.store.EDITED_PARAMETER;
		let result = await api_config.confDeleteValue(editedParameter.id, usedDimension);
		let storeParam = String("EDIT." + editedParameter.typeName);
		utils.storeVal(storeParam, "");
		InputString.isDisabled = true;
		// DELETE
		switch (editedParameter.typeName){ 
			case "STRING":
			case "INTEGER":
			case "FLOAT":
			case "SHORT":
			case "DOUBLE":
			case "LONG":
			case "BOOLEAN":
			case "TEXT":
			case "ENUM":
				// window[this.compName[editedParameter.typeName]]["isDisabled"] = true;
				storeValue("INPUT_PARAM_VAL_DISABLED", true);
				break;
			case "LIST":
				// window[this.compName[editedParameter.typeName]]["isDisabled"] = true;
				storeValue("INPUT_PARAM_VAL_DISABLED", true);
				break;
			case "FONT": 
				storeValue("INPUT_PARAM_VAL_DISABLED", true);
				storeValue("FONT.CONTAINER.IS_VISIBLE", false);
				break;
			case "RECTANGLE": 
				storeValue("INPUT_PARAM_VAL_DISABLED", true);
				break;
			default: break;
		}
	},
	navControl(status){
		storeValue('ADD_REMOVE_NAV', status);
	},
	getEditParameterTab(parameterType){
		var tab = "t_not_implemented";
		switch (parseInt(parameterType)){
			case 1:/*STRING				*/tab="t_string";break;
			case 2:/*INTEGER			*/tab="t_integer";break;
			case 3:/*LONG					*/tab="t_long";break;
			case 4:/*DOUBLE				*/tab="t_double";break;
			case 5:/*BOOLEAN			*/tab="t_boolean";break;
			case 6:/*TEXT					*/tab="t_text";break;
			case 7:/*FONT					*/tab="t_font";break;
			case 8:/*COLOR				*/tab="t_color";break;
			case 10:/*RECTANGLE		*/tab="t_rectangle";break;
			case 11:/*ENUM				*/tab="t_enum";break;
			case 12:/*PROPERTIES	*/tab="t_properties";break;
			case 14:/*BUFFERIMAGE	*/tab="t_bufferimage";break;
			case 15:/*BYTE				*/tab="t_not_implemented";break;
			case 16:/*SHORT				*/tab="t_short";break;
			case 17:/*CHARACTER		*/tab="t_not_implemented";break;
			case 18:/*FLOAT				*/tab="t_float";break;
			case -1:/*LIST				*/tab="t_list";break;
			case -2:/*MAP 				*/tab="t_map";break;
			case -3:/*OBJECT			*/tab="t_object";break;
			default: tab="t_not_implemented";break;
		}
		return tab;
	},
	changeEditState(state){
		// let selectedParamType = parseInt(utils.getBlankIfKeyUndefined(appsmith.store.EDITED_PARAMETER, "typeId"));
		utils.storeVal("INPUT_PARAM_VAL_DISABLED", !state);
		TableList = utils.updateProperties(TableList, "isEditable", true);
		TableList = utils.updateProperties(TableList, "isCellEditable", true);
	},
	test(){
		clearStore();
	}
}