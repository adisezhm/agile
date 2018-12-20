//  agile.js - Express/node.js based backend (server) for Agile
//  Copyright (C) 2018 adisezhm@gmail.com
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//

//====  REQUIRES
var u       = require('./u');
var s       = require('./sprints');
var p       = require('./projects');
var url     = require('url');
var express = require('express');

//====  ROUTES
var app = express();

// GET /
app.get('/', function (req, res) {
	console.log(u.fmtDate() + " GET /");
	res.send('Welcome to Agile Homepage !! Have a great day');
})

// GET /p/list
app.get(/p\/list\/?$/, function(req, res) {
	// split URL so that one can extract : list
	var urlParts = url.parse(req.url).pathname.split('/');

	// remove the empty first element, as the URL
	// starts with a /, first element is empty !!
	urlParts.shift();

	p.projectsH(req, res, urlParts); // this calls res.send() too
})

// GET /<projectName>/sprints/(active|backlog|completed)
app.get(/^\/[a-zA-Z][a-zA-Z1-9]*\/sprints\/(active|backlog|completed)\/?$/, function(req, res) {
	// split URL so that one can extract : active|backlog|completed
	var urlParts = url.parse(req.url).pathname.split('/');

	// remove the empty first element, as the URL
	// starts with a /, first element is empty !!
	urlParts.shift();

	s.sprintsPNameH(req, res, urlParts); // this calls res.send() too
})

// GET /projectId/sprints/(active|backlog|completed)
app.get(/^\/[1-9][0-9]*\/sprints\/(active|backlog|completed)\/?$/, function(req, res) {
	// split URL so that one can extract : active|backlog|completed
	var urlParts = url.parse(req.url).pathname.split('/');

	// remove the empty first element, as the URL
	// starts with a /, first element is empty !!
	urlParts.shift();

	s.sprintsPidH(req, res, urlParts); // this calls res.send() too
})

//  404 Route
app.get('*', function(req, res){
	pN = url.parse(req.url).pathname;

	res.send('Error: URL ' + pN + ' not recognized by Agile.', 404);
});

//====  HTTP SERVER
var server = app.listen(8000, function () {
	var h = server.address().address
	var p = server.address().port

	console.log("Agile listening at http://%s:%s", h, p)
})
