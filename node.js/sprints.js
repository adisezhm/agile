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

function sprints(dbC, pid, sStatusVal, zsList, callerCb)
{
	dbC.serialize(() => {
		dbC.each(`SELECT sid, pid, sName, sStatus, sDesc FROM sprint where pid = ? and sStatus = ?`,
				pid, sStatusVal,
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

//======================================
//  entry point for /projectId/sprints/(active|backlog|completed)
//======================================

function url_sprints(req, res, urlParts)
{
	var pid        = urlParts[0];
	var modulE     = urlParts[1]; // = 'sprints'
	var sStatusVal = urlParts[2];

	console.log('\n' + u.fmtDate() + 'sprints.js processing : ' + urlParts);

	var sprintsList = new Array();

	dbC = db.open();
	sprints(dbC, pid, sStatusVal, sprintsList,
			() => {
					// no ordering requirement for the below two calls
					db.close(dbC);
					res.send(sprintsList);
				}
			);
}
