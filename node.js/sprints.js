//  sprints.js - Agile Sprints module
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

//  'sprints' module exports
exports.sprintsH = url_sprints;

var u  = require('./u');
var db = require('./db');

function sprints(dbC, keyVal, zsList, callerCb)
{
	dbC.serialize(() => {
		dbC.each(`SELECT sName, sStatus, sDesc FROM sprint where sStatus = ?`,
				keyVal,
			function (err, row)
			{
				if (err) {
					console.error(err.message);
				}
				zsList.push(row);
				console.log(u.fmtDate() + 'sprints() row : ' + JSON.stringify(row));
			},
			function() {
			    callerCb();
			}
		); // dbC.each()
	}); // dbC.serialize
}

function sprints_query(keyVal, httpCb)
{
	var sprintsList = new Array();

	dbC = db.open();
	sprints(dbC, keyVal, sprintsList,
			() => {
					// below two, ordering is not a must !
					db.close(dbC);
					httpCb(sprintsList);
				}
			);
}

//============================
//  entry point for /sprints/*
//============================
const url = require('url');

function url_sprints(req, res, sStatusVal)
{
	var urlParts = url.parse(req.url);

	console.log('\n' + u.fmtDate() + 'sprints.js processing : ' + urlParts.pathname);

	sprints_query(sStatusVal,
		function(sprintsList)
		{
			res.send(sprintsList);
		}
	);
}
