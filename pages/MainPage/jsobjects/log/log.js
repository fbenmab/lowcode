export default {
	info(text = "--- info -----------------------------------") {
		let ts = utils.getCurrentDateTime(true);
		let deb = (appsmith.store.DEBUGGING ? appsmith.store.DEBUGGING + "\n" : "");
		let func = "INFO";
		deb += `[${ts}][${func}]>${text}<`;
		storeValue("DEBUGGING", deb);
		return (deb);
	},
	error(text = "--- error ----------------------------------") {
		let ts = utils.getCurrentDateTime(true);
		let deb = (appsmith.store.DEBUGGING ? appsmith.store.DEBUGGING + "\n" : "");
		let func = "ERROR";
		deb += `[${ts}][${func}]>${text}<`;
		storeValue("DEBUGGING", deb);
		return (deb);
	},
	warn(text = "--- warn -----------------------------------") {
		let ts = utils.getCurrentDateTime(true);
		let deb = (appsmith.store.DEBUGGING ? appsmith.store.DEBUGGING + "\n" : "");
		let func = "WARN";
		deb += `[${ts}][${func}]>${text}<`;
		storeValue("DEBUGGING", deb);
		return (deb);
	},
	clear(){
		storeValue("DEBUGGING", "");
	}
}