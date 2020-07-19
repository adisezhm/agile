//  projects.js - Agile Projects module
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

//  'projects' module exports
exports.list = projects_list;

var u  = require('./util');
var db = require('./db');

function projectsList(zsList, callerCb)
{
	dbC.serialize(() => {
		dbC.each(`SELECT pid, pName, pStatus, pDesc FROM project`,
			function (err, row)
			{
				if (err) {
					console.error(err.message);
				}
				zsList.push(row);
				console.log(u.fmtDate() + 'projectsList() row : ' + JSON.stringify(row));
			},
			function() {
			    callerCb();
			}
		); // dbC.each()
	}); // dbC.serialize
}

function getProjectId(projectName, pid, callerCb)
{
	dbC.serialize(() => {
		dbC.each_sync(`SELECT pid FROM project where pName = ?`,
			projectName,
			function (err, row)
			{
				if (err) {
					console.error(err.message);
				}
				pid = row.pid;
			},
			function() {
			    callerCb();
			}
		); // dbC.each()
	}); // dbC.serialize
}

//=========================
//  entry point for /p/list
//=========================

function projects_list(req, res, urlParts)
{
	var modulE  = urlParts[0]; // = 'p'
	var cmd     = urlParts[1]; // eg list

	console.log('\n' + u.fmtDate() + 'projects.js processing : ' + urlParts);

	var projectsArray = new Array();

	dbC = db.open('../agile.db');
	if( cmd == "list" ) {
		projectsList(projectsArray,
			() => {
					// no ordering requirement for the below two calls
					db.close(dbC);
					res.send(projectsArray);
				}
			);
	}
}

//=========================
//  entry point for /projects/add
//=========================

// insert into ${pTbl} (did, pid, pName, pDesc, pAssignee, pStart, pEnd, pStatus) values (${did}, ${pid}, '${pName}', '${pDesc}', '${pAssignee}', '${pStart}', '${pEnd}', '${pStatus}')"
//
//
// insert into project (did, pid, pName, pDesc, pAssignee, pStart, pEnd, pStatus) values (${did}, ${pid}, '${pName}', '${pDesc}', '${pAssignee}', '${pStart}', '${pEnd}', '${pStatus}')"

function projects_add(req, res, urlParts)
{
	var modulE  = urlParts[0]; // = 'projects'
	var cmd     = urlParts[1]; // = 'add'

	console.log('\n' + u.fmtDate() + 'projects.js processing : ' + modulE + '/' + cmd);

	dbC = db.open('../agile.db');

	projectsAdd(projectsArray,
			() => {
				// no ordering requirement for the below two calls
				db.close(dbC);
				res.send(projectsArray);
			}
		);
}
