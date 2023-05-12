export default {
	getConfig (val) {
		if (val) {
			return val.split(",");
		}
		return ["","","",""];
	},
	updateX(val) {
		let rec = this.getConfig(appsmith.store["EDIT.RECTANGLE"]);
		rec[0] = val;
		storeValue("EDIT.RECTANGLE", rec.join(","));
	},
	updateY(val) {
		let rec = this.getConfig(appsmith.store["EDIT.RECTANGLE"]);
		rec[1] = val;
		storeValue("EDIT.RECTANGLE", rec.join(","));
	},
	updateW(val) {
		let rec = this.getConfig(appsmith.store["EDIT.RECTANGLE"]);
		rec[2] = val;
		storeValue("EDIT.RECTANGLE", rec.join(","));
	},
	updateH(val) {
		let rec = this.getConfig(appsmith.store["EDIT.RECTANGLE"]);
		rec[3] = val;
		storeValue("EDIT.RECTANGLE", rec.join(","));
	}
}