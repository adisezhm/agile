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
var https   = require('https');
var fs      = require('fs');

//====  ROUTES
var app = express();

// GET /
app.get('/', function (req, res) {
	console.log(u.fmtDate() + " GET /");
	res.send('Welcome to Agile Homepage !! Have a great day\n');
})

// POST /p/list
app.post(/p\/list\/?$/, function(req, res) {
	// split URL so that one can extract : list
	var urlParts = url.parse(req.url).pathname.split('/');

	// remove the empty first element, as the URL
	// starts with a /, first element is empty !!
	urlParts.shift();

	p.projectsH(req, res, urlParts); // this calls res.send() too
})

// POST /<projectName>/sprints/(active|backlog|completed)
app.post(/^\/[a-zA-Z][a-zA-Z1-9]*\/sprints\/(active|backlog|completed)\/?$/, function(req, res) {

	// split URL so that one can extract : active|backlog|completed
	var urlParts = url.parse(req.url).pathname.split('/');

	console.log('agile::name-sprints ' + urlParts);

	// remove the empty first element, as the URL
	// starts with a /, first element is empty !!
	urlParts.shift();

	s.sprintsPNameH(req, res, urlParts); // this calls res.send() too
})

// POST /projectId/sprints/(active|backlog|completed)
app.post(/^\/[1-9][0-9]*\/sprints\/(active|backlog|completed)\/?$/, function(req, res) {
	// split URL so that one can extract : active|backlog|completed
	var urlParts = url.parse(req.url).pathname.split('/');

	console.log('agile::projectId-sprints ' + urlParts);

	// remove the empty first element, as the URL
	// starts with a /, first element is empty !!
	urlParts.shift();

	s.sprintsPidH(req, res, urlParts); // this calls res.send() too
})

//  404 Route
app.get('*', function(req, res){
	pN = url.parse(req.url).pathname;

	res.status(404).send('Error: URL ' + pN + ' not recognized by Agile.\n');
});

//====  HTTPs SERVER
var server = https.createServer({
						key: fs.readFileSync('../cert/agile.key'),
						cert: fs.readFileSync('../cert/agile.pem')
						}, app)

// Note :
// Begin accepting connections on the specified port and hostname.
// If the hostname is omitted, the server will accept connections
// on any IPv6 address (::) when IPv6 is available, or any IPv4
// address (0.0.0.0) otherwise. A port value of zero will assign
// a random port.
//
// Passing "localhost", to avoid getting back :: for 'address

server.listen(8000, "localhost", function () {
	var h = server.address().address
	var p = server.address().port

	console.log('Agile listening at https://%s:%d/', h, p)
})
