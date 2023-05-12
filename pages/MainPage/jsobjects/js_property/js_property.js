export default {
	parseConfigValueProperty(result, dimensionLevel) {
		let paramType = result.parameterResultValues[2];
		let paramMetaType = result.parameterResultValues[5];
		let resultValues = result.resultValues;
		let res = [];
    for (let i=0;i<resultValues.length / 3; i++){
			if (resultValues[i*3] == dimensionLevel) {
				let ar = resultValues[i*3+2].split(/[\n\r]+/);
				res = ar.filter((el) => el !== "" && el !== null);
				res.shift();res.shift();
			}
			return res.sort().join("\n");
		}
	},
	buildPropertyValue(text, dt){
  let res = text.split("\r\n").sort();
  res = ["#ParameterProperties", "#"+dt, ...res].join("\r\n") + "\r\n";

  return res;
}
}