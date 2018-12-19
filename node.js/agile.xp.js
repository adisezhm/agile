//  agile.xp.js - Express based backend (server) for Agile
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
var url     = require('url');
var express = require('express');

//====  ROUTES
var app = express();

// GET /
app.get('/', function (req, res) {
	console.log(fmtDate() + " GET /");
	res.send('Welcome to Agile Homepage !!  Have a great day');
})

// GET /sprints/(active|backlog|completed)
app.get(/^\/sprints\/(active|backlog|completed)/, function(req, res) {
	var urlPathnameParts = url.parse(req.url).pathname.split('/');

	s.sprintsH(req, res, urlPathnameParts[2]); // this calls res.send() too
})

//====  HTTP SERVER
var server = app.listen(8000, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Agile listening at http://%s:%s", host, port)
})
