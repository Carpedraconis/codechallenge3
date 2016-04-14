
var express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var cookieSession = require("cookie-session");

var mongo = require('mongodb');
var monk = require('monk');
var db =  monk('localhost:27017/employees');

var app = express();
app.use(express.static('public'));

require('./showViews.js')();

app.use(cookieParser('4m4z1ng'));
app.use(cookieSession({ secret: 'spiderpig', cookie: { maxAge: 60 * 60 * 1000 }}));
app.use(bodyParser());

//************************************************************************************
// This is the index.  Handles password authentication
//************************************************************************************

app.get('/', function (req, res) {

	var parms = {
					req: req,
					title: 'Employee Listing',
					heading: 'Welcome to the Employee Listing'
				};
	var html = showIndex(parms);
	res.send(html);

});

//************************************************************************************
// Attempt to authenticate the password.
//************************************************************************************

app.post('/authenticate', function (req, res) {

	var pass = req.body.password;

	if (pass == "qwerty") {
		// handle login
		req.session.connected = "Y";
	}
	else {
		// reject login
		req.session.connected = "";
	}
	req.session.company = -1;

	// Send them back to the home page
    res.redirect("/");


});

//************************************************************************************
// Log out.
//************************************************************************************

app.get('/logout', function (req, res) {

	req.session = null;
	delete req.session;

	// Send them back to the home page
    res.redirect("/");


});

//************************************************************************************
// show list of employees
//************************************************************************************

app.get('/showEmployees', function (req, res) {


	if (req.session.connected != "Y") {
		res.redirect('/');
		return;
	}

	var hasCompany = false;
	if (req.session.company >= 0) {
		hasCompany = true;
	}

	if (!hasCompany) {

		var collection = db.get("company");

		collection.find({},{},function(e,companies) {

			//console.log("C:" + companies);
			//process.stdout.write(companies);

			var parms = {
							req: req,
							companies: companies,
							title: 'Company Selection'
						};

			//  show page to select company
			var html = showCompanies(parms);

			res.send(html);

		});


	}
	else {

		var collection = db.get("employee");

		var compid = parseInt(req.session.company);

		collection.find({company:compid},{},function(e,employees) {

			var parms = {
							req: req,
							employees: employees,
							title: 'Employee List'
						};

			//  show page to select company
			var html = showEmployees(parms);

			res.send(html);

		});

	}

});

//************************************************************************************
// select which company to work with
//************************************************************************************

app.get('/selectedCompany/:id', function (req, res) {

	if (req.session.connected != "Y") {
		res.redirect('/');
		return;
	}

	var id = parseInt(req.params.id);

	// Verify this id exists in the company collection

	var collection = db.get("company");

	collection.findOne({id:id},{},function(e,companies) {

		if (companies == null) {
			req.session.company = -1;
			var goingto = "/selectACompany";
		}
		else {

			req.session.company = id;
			req.session.companyName = companies['name'];
			var goingto = "/showEmployees";
		}

		// Send them to the location selected.

			// Send them back to the home page
    	res.redirect(goingto);

	});

});

//************************************************************************************
// Show the SELECT A COMPANY screen
//************************************************************************************

app.get('/selectACompany', function (req, res) {

	if (req.session.connected != "Y") {
		res.redirect('/');
		return;
	}

	var collection = db.get("company");

	collection.find({},{},function(e,companies) {

		var parms = {
						req: req,
						companies: companies,
						title: 'Company Selection'
					};

		// employees has the list of employees, in json format
		var html = showCompanies(parms);

		res.send(html);

	});


});


//************************************************************************************
// Show the EDIT AN EMPLOYEE screen
//************************************************************************************

app.get('/showEmployee/:id', function (req, res) {

	if (req.session.connected != "Y") {
		res.redirect('/');
		return;
	}

	var collection = db.get("employee");

	var id = req.params.id;

	collection.findOne({_id:id},{},function(e,employees) {

		var parms = {
						req: req,
						employees: employees,
						title: 'View/Edit Employee'
					};

		//  show page to select company
		var html = showEmployee(parms);

		res.send(html);

	});


});

//************************************************************************************
// Change/Add User
//************************************************************************************

app.post('/changeEmployee', function (req, res) {

	if (req.session.connected != "Y") {
		res.redirect('/');
		return;
	}

	var collection = db.get("employee");

	// Fill some ids

	var type = req.body.type;
	var name = req.body.name;
	var social = req.body.social;
	var phone = req.body.phone;
	var dob = req.body.dob;

	if (type == "edit") {
		// We are Editing this record

		var id = req.body.id;

		var payload = {
			name: name,
			social: social,
			phone: phone,
			dob: dob
		}

		collection.findAndModify({_id: id}, {$set: payload}, function(err, emp){

			if (err) {
				res.json(500, err);
			}
			else {
				res.redirect('/showEmployee/'+id+'?message=Record+Updated');
			}

		});

	}
	else {
		// We are adding this record

		var payload = {
			company: req.session.company,
			name: name,
			social: social,
			phone: phone,
			dob: dob
		}

		collection.insert(payload, function(err, emp){

			if (err) {
				res.json(500, err);
			}
			else {
				res.redirect('/showEmployees');
			}


		});

	}

});

//************************************************************************************
// show add new employee form
//************************************************************************************

app.get('/addEmployee', function (req, res) {

	if (req.session.connected != "Y") {
		res.redirect('/');
		return;
	}

	var parms = {
					req: req,
					title: 'Add New Employee'
				};

	//  show page to select company
	var html = showAddEmployee(parms);

	res.send(html);


});


//************************************************************************************
// Delete User
//************************************************************************************

app.get('/deleteEmployee', function (req, res) {

	if (req.session.connected != "Y") {
		res.redirect('/');
		return;
	}

	var id = req.query.id;

	var collection = db.get("employee");

	collection.remove({_id: id}, function(err){
		if (err) {
			res.json(500, err);
		}
		else {
			res.redirect('/showEmployees');
		}

	});


});


/************************************
*
*
*   This is the REST API section
*
*
* ***********************************/

//************************************************************************************
// Get Companies
//************************************************************************************

app.post('/getCompanies', function (req, res) {

	if (req.body.password != "qwerty") {
		res.json(500, "Could not connect");
		return;
	}

	var collection = db.get("company");

	collection.find({},{},function(err,companies) {

		if (err) {
			res.json(500, err);
		}
		else {
			res.send(companies);
		}

	});

});

//************************************************************************************
// Get Employees
//************************************************************************************

app.post('/getEmployees', function (req, res) {

	if (req.body.password != "qwerty") {
		res.json(500, "Could not connect");
		return;
	}

	var company = req.body.company;
	if (company != null) {
		company = parseInt(company);
	}

	if (company == null || company < 0) {
		res.json(500, "Invalid Company.");
		return;
	}

	var collection = db.get("employee");

	collection.find({company: company},{},function(err,employees) {

		var count = Object.keys(employees).length;

		if (err) {
			payload = { error: error };
			res.json(500, payload);
		}
		else if (count < 1) {
			payload = { error: "No Employees for that company" };
			res.json(500, payload);
		}
		else {
			res.send(employees);
		}


	});

});

//************************************************************************************
// Get Employee
//************************************************************************************

app.post('/getEmployee', function (req, res) {

	if (req.body.password != "qwerty") {
		res.json(500, "Could not connect");
		return;
	}


	var id = req.body.id;

	var collection = db.get("employee");

	collection.findOne({_id: id}, {}, function(err, emp){

		if (emp != null) {
			var count = Object.keys(emp).length;
		}
		else {
			payload = { error: "Employee not found" };
			res.json(500, payload);
			return;
		}

		if (err) {
			payload = { error: err };
			res.json(500, payload);
		}
		else if (count < 1) {
			payload = { error: "Employee not found" };
			res.json(500, payload);
		}
		else {
			res.json(emp);
		}


	});

});

//************************************************************************************
// insertEmployee
//************************************************************************************

app.post('/insertEmployee', function (req, res) {

	if (req.body.password != "qwerty") {
		res.json(500, "Could not connect");
		return;
	}

	var company = req.body.company;
	if (company != null) {
		company = parseInt(company);
	}

	if (company == null || company < 0) {
		res.json(500, "Invalid Company.");
		return;
	}

	var collection = db.get("company");

	collection.find({id: company},{},function(err,companies) {

		var count = Object.keys(companies).length;

		if (err) {
			payload = { error: error };
			res.json(500, payload);
		}
		else if (count < 1) {
			payload = { error: "No such company" };
			res.json(500, payload);
		}
		else {

			var name = req.body.name;
			var social = req.body.social;
			var phone = req.body.phone;
			var dob = req.body.dob;

			var payload = {
				company: company,
				name: name,
				social: social,
				phone: phone,
				dob: dob
			};

			collection = db.get("employee");

			collection.insert(payload, function(err, emp){

				if (err) {
					res.json(500, err);
				}
				else {
					res.json(200, emp);
				}


			});

		}

	});

});


//************************************************************************************
// updateEmployee
//************************************************************************************

app.post('/updateEmployee', function (req, res) {

	if (req.body.password != "qwerty") {
		res.json(500, "Could not connect");
		return;
	}

	var id = req.body.id;

	var name = req.body.name;
	var social = req.body.social;
	var phone = req.body.phone;
	var dob = req.body.dob;

	var payload = {
		name: name,
		social: social,
		phone: phone,
		dob: dob
	};

	var collection = db.get("employee");

	collection.findAndModify({_id: id}, {$set: payload}, function(err, emp){

		// Update payload to reflect changes
		emp.name = name;
		emp.social = social;
		emp.phone = phone;
		emp.dob = dob;

		if (err) {
			res.json(500, err);
		}
		else {
			res.json(200, emp);
		}


	});

});




//************************************************************************************
// Delete User
//************************************************************************************

app.post('/removeEmployee', function (req, res) {

	if (req.body.password != "qwerty") {
		res.json(500, "Could not connect");
		return;
	}

	var id = req.body.id;

	var collection = db.get("employee");

	collection.remove({_id: id}, function(err){
		if (err) {
			res.json(500, err);
		}
		else {

			var payload = {
				message: "Employee Removed"
			}

			res.status(200).send(payload);

		}

	});

});



//************************************************************************************
// START THE SERVER
//************************************************************************************

var server = app.listen(8088, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Listening at http://%s:%s", host, port);

});

