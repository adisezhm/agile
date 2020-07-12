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


var u = require('./util');

//==================
//  SQLite3 database
//==================
const sqlite3 = require('sqlite3').verbose();

var dbLogBits = 0;
const LOG_OPEN  = 1;
const LOG_CLOSE = 2;
const LOG_QUERY_STMT = 4;
const LOG_QUERY_ROW = 8;

function db_setlog(logBits)
{
	dbLogBits = logBits;
}

function db_open(dbFile)
{
	dbC = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, 
		(err) => {
			if (err) {
				return console.error(err.message);
			}
			if( dbLogBits & LOG_OPEN ) {
				console.log(u.fmtDate() + 'db_open()  : ' + dbFile + ' SQLite3 database.');
			}
		}
	);

	return dbC;
}

function db_close(dbC, dbFile)
{
	// close the database connection
	dbC.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		if( dbLogBits & LOG_CLOSE ) {
			console.log(u.fmtDate() + 'db_close() : ' + dbFile + ' SQlite3 database.');
		}
	});
}

function db_query(dbC, sqlStmt, rows, callerCb)
{
	if( dbLogBits & LOG_QUERY_STMT ) {
		console.log(u.fmtDate() + 'db_query() : ' + sqlStmt);
	}
	dbC.serialize(() => {
		dbC.each(sqlStmt,
			function (err, row)
			{
				if (err) {
					console.log(u.fmtDate() + 'db_query() : Error: ' + err.message);
				}
				rows.push(row);
				if( dbLogBits & LOG_QUERY_ROW ) {
					console.log(u.fmtDate() + 'db_query() : ' + JSON.stringify(row));
				}
			},
			function() {
			    callerCb();
			}
		); // dbC.each()
	}); // dbC.serialize
}

//  'db' module exports
exports.setlog         = db_setlog;
exports.open           = db_open;
exports.close          = db_close;
exports.query          = db_query;
exports.LOG_OPEN       = LOG_OPEN;
exports.LOG_CLOSE      = LOG_CLOSE;
exports.LOG_QUERY_STMT = LOG_QUERY_STMT;
exports.LOG_QUERY_ROW  = LOG_QUERY_ROW;
