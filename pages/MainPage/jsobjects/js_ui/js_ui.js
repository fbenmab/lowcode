export default {
	selectApptypeChange(){
		if (SelectAppType.selectedOptionValue) ButtonLoad.isDisabled = false;
		utils.storeVal("SELECTED.APPTYPE", SelectAppType.selectedOptionValue);
	},
	addNewElement(){
		// ====================================================
		let res = [];
		let editedParam = appsmith.store.EDITED_PARAMETER;
		let Control = TableList;
		let list = []; 
		let newElement = {};
		if (editedParam.typeName =="LIST") {
			Control = window["TableList"];
			list = appsmith.store.LIST_TABLE;
			newElement = {"value": ""};
		}
		if (editedParam.typeName == "MAP") {
			Control = window["TableMap"];
			list = appsmith.store.MAP_TABLE;
			newElement = {"key": "", "value": ""};
		}
		// ====================================================

		let pos = Control.selectedRowIndex; 
		list = Control.tableData;
	
		list = utils.insertElement(list, pos+1, newElement);
		storeValue(`${editedParam.typeName }_TABLE`, list);
		return list;
	},
	saveNewElement(){
		// ====================================================
		let editedParam = appsmith.store.EDITED_PARAMETER;
		let Control = TableList;
		let list = []; 
		if (editedParam.typeName =="LIST") {
			Control = window["TableList"];
			list = appsmith.store.LIST_TABLE;
		}
		if (editedParam.typeName == "MAP") {
			Control = window["TableMap"];
			list = appsmith.store.MAP_TABLE;
		}
		// ====================================================
		let updatePos = Control.updatedRows[0].index;
		storeValue("SELECTED_ROW", updatePos);
		let row = Control.updatedRow;
		list[updatePos] = row;
		storeValue(`${editedParam.typeName }_TABLE`, list);
		return appsmith.store.LIST_TABLE;
	},
	deleteSelectedRow(){
		// ====================================================
		let editedParam = appsmith.store.EDITED_PARAMETER;
		let Control = TableList;
		let list = []; 
		if (editedParam.typeName =="LIST") {
			Control = window["TableList"];
			list = appsmith.store.LIST_TABLE;
		}
		if (editedParam.typeName == "MAP") {
			Control = window["TableMap"];
			list = appsmith.store.MAP_TABLE;
		}
		// ====================================================
		let pos = Control.selectedRowIndex;
		list.splice(pos, 1);
		storeValue("LIST_TABLE", list);
	},
	selectDown(){
		// ====================================================
		let res = [];
		let editedParam = appsmith.store.EDITED_PARAMETER;
		let Control = TableList;
		let list = [];
		if (editedParam.typeName =="LIST") {
			Control = window["TableList"];
			list = appsmith.store.LIST_TABLE;
		}
		res.push(editedParam.typeName);
		if (editedParam.typeName == "MAP") {
			Control = window["TableMap"];
			list = appsmith.store.MAP_TABLE;
		}
		// ====================================================
		
		let pos = Control.selectedRowIndex || 0;
		if (pos == -1) pos = 0;
		let max = Control.tableData.length - 1;
		let newPos = (pos<max) ? pos + 1 : 0; 
		list = utils.moveElementInJsonArray(list, pos, newPos);
		storeValue(`${editedParam.typeName}_TABLE`, list);
		storeValue("SELECTED_ROW", newPos);
		return res;
	},
	selectUp(){
	// ====================================================
		let res = [];
		let editedParam = appsmith.store.EDITED_PARAMETER;
		let Control = TableList;
		let list = [];
		if (editedParam.typeName =="LIST") {
			Control = window["TableList"];
			list = appsmith.store.LIST_TABLE;
		}
		res.push(editedParam.typeName);
		if (editedParam.typeName == "MAP") {
			Control = window["TableMap"];
			list = appsmith.store.MAP_TABLE;
		}
		// ====================================================
		
		let pos = Control.selectedRowIndex || 0;
		if (pos == -1) pos = 0;
		let max = Control.tableData.length - 1;
		let newPos = (pos>0) ? pos - 1 : max; 
		list = utils.moveElementInJsonArray(list, pos, newPos);
		storeValue(`${editedParam.typeName}_TABLE`, list);
		storeValue("SELECTED_ROW", newPos);
		return res;
	},
	async onFontChange(){
		storeValue("SELECTED_FONT", SelectFontName.selectedOptionValue);
		let val = js_font.updateFont(appsmith.store.EDIT.FONT, appsmith.store.SELECTED_FONT);
		storeValue("SELECTED_FONT_CODE", val.updatedCode);

		return val;
	},
	async onFontSizeUpdate(){
		
	},
	async onFontBoldUpdate(){
		
	},
	async onFontItalicUpdate(){
		
	}
}