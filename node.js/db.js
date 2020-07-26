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


// requires, from this project
const myutil = require('./myutil');

// requires, from this node.js
const u = require('util');

//==================
//  SQLite3 database
//==================
const sqlite3 = require('sqlite3').verbose();

var dbLogBits = 0;
const LOG_OPEN  = 1;
const LOG_CLOSE = 2;
const LOG_QUERY_STMT = 4;
const LOG_QUERY_ROW = 8;
const LOG_EXEC_STMT = 16;

function db_setlog(logBits)
{
	dbLogBits = logBits;
}

function db_open(dbFile, logBits)
{
	db_setlog(logBits);

	dbC = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, 
		(err) => {
			if (err) {
				console.log(myutil.fmtDate() + 'db_open() failed. DB='
							+ dbFile
							+ err.message);
				return console.error(err.message);
			}
			if( dbLogBits & LOG_OPEN ) {
				console.log(myutil.fmtDate() + 'db_open()  : ' + dbFile + ' SQLite3 database.');
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
			console.log(myutil.fmtDate() + 'db_close() : ' + dbFile + ' SQlite3 database.');
		}
	});
}

function db_query(dbC, sqlStmt, rows, callerCb)
{
	if( dbLogBits & LOG_QUERY_STMT ) {
		console.log(myutil.fmtDate() + 'db_query() : ' + sqlStmt);
	}
	dbC.serialize(() => {
		dbC.each(sqlStmt,
			function (err, row) {
				if (err) {
					console.log(myutil.fmtDate() + 'db_query() : Error: ' + err.message);
				}
				rows.push(row);
				if( dbLogBits & LOG_QUERY_ROW ) {
					console.log(myutil.fmtDate() + 'db_query() : ' + JSON.stringify(row));
				}
			},
			function() {
			    callerCb();
			}
		); // dbC.each()
	}); // dbC.serialize
}

function db_queryoc(dbFile, sqlStmt, queryOcCallerCb)
{
	console.log(myutil.fmtDate() + 'db_queryoc() : ' + sqlStmt);

	var opRows = new Array();

	dbC = db_open(dbFile, LOG_OPEN | LOG_QUERY_STMT | LOG_QUERY_ROW);
	db_query(dbC, sqlStmt, opRows,
		() => {
			var err = 0;
			var r = { "rc" : 0, "msg" : "" };

			// no ordering requirement for the below close and send
			db_close(dbC, dbFile);

			if( err ) {
				r["rc"] = 1;
				r["msg"] = err.message;
				console.log(myutil.fmtDate()
					+ 'Error: db_queryoc() of '
					+ sqlStmt + '. '
					+ r.msg + " (rc=" + r.rc + ")");
			}

			// call back
			queryOcCallerCb(r, opRows);
		}
	);
}

function db_run(dbC, sqlStmt, params, runCallerCb)
{
	// @todo delete below line
	// db.run('INSERT INTO users(name, age) VALUES(?, ?)', ['Raiko',29], (err) => {

	if( dbLogBits & LOG_EXEC_STMT ) {
		console.log(myutil.fmtDate() + 'db_exec() : ' + sqlStmt + " params=[" + params + "]");
	}

	dbC.run(sqlStmt, params,
		function (err) {
			if (err) {
				runCallerCb(err);
			} else {
				runCallerCb("");
			}
		}
		); // dbC.run
}


function db_runoc(dbFile, sqlStmt, sqlParams, runocCallerCb)
{
	console.log(myutil.fmtDate() + 'db_runoc() : ' + sqlStmt + " " + sqlParams);

	dbC = db_open(dbFile, LOG_OPEN | LOG_EXEC_STMT);
	db_run(dbC, sqlStmt, sqlParams,
			(err) => {
				var r = { "rc" : 0, "msg" : "" };

				// no ordering requirement for the below close and send
				db_close(dbC, dbFile);

				if( err ) {
					r["rc"] = 1;
					r["msg"] = err.message;
					console.log(myutil.fmtDate()
						+ 'Error: db_runoc() of '
						+ sqlStmt + ' ' + sqlParams + '. '
						+ r.msg + " (rc=" + r.rc + ")");
				}

				// call back
				runocCallerCb(r);
			} // end (err) lambda
	); // end db.run()
}


//  'db' module exports
exports.open           = db_open;
exports.close          = db_close;
exports.exec           = db_run;
exports.execoc         = db_runoc;
exports.query          = db_query;
exports.queryoc        = db_queryoc;

exports.setlog         = db_setlog;
exports.LOG_OPEN       = LOG_OPEN;
exports.LOG_CLOSE      = LOG_CLOSE;
exports.LOG_QUERY_STMT = LOG_QUERY_STMT;
exports.LOG_QUERY_ROW  = LOG_QUERY_ROW;
exports.LOG_EXEC_STMT  = LOG_EXEC_STMT;
