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

var express = require('express');
var app = express();

app.get('/', function (req, res) {
	console.log(fmtDate() + " GET /");
	res.send('Welcome to Agile Homepage !!  Have a great day');
})

// GET /sprints
app.get('/sprints/active', function(req, res) {
	url_sprints(req, res, 'active'); // this calls res.send() too
})

// GET /sprints/completed
app.get('/sprints/completed', function(req, res) {
	url_sprints(req, res, 'completed'); // this calls res.send() too
})

// GET /sprints/backlog
app.get('/sprints/backlog', function(req, res) {
	url_sprints(req, res, 'backlog'); // this calls res.send() too
})

var server = app.listen(8000, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Agile listening at http://%s:%s", host, port)
})

//============================
//  Utility functions database
//============================
const moment = require('moment');
const momentTz = require('moment-timezone');

function fmtDate()
{
	return moment().format('YYYY-MM-DD HH:mm:ss ZZ ') + momentTz.tz.guess() + ' ';
}

//==================
//  SQLite3 database
//==================
const sqlite3 = require('sqlite3').verbose();

function db_open()
{
	db = new sqlite3.Database('../agile.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log(fmtDate() + 'Connected to the ../agile.db SQlite3 database.');
	});

	return db;
}

function sprints(db, keyVal, zsList, callerCb)
{
	db.serialize(() => {
		db.each(`SELECT sName, sStatus, sDesc FROM sprint where sStatus = ?`,
				keyVal,
			function (err, row)
			{
				if (err) {
					console.error(err.message);
				}
				zsList.push(row);
				console.log(fmtDate() + 'sprints row : ' + JSON.stringify(row));
			},
			function() {
			    callerCb();
			}
		); // db.each()
	}); // db.serialize
}

function db_close(db)
{
	// close the database connection
	db.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log(fmtDate() + 'Closed the ./agile.db SQlite3 database connection.');
	});
}

function db_query(keyVal, httpCb)
{
	var sprintsList = new Array();

	db = db_open();
	sprints(db, keyVal, sprintsList,
			() => {
					// below two, ordering is not a must !
					db_close(db);
					httpCb(sprintsList);
				}
			);
}

//========================
//  HTTP request - handler
//========================
const url = require('url');

function url_sprints(req, res, sStatusVal)
{
	var urlParts = url.parse(req.url);

	console.log('\n' + fmtDate() + 'agile.xp.js processing : ' + urlParts.pathname);

	db_query(sStatusVal,
		function(sprintsList)
		{
			res.send(JSON.stringify(sprintsList));
		}
	);
}
