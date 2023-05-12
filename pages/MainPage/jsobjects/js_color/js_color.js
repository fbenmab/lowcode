export default {
	updateRed(n){
		let rgba = appsmith.store.RGBA;
		if (!rgba) rgba = "rgba(0,0,0,0)";
	 	rgba = rgba.replace("rgba(", "").replace(")","").split(",");
		storeValue("RGBA", `rgba(${n},${rgba[1]},${rgba[2]},${rgba[3]})`);
	},
	updateGreen(n){
		let rgba = appsmith.store.RGBA;
		if (!rgba) rgba = "rgba(0,0,0,0)";
	 	rgba = rgba.replace("rgba(", "").replace(")","").split(",");
		storeValue("RGBA", `rgba(${rgba[0]},${n},${rgba[2]},${rgba[3]})`);
	},
	updateBlue(n){
		let rgba = appsmith.store.RGBA;
		if (!rgba) rgba = "rgba(0,0,0,0)";
	 	rgba = rgba.replace("rgba(", "").replace(")","").split(",");
		storeValue("RGBA", `rgba(${rgba[0]},${rgba[1]},${n},${rgba[3]})`);
	},
	updateAlfa(n){
		let rgba = appsmith.store.RGBA;
		if (!rgba) rgba = "rgba(0,0,0,0)";
	 	rgba = rgba.replace("rgba(", "").replace(")","").split(",");
		storeValue("RGBA", `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${n/100})`);
	},
	getRedColor(rgba = "rgba(255,0,0,0)"){
		if (!rgba) rgba = "rgba(0,0,0,0)";
	 	rgba = rgba.replace("rgba(", "").replace(")","").split(",");
		return parseInt(rgba[0]);
	},
	getGreenColor(rgba){
		if (!rgba) rgba = "rgba(0,0,0,0)";
	 	rgba = rgba.replace("rgba(", "").replace(")","").split(",");
		return parseInt(rgba[1]);
	},
	getBlueColor(rgba){
		if (!rgba) rgba = "rgba(0,0,0,0)";
	 	rgba = rgba.replace("rgba(", "").replace(")","").split(",");
		return parseInt(rgba[2]);
	},
	getAlfa(rgba){
		if (!rgba) rgba = "rgba(0,0,0,0)";
	 	rgba = rgba.replace("rgba(", "").replace(")","").split(",");
		return parseInt(rgba[3] * 100);
	},
	rgbaToHex(rgba ) {
		if (!rgba) rgba = "rgba(0,0,0,0)";
		let c = rgba.replace("rgba(", "").replace(")","").split(",");
		let result = `0x${utils.numberToHex(c[3]*255)}${utils.numberToHex(c[0])}${utils.numberToHex(c[1])}${utils.numberToHex(c[2])}`;
		return result;
	},
	removeLeadingZeros(arr) {
		let i = 0;
		while (arr[i] == "00") {
			arr.shift();
		}
		return arr;
	},
	getRgbaFromConfigValue(value){
		let rgba = value.split("#");
		return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]/255})`;
	},

	// Calculate the value for COLOR config update
	rgbaToHexConfig(rgba = "rgba(0,10,0,0)") {
		let c = rgba.replace("rgba(", "").replace(")","").replace(" ","").split(",");
		let r = c[0];
		let g = c[1];
		let b = c[2];
		let a = c[3]*255;
		let h = `${a>0?utils.numberToHex(a):"00"},${r>0?utils.numberToHex(r):"00"},${g>0?utils.numberToHex(g):"00"},${b>0?utils.numberToHex(b):"00"}`.split(",");
		return `${r}#${g}#${b}#${Math.round(a)}#x${this.removeLeadingZeros(h).join("") ? this.removeLeadingZeros(h).join("") : "0"}`;
	}
}