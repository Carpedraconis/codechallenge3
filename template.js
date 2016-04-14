var fs = require("fs");

function myTpl (filename) {

	var fname = "views/" + filename + ".tpl";
	var fields = Object.create( null );
	var fileguts = "";

    return({
        set: set,
        fetch: fetch,
        reset: reset
    });

	function set(key, val) {
		fields[key] = val;
	}

	function reset() {
		fields = Object.create( null );
	}

	function fetch() {

		if (fileguts.length < 1) {
			var contents = fs.readFileSync(fname, "utf8");
			fileguts = contents;
		}
		else {
			contents = fileguts;
		}

		var theKey;

		for (key in fields) {
	        var thisval = fields[key];
	        //contents = contents.replace("{"+key+"}", thisval);
	        theKey = "{"+key+"}";
	        contents = contents.replace(new RegExp(theKey, 'g'), thisval);
		}

		return contents;

	}

}

module.exports.myTpl = myTpl

