//  db.js - Agile Database module to access agile SQLite3 database
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

//  'db' module exports
exports.open  = db_open;
exports.close = db_close;
exports.query = db_query;

var u = require('./u');

//==================
//  SQLite3 database
//==================
const sqlite3 = require('sqlite3').verbose();

const dbFile = '../agile.db';

function db_open()
{
	db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log(u.fmtDate() + 'Connected to ' + dbFile + ' SQlite3 database.');
	});

	return db;
}

function db_close(db)
{
	// close the database connection
	db.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log(u.fmtDate() + 'Closed ' + dbFile + ' SQlite3 database.');
	});
}

function db_query(dbC, sql, rows, callerCb)
{
	dbC.serialize(() => {
		dbC.each(sql,
			function (err, row)
			{
				if (err) {
					console.error(err.message);
				}
				rows.push(row);
				console.log(u.fmtDate() + 'db_query() row : ' + JSON.stringify(row));
			},
			function() {
				console.log(u.fmtDate() + 'db_query() sql : ' + sql);
			    callerCb();
			}
		); // dbC.each()
	}); // dbC.serialize
}
