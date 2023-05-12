export default {
	readMapData(result, dimensionLevel){
		let _map = [];
		for (var i=0; i<result.length/3; i++){
			if (result[i*3] === dimensionLevel) {
				 _map.push({"key": result[i*3+1], "value": result[i*3+2]});
			}
		}
		return _map;
	}
}