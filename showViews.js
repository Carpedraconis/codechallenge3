// Load my custom template class
var myTpl = require("./template.js").myTpl;

module.exports = function() {


	// *****************************************************************
	//
	// Show the index page
	//
	// *****************************************************************

	this.showIndex = function(parms) {

		var connected = false;
		var req = parms['req'];

		if (req.session.connected == "Y") {
			connected = true;
			var conn = "logged in [<a href='/logout'>Logout</a>]";
		}
		else {
			var conn = "NOT logged in";
		}

		var tpl = new myTpl("index");
		tpl.set("heading",parms['heading']);
		tpl.set("connected",conn);
		var meat = tpl.fetch();

		if (!connected) {
			var tpl = new myTpl("password");
			meat = meat + tpl.fetch();
		} else {
			var tpl = new myTpl("linkEmployees");
			meat = meat + tpl.fetch();
		}

		var tpl = new myTpl("skin_index");
		tpl.set("title",parms['title']);
		tpl.set("meat",meat);

		var html = tpl.fetch();

		return html;

	}

	// *****************************************************************
	//
	// Show the employee list
	//
	// *****************************************************************


	this.showEmployees = function(parms) {

		var req = parms.req;
		var employees = parms.employees;
		var meat;

		if (employees == null) {

			var tpl = new myTpl("employeeNone");
			meat = tpl.fetch();

		}
		else {

			meat = "";

			var tpl = new myTpl("employeeLoopLine");
			for (var key in employees) {

				var c = employees[key];

				tpl.set("id",c['_id']);
				tpl.set("name",c['name']);
				tpl.set("phone",c['phone']);
				var meat = meat + tpl.fetch();
				tpl.reset();

			}

			var tpl = new myTpl("employeeLoop");
			tpl.set("meat", meat);
			meat = tpl.fetch();

		}

		var tpl = new myTpl("employeeList");
		tpl.set("company",req.session.companyName);
		tpl.set("meat",meat);

		meat = tpl.fetch();

		var tpl = new myTpl("skin");
		tpl.set("title",parms['title']);
		tpl.set("meat",meat);

		var html = tpl.fetch();

		return html;

	}


	// *****************************************************************
	//
	// Show the list of companies
	//
	// *****************************************************************


	this.showCompanies = function(parms) {

		var req = parms['req'];


		var companies = parms['companies'];


		var meat = "";

		var tpl = new myTpl("selectLine");
		for (var key in companies) {

			var c = companies[key];

			tpl.set("id",c['id']);
			tpl.set("company",c['name']);
			var meat = meat + tpl.fetch();
			tpl.reset();

		}

		var tpl = new myTpl("selectCompany");
		tpl.set("meat",meat);
		meat = tpl.fetch();

		var tpl = new myTpl("skin");
		tpl.set("title",parms['title']);
		tpl.set("meat",meat);

		var html = tpl.fetch();


		return html;

	}


	// *****************************************************************
	//
	// Show the view/edit employee page
	//
	// *****************************************************************


	this.showEmployee = function(parms) {

		var req = parms['req'];
		var message = req.query.message;

		if (message==null) {
			message="";
		}

		var employees = parms['employees'];

		if (employees == null) {

			var tpl = new myTpl("employeeNone");
			var meat = tpl.fetch();

		}
		else {

			var tpl = new myTpl("employeeEdit");

			tpl.set("id",employees['_id']);
			tpl.set("name",employees['name']);
			tpl.set("social",employees['social']);
			tpl.set("phone",employees['phone']);
			tpl.set("dob",employees['dob']);
			tpl.set("message", message);

			var meat = tpl.fetch();

		}

		var tpl = new myTpl("skin");
		tpl.set("title",parms['title']);
		tpl.set("meat",meat);

		var html = tpl.fetch();

		return html;

	}

	// *****************************************************************
	//
	// Show the add new employee page
	//
	// *****************************************************************


	this.showAddEmployee = function(parms) {

		var req = parms.req;

		var tpl = new myTpl("employeeAdd");
		var meat = tpl.fetch();


		tpl = new myTpl("skin");
		tpl.set("title",parms.title);
		tpl.set("meat",meat);

		var html = tpl.fetch();

		return html;

	}

}
