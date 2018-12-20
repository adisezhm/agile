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
exports.sprintsPidH   = url_sprints_pid;
exports.sprintsPNameH = url_sprints_pname;

var u  = require('./u');
var db = require('./db');

//  entry point for /<projectId>/sprints/(active|backlog|completed)
//
function url_sprints_pid(req, res, urlParts)
{
	var pid        = urlParts[0]; // project Id
	var modulE     = urlParts[1]; // = 'sprints'
	var sStatusVal = urlParts[2];

	console.log('\n' + u.fmtDate() + 'sprints_pid processing : ' + urlParts);

	var sprintsList = new Array();
	var pRows       = new Array();

	//  1. open database
	dbC = db.open();

	//  2. get pName
	sqlQpName = `select pName from project where pid = ${pid}`;
	db.query(dbC, sqlQpName, pRows, () =>
	{
		//  3. get sprints
		sql = `SELECT pid, \'${pRows[0].pName}\' AS pName, sid, pid, sName, sStatus, sDesc FROM sprint where pid = ${pid} and sStatus = \'${sStatusVal}\'`;
		db.query(dbC, sql, sprintsList, () =>
		{
			// 4. no ordering requirement for the below two calls
			db.close(dbC);
			res.send(sprintsList);
		});
	});
}

//  entry point for /<projectName>/sprints/(active|backlog|completed)
//
function url_sprints_pname(req, res, urlParts)
{
	var pName      = urlParts[0]; // project Name
	var modulE     = urlParts[1]; // = 'sprints'
	var sStatusVal = urlParts[2];

	console.log('\n' + u.fmtDate() + 'sprints_name processing : ' + urlParts);

	var sprintsList = new Array();

	sql1 = `(select pid from project where pName = \'${pName}\')`;
	sql  = `SELECT pid, \'${pName}\' AS pName, sid, pid, sName, sStatus, sDesc FROM sprint where pid = ${sql1} and sStatus = \'${sStatusVal}\'`;

	dbC = db.open();
	db.query(dbC, sql, sprintsList, () =>
	{
			// no ordering requirement for the below two calls
			db.close(dbC);
			res.send(sprintsList);
	});
}
