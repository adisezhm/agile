//  agile.js - nodejs backend (server) for Agile
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

function sprints(db, urlPathName, zsList, callerCb)
{
	db.serialize(() => {
		db.each(`SELECT sName, sStatus, sDesc FROM sprint where sStatus = ?`,
				urlPathName.slice(1),
			function (err, row)
			{
				if (err) {
					console.error(err.message);
				}
				zsList.push(row);
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

function db_query(urlPathName, httpCb)
{
	var sprintsList = new Array();

	db = db_open();
	sprints(db, urlPathName, sprintsList,
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
const http = require('http');

function myPort8K(req, res)
{
	var urlParts = url.parse(req.url);

	console.log('\n' + fmtDate() + 'agile.js processing : ' + urlParts.pathname);

	db_query(urlParts.pathname,
		function(sprintsList)
		{
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify(urlParts.pathname) + '\n\n' + JSON.stringify(sprintsList));

			console.log(fmtDate() + 'agile.js processed  : ' + JSON.stringify(urlParts.pathname) + " " + JSON.stringify(sprintsList));
		}
	);
}

//======================
//  HTTP server - create
//======================
const hostname = '127.0.0.1';
const port = 8000;
const server = http.createServer(myPort8K);
server.listen(port, hostname,
		() => {
			console.log(fmtDate() + `Server running at http://${hostname}:${port}/`);
		});
