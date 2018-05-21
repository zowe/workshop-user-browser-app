© 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
ROCKET SOFTWARE, INC. CONFIDENTIAL
# User Browser Workshop App

This repository acts as a tutorial, intended as a workshop session, which will teach you how to develop your own Zoe App.
This README contains code snippets and descriptions that you can piece together to complete the App you will need to complete the tutorial.

By the end of this tutorial, you will:
1. Know how to create an App that shows up on the Desktop
1. Know how to create a Dataservice which implements a simple REST API
1. Be introduced to Typescript programming
1. Be introduced to simple Angular web development
1. Have experience in working with the Zoe App framework
1. Become familiar with one of the Zoe App widgets: the grid widget

So, let's get started!

1. [Constructing an App Skeleton](#constructing-an-app-skeleton)
    1. [Defining your first Plugin](#defining-your-first-plugin)
    1. [Constructing a Simple Angular UI](#constructing-a-simple-angular-ui)
    1. [Packaging Your Web App](#packaging-your-web-app)
    1. [Adding Your App to the Desktop](#adding-your-app-to-the-desktop)
1. [Building your First Dataservice](#building-your-first-dataservice)
    1. [Working with ExpressJS](#working-with-expressjs)
    1. [Adding your Dataservice to the Plugin Definition](#adding-your-dataservice-to-the-plugin-definition)
1. [Adding your First Widget](#adding-your-first-widget)
    1. [Adding your Dataservice to the App](#adding-your-dataservice-to-the-app)
    1. [Introducing ZLUX Grid](#introducing-zlux-grid)
1. Adding Zoe App-to-App communication

## Constructing an App Skeleton
If you look within this repository, you'll see that a few boilerplate files already exist to help you get your first App running quickly. The structure of this repository follows the guidelines for Zoe App filesystem layout, which you can read more about [on this wiki](https://github.com/gizafoundation/zlux/wiki/ZLUX-App-filesystem-structure) if you need.

### Defining your first Plugin
So, where do you start when making an App? In the Zoe framework, An App is a Plugin of type Application. Every Plugin is bound by their **pluginDefinition.json** file, which describes what properties it has.
Let's start by creating this file.

Make a file, **pluginDefinition.json**, at the root of the **workshop-user-browser-app** folder.
The file should contain the following:
```
{
  "identifier": "org.openmainframe.zoe.workshop-user-browser",
  "apiVersion": "0.8.1",
  "pluginVersion": "0.0.1",
  "pluginType": "application",
  "webContent": {
    "framework": "angular2",
    "launchDefinition": {
      "pluginShortNameKey": "userBrowser",
      "pluginShortNameDefault": "User Browser",
      "imageSrc": "assets/icon.png"
    },
    "descriptionKey": "userBrowserDescription",
    "descriptionDefault": "Browse Employees in System",
    "isSingleWindowApp": true,
    "defaultWindowStyle": {
      "width": 1300,
      "height": 500
    }
  }
}
```

You might wonder why we chose the particular values that are put into this file. A description of each can again be found [in the wiki](https://github.com/gizafoundation/zlux/wiki/Zlux-Plugin-Definition-&-Structure).

Of the many attributes here, you should be aware of the following:
* Our App has the unique identifier of `org.openmainframe.zoe.workshop-user-browser`, which can be used to refer to it when running Zoe
* The App has a `webContent` attribute, because it will have a UI component visible in a browser.
    * The `webContent` section states that the App's code will conform to Zoe's Angular App structure, due to it stating `"framework": "angular2"`
    * The App has certain characteristics that the user will see, such as:
        * The default window size (`defaultWindowStyle`), 
        * An App icon that we provided in `workshop-user-browser-app/webClient/src/assets/icon.png`, 
        * That we should see it in the browser as an App named `User Browser`, the value of `pluginShortNameDefault`.
        
### Constructing a Simple Angular UI
Angular Apps for Zoe are structured such that the source code exists within `webClient/src/app`. In here, you can create modules, components, templates and services in whatever heirarchy desired. For the App we are making here however, we'll keep it simple by adding just 3 files:
* userbrowser.module.ts
* userbrowser-component.html
* userbrowser-component.ts

At first, let's just build a shell of an App that can display some simple content.
Fill in each file with the following contents.

**userbrowser.module.ts**
```import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserBrowserComponent } from './userbrowser-component';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  declarations: [UserBrowserComponent],
  exports: [UserBrowserComponent],
  entryComponents: [UserBrowserComponent]
})
export class UserBrowserModule { }
```

**userbrowser-component.html**
```
<div class="parent col-11" id="userbrowserPluginUI">
{{simpleText}}
</div>

<div class="userbrowser-spinner-position">
  <i class="fa fa-spinner fa-spin fa-3x" *ngIf="resultNotReady"></i>
</div>
```

**userbrowser-component.ts**
```
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Inject, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

import { Angular2InjectionTokens, Angular2PluginWindowActions, Angular2PluginWindowEvents } from 'pluginlib/inject-resources';

@Component({
  selector: 'userbrowser',
  templateUrl: 'userbrowser-component.html',
  styleUrls: ['userbrowser-component.css']
})

export class UserBrowserComponent implements OnInit, AfterViewInit {
  private simpleText: string;
  private resultNotReady: boolean = false;

  constructor(
    private element: ElementRef,
    @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger,
    @Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition,    
    @Inject(Angular2InjectionTokens.WINDOW_ACTIONS) private windowAction: Angular2PluginWindowActions,
    @Inject(Angular2InjectionTokens.WINDOW_EVENTS) private windowEvents: Angular2PluginWindowEvents
  ) {
    this.log.info(`User Browser constructor called`);
  }

  ngOnInit(): void {
    this.simpleText = `Hello World!`;
    this.log.info(`App has initialized`);
  }

  ngAfterViewInit(): void {

  }

}
```

### Packaging Your Web App

At this time, we've made the source for a Zoe App that should open up in the Desktop with a greeting to the planet.
Before we're ready to use it however, we have to transpile the typescript and package the App. This will require a few build tools first. We'll make an NPM package in order to facilitate this.

Let's create a package.json file within `workshop-user-browser-app/webClient`.
While a package.json can be created through other means such as `npm init` and packages can be added via commands such as `npm install --save-dev typescript@2.8.3`, we'll opt to save time by just pasting these contents in:
```
{
  "name": "workshop-user-browser",
  "version": "0.0.1",
  "scripts": {
    "start": "webpack --progress --colors --watch",
    "build": "webpack --colors",
    "lint": "tslint -c tslint.json \"src/**/*.ts\""
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^4.0.0",
    "@angular/common": "^4.0.0",
    "@angular/compiler": "^4.0.0",
    "@angular/core": "^4.0.0",
    "@angular/forms": "^4.0.0",
    "@angular/http": "^4.0.0",
    "@angular/platform-browser": "^4.0.0",
    "@angular/platform-browser-dynamic": "^4.0.0",
    "@angular/router": "^4.0.0",
    "brace": "^0.10.0",
    "copy-webpack-plugin": "^4.0.1",
    "core-js": "^2.4.1",
    "rxjs": "^5.4.2",
    "webpack-config": "^7.2.1",
    "zone.js": "^0.8.4"
  },
  "devDependencies": {
    "@angular/cli": "1.1.1",
    "@angular/compiler-cli": "^4.0.0",
    "@zlux/grid": "git+ssh://git@github.com:gizafoundation/zlux-grid.git",
    "@zlux/widgets": "git+ssh://git@github.com:gizafoundation/zlux-widgets.git",
    "angular2-template-loader": "^0.6.2",
    "css-loader": "^0.28.4",
    "exports-loader": "^0.7.0",
    "file-loader": "^1.1.11",
    "html-loader": "^0.4.5",
    "json-loader": "^0.5.7",
    "source-map-loader": "^0.2.3",
    "svg-sprite-loader": "^3.7.3",
    "ts-loader": "^2.2.0",
    "ts-node": "~3.0.4",
    "tslint": "~5.3.2",
    "typescript": "^2.8.3",
    "url-loader": "^1.0.1",
    "webpack": "^2.6.1"
  }
}
```

Now we're really ready to build.
Let's set up our system to automatically perform these steps every time we make updates to the App.
1. Open up a command prompt to `workshop-user-browser-app/webClient`
1. Execute `npm run-script start`

OK, after the first execution of the transpilation and packaging concludes, you should have `workshop-user-browser-app/web` populated with files that can be served by the Zoe App Server.

### Adding Your App to the Desktop
At this point, your workshop-user-browser-app folder contains files for an App that could be added to a Zoe instance. We'll at this to our own Zoe instance. First, ensure that the Zoe App server is not running. Then, navigate to the instance's root folder, `/zlux-example-server`.

Within, you'll see a folder, **plugins**. Take a look at one of the files within the folder. You can see that these are JSON files with the attributes **identifier** and **pluginLocation**. These files are what we call **Plugin Locators**, since they point to a Plugin to be included into the server.

Let's make one ourselves. Make a file `/zlux-example-server/plugins/org.openmainframe.zoe.workshop-user-browser.json`, with these contents:
```
{
  "identifier": "org.openmainframe.zoe.workshop-user-browser",
  "pluginLocation": "../../workshop-user-browser"
}
```

When the server runs, it will check for these sorts of files in its `pluginsDir`, a location known to the server via its specification in the [server configuration file](https://github.com/gizafoundation/zlux/wiki/Configuration-for-zLUX-Proxy-Server-&-ZSS#app-configuration). In our case, this is `/zlux-example-server/deploy/instance/ZLUX/plugins/`.

You could place the JSON directly into that location, but the recommended way to place content into the deploy area is via running the server deployment process.
Simply:
1. Open up a (second) command prompt to `zlux-build`
1. `ant deploy`

Now you're ready to run the server and see your App.
1. `cd /zlux-example-server/bin`
1. `./nodeServer.sh`
1. Open your browser to `https://hostname:port`
1. Login with your credentials
1. Open the App on the bottom of the page with the green 'U' icon.

Do you see your Hello World message from [this earlier step?](#constructing-a-simple-angular-ui). If so, you're in good shape! Now, let's add some content to the App.


## Building your First Dataservice
An App can have one or more [Dataservices](https://github.com/gizafoundation/zlux/wiki/ZLUX-Dataservices). A Dataservice is a REST or Websocket endpoint that can be added to the Zoe App Server. 

To demonstrate the use of a Dataservice, we'll add one to this App. The App needs to display a list of users, filtered by some value. Ordinarily, this sort of data would be contained within a database, where you can get rows in bulk and filter them in some manner. Retrieval of database contents, likewise, is a task that is easily representable via a REST API, so let's make one.

1. Create a file, `workshop-user-browser-app/nodeServer/ts/tablehandler.ts`
Add the following contents:

```
import { Response, Request } from "express";
import * as table from "./usertable";
import { Router } from "express-serve-static-core";

const express = require('express');
const Promise = require('bluebird');

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
      res.status(200).json({"greeting":"hello"});
    });    

    this.router = router;
  }

  getRouter():Router{
    return this.router;
  }

exports.tableRouter = function(context): Router {
  return new Promise(function(resolve, reject) {
    let dataservice = new UserTableDataservice(context);
    resolve(dataservice.getRouter());
  });
}
```
This is boilerplate for making a Dataservice. We lightly wrap ExpressJS Routers in a Promise-based structure where we can associate a Router with a particular URL space, which we will see later. If you were to attach this to the server, and do a GET on the root URL associated, you'd receive the {"greeting":"hello"} message.

### Working with ExpressJS
Let's move beyond hello world, and access this user table.

1. Within `workshop-user-browser-app/nodeServer/ts/tablehandler.ts`, add a function for returning the rows of the user table.
```
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

```
Because we reference the usertable file via import, we are able to refer to its **metadata** and **columns** attributes here.
This **`respondWithRows`** function expects an array of rows, so we'll improve the Router to call this function with some rows so that we can present them back to the user.

2. Update the **UserTableDataservice** constructor, modifying and expanding upon the Router
```
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
```
Zoe's use of ExpressJS Routers will allow you to quickly assign functions to HTTP calls such as GET, PUT, POST, DELETE, or even websockets, and provide you will easy parsing and filtering of the HTTP requests so that there is very little involved in making a good API for your users.

This REST API now allows for two GET calls to be made: one to root /, and the other to /*filter*/*value*. The behavior here is as is defined in [ExpressJS documentation](https://expressjs.com/en/guide/routing.html#route-parameters) for routers, where the URL is parameterized to give us arguments that we can feed into our function for filtering the user table rows before giving the result to **respondWithRows** for sending back to the caller.


### Adding your Dataservice to the Plugin Definition
Now that the Dataservice is made, we need to add it to our Plugin's defintion so that the server is aware of it, and build it so that the server can run it.

1. Open up a (third) command prompt to `workshop-user-browser-app/nodeServer`
1. Invoke the NPM build process, `npm run-script start`
    1. If there are any errors, go back to [building the dataservice](#building-your-first-dataservice) and make sure the files look correct.
1. Edit `workshop-user-browser-app/pluginDefinition.json`, adding a new attribute which declares Dataservices.
```
"dataServices": [
    {
      "type": "router",
      "name": "table",
      "serviceLookupMethod": "external",
      "fileName": "tablehandler.js",
      "routerFactory": "tableRouter",
      "dependenciesIncluded": true
    }
],
```
Your full pluginDefinition.json should now be:
```
{
  "identifier": "org.openmainframe.zoe.workshop-user-browser",
  "apiVersion": "0.8.1",
  "pluginVersion": "0.0.1",
  "pluginType": "application",
  "webContent": {
    "framework": "angular2",
    "launchDefinition": {
      "pluginShortNameKey": "userBrowser",
      "pluginShortNameDefault": "User Browser",
      "imageSrc": "assets/icon.png"
    },
    "descriptionKey": "userBrowserDescription",
    "descriptionDefault": "Browse Employees in System",
    "isSingleWindowApp": true,
    "defaultWindowStyle": {
      "width": 1300,
      "height": 500
    }
  },
  "dataServices": [
    {
      "type": "router",
      "name": "table",
      "serviceLookupMethod": "external",
      "fileName": "usertables.js",
      "routerFactory": "tableRouter",
      "dependenciesIncluded": true
    }
  ]
}
```
There's a few interesting attributes about the Dataservice we have specified here. First is that it is listed as `type: router`, which is because there are different types of Dataservices that can be made to suit the need. Second, the **name** is **table**, which determines both the name seen in logs but also the URL this can be accessed at. Finally, **fileName** and **routerFactory** point to the file within `workshop-user-browser-app/lib` where the code can be invoked, and the function that returns the ExpressJS Router, respectively.

4. [Restart the server](#adding-your-app-to-the-desktop) (as was done when adding the App initially) to load this new Dataservice. This is not always needed but done here for educational purposes.
http://wal-l-sg04:12360/ZLUX/plugins/com.rs.mvd/web/index.html
5. Access `https://host:port/ZLUX/plugins/org.openmainframe.zoe.workshop-user-browser/services/table/` to see the Dataservice in action. It should return all the rows in the user table, as you did a GET to the root / URL that we just coded.

## Adding your First Widget
Now that you can get this data from the server's new REST API, we need to make improvements to the web content of the App to visualize this. This means not only calling this API from the App, but presenting it in a way that is easy to read and extract info from.

### Adding your Dataservice to the App
 Let's make some edits to **userbrowser-component.ts**, replacing the **UserBrowserComponent** Class's **ngOnInit** method with a call to get the user table.

```
  ngOnInit(): void {
    this.resultNotReady = true;
    this.log.info(`Calling own dataservice to get user listing for filter=${JSON.stringify(this.filter)}`);
    let uri = this.filter ? RocketMVD.uriBroker.pluginRESTUri(this.pluginDefinition.getBasePlugin(), 'table', `${this.filter.type}/${this.filter.value}`) : RocketMVD.uriBroker.pluginRESTUri(this.pluginDefinition.getBasePlugin(), 'table',null);
    setTimeout(()=> {
    this.log.info(`Sending GET request to ${uri}`);
    this.http.get(uri).map(res=>res.json()).subscribe(
      data=>{
        this.log.info(`Successful GET, data=${JSON.stringify(data)}`);
        this.columnMetaData = data.metadata;
        this.unfilteredRows = data.rows.map(x=>Object.assign({},x));
        this.rows = this.unfilteredRows;
        this.showGrid = true;
        this.resultNotReady = false;
      },
      error=>{
        this.log.warn(`Error from GET. error=${error}`);
        this.error_msg = error;
        this.resultNotReady = false;
      }
    );
    },100);
}
```

You may have noticed that we're referring to several instance variables that we haven't declared yet. Let's add those within the **UserBrowserComponent** Class too, above the constructor.
```
  private showGrid: boolean = false;
  private columnMetaData: any = null;
  private unfilteredRows: any = null;
  private rows: any = null;
  private selectedRows: any[];  
  private query: string;
  private error_msg: any;
  private url: string;
  private filter:any;
```

Hopefully you are still running the command in the first command prompt, `npm run-script start`, which will rebuild your web content for the App whenever you make changes. You may see some errors, which we will clear up by adding the next portion of the App.

### Introducing ZLUX Grid
When **ngOnInit** runs, it will call out to the REST Dataservice and put the table row results into our cache, but we haven't yet visualized this in any way. We need to improve our HTML a bit to do that, and rather than reinvent the wheel, we luckily have a table vizualization library we can rely on - **ZLUX Grid**





© 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
ROCKET SOFTWARE, INC. CONFIDENTIAL
