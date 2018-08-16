
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import { Response, Request } from "express";
import * as table from "./usertable";
import { Router } from "express-serve-static-core";

const express = require('express');
const Promise = require('bluebird');

const MY_VERSION = '0.0.1';
const METADATA_SCHEMA_VERSION = "1.0";
function respondWithRows(rows: Array<Array<string>>, res: Response):void {
  let rowObjects = rows.map(row=> {
    return {
      firstname: row[table.columns.firstname],
      mi: row[table.columns.mi],
      lastname: row[table.columns.lastname],
      email: row[table.columns.email],
      location: row[table.columns.location],
      department: row[table.columns.department]
    }
  });
  
  
  let responseBody = {
    "_docType": "org.openmainframe.zoe.workshop-user-browser.user-table",
    "_metaDataVersion": MY_VERSION,
    "metadata": table.metadata,
    "resultMetaDataSchemaVersion": "1.0",
    "rows":rowObjects
  };     
  res.status(200).json(responseBody);
}

class UserTableDataservice {
  private context: any;
  private router: Router;
  
  constructor(context: any){
    this.context = context;
    let router = express.Router();
    router.use(function noteRequest(req: Request,res: Response,next: any) {
      context.logger.info('Saw request, method='+req.method);
      next();
    });
    router.get('/',function(req: Request,res: Response) {
      respondWithRows(table.rows,res);
    });

    router.get('/:filter/:filterValue',function(req: Request,res: Response) {
      let column = table.columns[req.params.filter];
      if (column===undefined) {
        res.status(400).json({"error":"Invalid filter specified"});
        return;
      }
      let matches = table.rows.filter(row=> row[column] == req.params.filterValue);
      respondWithRows(matches,res);
    });

    this.router = router;
  }

  getRouter():Router{
    return this.router;
  }
  
}

exports.tableRouter = function(context): Router {
  return new Promise(function(resolve, reject) {
    let dataservice = new UserTableDataservice(context);
    resolve(dataservice.getRouter());
  });
}
/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
