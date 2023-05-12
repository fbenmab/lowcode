export default {
	fontNames() {
	return [
		{ "label": "Arial", "value": "Arial" },
		{ "label": "Book Antiqua", "value": "Book Antiqua" },
		{ "label": "Bookman Old Style", "value": "Bookman Old Style" },
		{ "label": "Calibri", "value": "Calibri" },
		{ "label": "Cambria", "value": "Cambria" },
		{ "label": "Century", "value": "Century" },
		{ "label": "Century Gothic", "value": "Century Gothic" },
		{ "label": "Comic Sans MS", "value": "Comic Sans MS" },
		{ "label": "Consolas", "value": "Consolas" },
		{ "label": "Courier", "value": "Courier" },
		{ "label": "Courier New", "value": "Courier New" },
		{ "label": "Dialog", "value": "Dialog" },
		{ "label": "DialogInput", "value": "DialogInput" },
		{ "label": "Franklin Gothic Medium", "value": "Franklin Gothic Medium" },
		{ "label": "Garamond", "value": "Garamond" },
		{ "label": "Georgia", "value": "Georgia" },
		{ "label": "Gill Sans", "value": "Gill Sans" },
		{ "label": "Helvetica", "value": "Helvetica" },
		{ "label": "High Tower Text", "value": "High Tower Text" },
		{ "label": "Impact", "value": "Impact" },
		{ "label": "Lucida Bright", "value": "Lucida Bright" },
		{ "label": "Lucida Calligraphy", "value": "Lucida Calligraphy" },
		{ "label": "Lucida Console", "value": "Lucida Console" },
		{ "label": "Lucida Fax", "value": "Lucida Fax" },
		{ "label": "Lucida Handwriting", "value": "Lucida Handwriting" },
		{ "label": "Lucida Sans Typewriter", "value": "Lucida Sans Typewriter" },
		{ "label": "Lucida Sans Unicode", "value": "Lucida Sans Unicode" },
		{ "label": "MS Gothic", "value": "MS Gothic" },
		{ "label": "Monospaced", "value": "Monospaced" },
		{ "label": "Symbol", "value": "Symbol" },
		{ "label": "Tahoma", "value": "Tahoma" },
		{ "label": "TimesRoman", "value": "TimesRoman" },
		{ "label": "Verdana", "value": "Verdana" },
		{ "label": "ZapfDingbats", "value": "ZapfDingbats" }
		];
	},
	generateTestFont (code="Arial Bold Italic#3#18", text="") {
		let codes = code.split("#");
		let props = codes[0].split(" ").reverse();
		let pref = [];

		if (props.length > 1) {
			pref = props.slice(0,props.length - 1);
		}

		let is_bold = pref.indexOf("Bold") > -1 ? true : false;
		let is_italic = pref.indexOf("Italic") > -1 ? true : false;

		let flag = parseInt(codes[1]);
		if (!is_bold) is_bold = (flag & 1) == 1;
		if (!is_italic) is_italic = (flag & 2) == 2;
		
		let familyName = codes[0].replace(" Italic","").replace(" Bold","");
		let familyNameFull = familyName;
		if (is_bold) familyNameFull+=" Bold";
		if (is_italic) familyNameFull+=" Italic";
		let weightName = is_bold ? "Bold" : "Normal";
		let fontStyle = is_italic ? "Italic" : "Normal";
		let fontSize = codes[2];
		if (text.indexOf("@nosize")>-1){
			text = text.replace("@noszize", "");
			fontSize = 16;
			text = familyNameFull;
		}
		let preview = `<span style="font-family:${familyName};font-weight:${weightName};font-style:${fontStyle};font-size:${fontSize}px">${text || familyNameFull}<\span>`;
	
		return {
			"preview" : preview,
			"familyName": familyName,
			"familyNameFull": familyNameFull
		}
	},
	updateFont(code="Arial Bold Italic#3#18", name="Arial") {
		
		let codes = code.split("#");
		let props = codes[0].split(" ").reverse();
		let pref = [];

		if (props.length > 1) {
			pref = props.slice(0,props.length - 1);
		}

		let is_bold = pref.indexOf("Bold") > -1 ? true : false;
		let is_italic = pref.indexOf("Italic") > -1 ? true : false;

		let flag = parseInt(codes[1]);
		if (!is_bold) is_bold = (flag & 1) == 1;
		if (!is_italic) is_italic = (flag & 2) == 2;
		
		let familyName = codes[0].replace(" Italic","").replace(" Bold","");
		if (!name) name = familyName;
		let familyNameFull = familyName;
		let updatedFamilyName = name;
		
		if (is_bold) {
			familyNameFull+=" Bold";
			updatedFamilyName+=" Bold";
		}
		if (is_italic) {
			familyNameFull+=" Italic";
			updatedFamilyName+=" Italic";
		}
		let weightName = is_bold ? "Bold" : "Normal";
		let fontStyle = is_italic ? "Italic" : "Normal";
		let fontSize = codes[2];
		let preview = `<span style="font-family:${familyName};font-weight:${weightName};font-style:${fontStyle};font-size:${fontSize}px">${name || familyNameFull}<\span>`;
		let updatedCode = [updatedFamilyName, codes[1], codes[2]].join("#");
		return {
			"preview" : preview,
			"familyName": familyName,
			"familyNameFull": familyNameFull,
			"updatedFamilyName": updatedFamilyName,
			"updatedCode": updatedCode,
			"isBold": is_bold,
			"isItalic": is_italic,
			"fontSize": parseInt(fontSize)
		}
	},
	updateFontSize(code, size) {
		let codes = code.split("#");
		codes[2] = size;
		storeValue("SELECTED_FONT_CODE", codes.join("#"));
		return codes.join("#");
	},
	getPropStates(input) {
		const italic = (input & 1) === 1;
		const bold = (input & 2) === 2;
		return { italic, bold };
	},
	updateFontBold(code, state){
		let codes = code.split("#");
		let v = parseInt(codes[1]);
		let states = this.getPropStates(v);
		let newval = (state * 2) + (states.italic * 1);
		codes[1]=newval;
		storeValue("SELECTED_FONT_CODE", codes.join("#"));
		return codes.join("#");
	},
	updateFontItalic(code, state){
		let codes = code.split("#");
		let v = parseInt(codes[1]);
		let states = this.getPropStates(v);
		let newval = (states.bold * 2 ) + (state * 1);
		codes[1]=newval;
		storeValue("SELECTED_FONT_CODE", codes.join("#"));
		return codes.join("#");
	}
}