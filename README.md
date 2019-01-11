This program and the accompanying materials are
made available under the terms of the Eclipse Public License v2.0 which accompanies
this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

SPDX-License-Identifier: EPL-2.0

Copyright Contributors to the Zowe Project.
# User Browser Workshop App

This repository acts as a tutorial, intended as a workshop session, which will teach you how to develop your own Zowe App.
This README contains code snippets and descriptions that you can piece together to complete the App you will need to complete the tutorial.

By the end of this tutorial, you will:
1. Know how to create an App that shows up on the Desktop
1. Know how to create a Dataservice which implements a simple REST API
1. Be introduced to Typescript programming
1. Be introduced to simple Angular web development
1. Have experience in working with the Zowe App framework
1. Become familiar with one of the Zowe App widgets: the grid widget

**Note: This tutorial assumes you already have a Zowe installation ready to be run. If you do not, try setting one up via the README at [zlux-app-server](https://github.com/zowe/zlux-app-server) before continuing.**

So, let's get started!

1. [Constructing an App Skeleton](#constructing-an-app-skeleton)
    1. [Defining your first Plugin](#defining-your-first-plugin)
    1. [Constructing a Simple Angular UI](#constructing-a-simple-angular-ui)
    1. [Packaging Your Web App](#packaging-your-web-app)
1. [Adding your First Widget](#adding-your-first-widget)
    1. [Adding your Dataservice to the App](#adding-your-dataservice-to-the-app)
    1. [Introducing ZLUX Grid](#introducing-zlux-grid)
1. [Adding Zowe App-to-App Communication](#adding-zowe-app-to-app-communication)
    1. [Calling back to the Starter App](#calling-back-to-the-starter-app)

## Constructing an App Skeleton
If you look within this repository, you'll see that a few boilerplate files already exist to help you get your first App running quickly. The structure of this repository follows the guidelines for Zowe App filesystem layout, which you can read more about [on this wiki](https://github.com/zowe/zlux/wiki/ZLUX-App-filesystem-structure) if you need.

### Defining your first Plugin
So, where do you start when making an App? In the Zowe framework, An App is a Plugin of type Application. Every Plugin is bound by their **pluginDefinition.json** file, which describes what properties it has. For convenience, this file has already been made, and you can take a look at it within `workshop-user-browser-app`.

You might wonder why we chose the particular values that are put into this file. A description of each can again be found [in the wiki](https://github.com/zowe/zlux/wiki/Zlux-Plugin-Definition-&-Structure).

Of the many attributes here, you should be aware of the following:
* Our App has the unique identifier of `org.openmainframe.zowe.workshop-user-browser`, which can be used to refer to it when running Zowe
* The App has a `webContent` attribute, because it will have a UI component visible in a browser.
    * The `webContent` section states that the App's code will conform to Zowe's Angular App structure, due to it stating `"framework": "angular2"`
    * The App has certain characteristics that the user will see, such as:
        * The default window size (`defaultWindowStyle`), 
        * An App icon that we provided in `workshop-user-browser-app/webClient/src/assets/icon.png`, 
        * That we should see it in the browser as an App named `User Browser`, the value of `pluginShortNameDefault`.
        
### Constructing a Simple Angular UI
Angular Apps for Zowe are structured such that the source code exists within `webClient/src/app`. In here, you can create modules, components, templates and services in whatever heirarchy desired. For the App we are making, we start with some simple files to accomplish a hello world of sorts.

### Packaging Your Web App
At this time, we've have the source for a Zowe App that should open up in the Desktop with a greeting to the planet.
Before we're ready to use it however, we have to transpile the typescript and package the App. This will require a few build tools first, which we already have defined in the **package.json** file within `workshop-user-browser-app/webClient`.

Let's set up our system to automatically perform build steps every time we make updates to the App.
1. Edit `workshop-user-browser-app/webClient/package.json` to add `"webpack-cli": "~3.0.0",` in the `devDependencies` object.
1. Open up a command prompt to `workshop-user-browser-app/webClient`
1. Execute `npm install`
1. Execute `npm run-script start`

OK, after the first execution of the transpilation and packaging concludes, you should have `workshop-user-browser-app/web` populated with files that can be served by the Zowe App Server.

Now you're ready to run the server and see your App. If the server is not already running, you can start it via the following:
1. `cd /zlux-app-server/bin`
1. `nodeServer.bat -h rs01.rocketsoftware.com -P 12360` or `./nodeServer.sh` for unix.
1. Open your browser to `http://localhost:8543` or `https://hostname:port` generally speaking.
1. Login with your credentials
1. Open the App on the bottom of the page with the green 'U' icon.

Do you see your Hello World message? If so, you're in good shape! Now, let's add some content to the App.

## Adding your First Widget
Now that you can get this data from the server's new REST API, we need to make improvements to the web content of the App to visualize this. This means not only calling this API from the App, but presenting it in a way that is easy to read and extract info from.

First, edit `workshop-user-browser-app/webClient/package.json` to add or edit the entries for `zlux-grid` and `zlux-widgets` as follows:
```
    "@zlux/grid": "git+https://github.com/zowe/zlux-grid.git",
    "@zlux/widgets": "git+https://github.com/zowe/zlux-widgets.git",
```

Afterwards, you can run `npm install` in that directory once more in order to pull these widget libraries in for use.

### Adding your Dataservice to the App
 Let's make some edits to **userbrowser-component.ts**, replacing the **UserBrowserComponent** Class's **ngOnInit** method with a call to get the user table, and defining ngAfterViewInit:

```typescript
  ngOnInit(): void {
    this.resultNotReady = true;
    this.log.info(`Calling own dataservice to get user listing for filter=${JSON.stringify(this.filter)}`);
    let uri = this.filter ? ZoweZLUX.uriBroker.pluginRESTUri(this.pluginDefinition.getBasePlugin(), 'table', `${this.filter.type}/${this.filter.value}`) : ZoweZLUX.uriBroker.pluginRESTUri(this.pluginDefinition.getBasePlugin(), 'table',null);
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

  ngAfterViewInit(): void {
    // the flex table div is not on the dom at this point
    // have to calculate the height for the table by subtracting all
    // the height of all fixed items from their container
    let fixedElems = this.element.nativeElement.querySelectorAll('div.include-in-calculation');
    let height = 0;
    fixedElems.forEach(function (elem, i) {
      height += elem.clientHeight;
    });
    this.windowEvents.resized.subscribe(() => {
      if (this.grid) {
        this.grid.updateRowsPerPage();
      }
    });
  }
```

You may have noticed that we're referring to several instance variables that we haven't declared yet. Let's add those within the **UserBrowserComponent** Class too, above the constructor.
```typescript
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

If you inspect `package.json` in the **webClient** folder, you'll see that we've already included @zlux/grid as a dependency - as a link to one of the Zowe github repositories, so it should have been pulled into the **node_modules** folder during the `npm install` operation. We just need to include it in the Angular code to make use of it. This comes in two steps:

1. Edit **webClient/src/app/userbrowser.module.ts**, adding import statements for the zlux widgets above and within the @NgModule statement:
```typescript
import { ZluxGridModule } from '@zlux/grid';
import { ZluxPopupWindowModule, ZluxButtonModule } from '@zlux/widgets'
//...
@NgModule({
imports: [FormsModule, HttpModule, ReactiveFormsModule, CommonModule, ZluxGridModule, ZluxPopupWindowModule, ZluxButtonModule],
//...
```

The full file should now be:
```typescript
*
  This Angular module definition will pull all of your Angular files together to form a coherent App
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ZluxGridModule } from '@zlux/grid';
import { ZluxPopupWindowModule, ZluxButtonModule } from '@zlux/widgets'

import { UserBrowserComponent } from './userbrowser-component';

@NgModule({
  imports: [FormsModule, HttpModule, ReactiveFormsModule, CommonModule, ZluxGridModule, ZluxPopupWindowModule, ZluxButtonModule],
  declarations: [UserBrowserComponent],
  exports: [UserBrowserComponent],
  entryComponents: [UserBrowserComponent]
})
export class UserBrowserModule { }
```

2. Edit **userbrowser-component.html** within the same folder. Previously, it was just meant for presenting a Hello World message, so we should add some style to accomodate the zlux-grid element we will also add to this template via a tag.
```html
<!-- In this HTML file, an Angular Template should be placed that will work together with your Angular Component to make a dynamic, modern UI -->

<div class="parent col-11" id="userbrowserPluginUI">
  <div class="fixed-height-child include-in-calculation">
      <button type="button" class="wide-button btn btn-default" value="Send">
        Submit Selected Users
      </button>
  </div>
  <div class="fixed-height-child height-40" *ngIf="!showGrid && !viewConfig">
    <div class="">
      <p class="alert-danger">{{error_msg}}</p>
    </div>
  </div>
  <div class="container variable-height-child" *ngIf="showGrid">
    <zlux-grid [columns]="columnMetaData | zluxTableMetadataToColumns"
    [rows]="rows"
    [paginator]="true"
    selectionMode="multiple"
    selectionWay="checkbox"
    [scrollableHorizontal]="true"
    (selectionChange)="onTableSelectionChange($event)"
    #grid></zlux-grid>
  </div>
  <div class="fixed-height-child include-in-calculation" style="height: 20px; order: 3"></div>
</div>

<div class="userbrowser-spinner-position">
  <i class="fa fa-spinner fa-spin fa-3x" *ngIf="resultNotReady"></i>
</div>
```

Note the key functions of this template: 
* There's a button which when clicked will submit selected users (from the grid). We will implement this ability later.
* We show or hide the grid based on a variable `ngIf="showGrid"` so that we can wait to show the grid until there is data to present
* The zlux-grid tag pulls the ZLUX Grid widget into our App, and it has many variables that can be set for visualization, as well as functions and modes.
    * We allow the columns, rows, and metadata to be set dynamically by using the square bracket [ ] template syntax, and allow our code to be informed when the user selection of rows changes via `(selectionChange)="onTableSelectionChange($event)"`
    
3. Small modification to **userbrowser-component.ts** to add the grid variable, and set up the aforementioned table selection event listener, both within the **UserBrowserComponent** Class:
```
@ViewChild('grid') grid; //above the constructor

onTableSelectionChange(rows: any[]):void{
    this.selectedRows = rows;
}
```

The previous section, [Adding your Dataservice to the App](#adding-your-dataservice-to-the-app) set the variables that are fed into the ZLUX Grid widget, so at this point the App should be updated with the ability to present a list of users in a grid.

If you are still running `npm run-script start` in a command prompt, it should now show that the App has been successfully built, and that means we are ready to see the results. Reload your browser's webpage and open the user browser App once more... Do you see the list of users in columns and rows that can be sorted and selected? If so, great, you've built a simple yet useful App within Zowe! Let's move on to the last portion of the App workshop where we hook the Starter App and the User Browser App together to accomplish a task.


## Adding Zowe App-to-App Communication
Apps in Zowe can be useful and provide insight all by themselves, but a big part of using the Zowe Desktop is that Apps are able to keep track of and share context by user interaction in order to accomplish a complex task by simple and intuitive means by having the foreground App request an App best suited for a task to accomplish that task with some context as to the data & purpose.

In the case of this Workshop, we're trying to not just find a list of employees in a company (as was accomplished in the last step where the Grid was added and populated with the REST API), but to filter that list to find those employees who are best suited to the task we need done. So, our user browser App needs to be enhanced with two new abilities:
* Filter the user list to show only those users that meet the filter
* Send the subset of users selected in the list back to the App that requested a user list.

How do we do either task? App-to-App communication! Apps can communicate with other Apps in a few ways, but can be categorized into two interaction groups:
1. Launching an App with a context of what it should do
1. Messaging an App that's already open to request or alert it of something

In either case, the App framework provides Actions as the objects to perform the communication. Actions not only define what form of communication should happen, but between which Apps. Actions are issued from one App, and are fulfilled by a target App. But, because there may be more than one instance/window of an App open, there are Target Modes:
* Open a new App window, where the message context is delivered in the form of a Launch Context
* Message a particular, or any of the currently open instances of the target App

We've already done the work of setting up the App's HTML and Angular definitions, so in order to make our App compatible with App-to-App communication, it only needs to listen for, act upon, and issue Zowe App Actions. Let's make edits to the typescript component to do that. Edit the **UserBrowserComponent** Class's constructor within **userbrowser-component.ts** in order to listen for the launch context:

```typescript
  constructor(
    private element: ElementRef,
    private http: Http,
    @Inject(Angular2InjectionTokens.LOGGER) private log: ZLUX.ComponentLogger,
    @Inject(Angular2InjectionTokens.PLUGIN_DEFINITION) private pluginDefinition: ZLUX.ContainerPluginDefinition,    
    @Inject(Angular2InjectionTokens.WINDOW_ACTIONS) private windowAction: Angular2PluginWindowActions,
    @Inject(Angular2InjectionTokens.WINDOW_EVENTS) private windowEvents: Angular2PluginWindowEvents,
    //Now, if this is not null, we're provided with some context of what to do on launch.
    @Inject(Angular2InjectionTokens.LAUNCH_METADATA) private launchMetadata: any,
  ) {
    this.log.info(`User Browser constructor called`);
    
    //NOW: if provided with some startup context, act upon it... otherwise just load all.
    //Step: after making the grid... we add this to show that we can instruct an app to narrow its scope on open
    this.log.info(`Launch metadata provided=${JSON.stringify(launchMetadata)}`);
    if (launchMetadata != null && launchMetadata.data) {
    /* The message will always be an Object, but format can be specific. The format we are using here is in the Starter App: 
      https://github.com/zowe/workshop-starter-app/blob/master/webClient/src/app/workshopstarter-component.ts#L177
    */    
      switch (launchMetadata.data.type) {
      case 'load':
        if (launchMetadata.data.filter) {
          this.filter = launchMetadata.data.filter;
        }
        break;
      default:
        this.log.warn(`Unknown launchMetadata type`);
      }
    } else {
      this.log.info(`Skipping launching in a context due to missing or malformed launchMetadata object`);
    }
}

```

Then, add a new method on the Class, **provideZLUXDispatcherCallbacks**, which is a web-framework-independent way to allow the Zowe Apps to register for event listening of Actions.

```typescript
  /* 
  I expect a JSON here, but the format can be specific depending on the Action - see the Starter App to see the format that is sent for the Workshop: 
  https://github.com/zowe/workshop-starter-app/blob/master/webClient/src/app/workshopstarter-component.ts#L225
  */
  zluxOnMessage(eventContext: any): Promise<any> {
    return new Promise((resolve,reject)=> {
      if (!eventContext || !eventContext.data) {
        return reject('Event context missing or malformed');
      }
      switch (eventContext.data.type) {
      case 'filter':
        let filterParms = eventContext.data.parameters;
        this.log.info(`Messaged to filter table by column=${filterParms.column}, value=${filterParms.value}`);

        for (let i = 0; i < this.columnMetaData.columnMetaData.length; i++) {
          if (this.columnMetaData.columnMetaData[i].columnIdentifier == filterParms.column) {
            //ensure it is a valid column
            this.rows = this.unfilteredRows.filter((row)=> {
              if (row[filterParms.column]===filterParms.value) {
                return true;
              } else {
                return false;
              }
            });           
            break;
          }
        }
        resolve();
        break;
      default:
        reject('Event context missing or unknown data.type');
      };
    });    
  }


  provideZLUXDispatcherCallbacks(): ZLUX.ApplicationCallbacks {
    return {
      onMessage: (eventContext: any): Promise<any> => {
        return this.zluxOnMessage(eventContext);
      }      
    }
}

```


At this point, the App should build successfully and upon reloading the Zowe page in your browser, you should see that if you open the Starter App (App with the green S), that clicking the "Find Users from Lookup Directory" button should open up the User Browser App with a smaller, filtered list of employees rather than the unfiltered list we see if opening the App manually.
We can also see that once this App has been opened, the Starter App's button, "Filter Results to Those Nearby", becomes enabled and we can click that to see the open User Browser App's listing become filtered even more, this time using the browsers [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation) to instruct the User Browser App to filter to those employees who are closest to you!

### Calling back to the Starter App
We're close to finished now - the App can vizualize data from a REST API, and can be instructed by other Apps to filter that data according to the situation. But, in order to complete this workshop, we need the App communication to go in the other direction - inform the Starter App which employees you have chosen in the table!

This time, we will edit **provideZLUXDispatcherCallbacks** to issue Actions rather than to listen for them. We need to target the Starter App, since it is the App that expects to receive a message about which employees should be assigned a task. If that App is given an employee listing that contains employees with the wrong job titles, the operation will be rejected as invalid, so we can ensure that we get the right result through a combination of filtering and sending a subset of the filtered users back to the starter App.

Add a private instance variable to the **UserBrowserComponent** Class.
```typescript
 private submitSelectionAction: ZLUX.Action; 
```

Then, create the Action template within the constructor
```typescript
    this.submitSelectionAction = ZoweZLUX.dispatcher.makeAction(
      "org.openmainframe.zowe.workshop-user-browser.actions.submitselections",      
      "Sorts user table in App which has it",
      ZoweZLUX.dispatcher.constants.ActionTargetMode.PluginFindAnyOrCreate,
      ZoweZLUX.dispatcher.constants.ActionType.Message,
      "org.openmainframe.zowe.workshop-starter",
      {data: {op:'deref',source:'event',path:['data']}}
);
```

So, we've made an Action which targets an open window of the Starter App, and provides it with an Object with a data attribute.
We'll populate this object for the message to send to the App by getting the results from ZLUX Grid (`this.selectedRows` will be populated from `this.onTableSelectionChange`).

For the final change to this file, add a new method to the Class:
```typescript
  submitSelectedUsers() {
    let plugin = ZoweZLUX.PluginManager.getPlugin("org.openmainframe.zowe.workshop-starter");
    if (!plugin) {
      this.log.warn(`Cannot request Workshop Starter App... It was not in the current environment!`);
      return;
    }

    ZoweZLUX.dispatcher.invokeAction(this.submitSelectionAction,
      {'data':{
         'type':'loadusers',
         'value':this.selectedRows
      }}
    );
}
```

And we'll invoke this via a button click action, which we will add into the Angular template, **userbrowser-component.html**, by changing the button tag for "Submit Selected Users" to:
```html
<button type="button" class="wide-button btn btn-default" (click)="submitSelectedUsers()" value="Send">
```

Check that the App builds successfully, and if so, you've built the App for the workshop! Try it out:

1. Open the Starter App
1. Click the "Find Users from Lookup Directory" button
    1. You should see a filtered list of users in your user App
1. Click the "Filter Results to Those Nearby" button on the Starter App
    1. You should now see the list be filtered further to include only one geography.
1. Select some users to send back to the Starter App
1. Click the "Submit Selected Users" button on the User Browser App
    1. The Starter App should print a confirmation message indicating success
    
And that's it! Looking back at the beginning of this document, you should notice that we've covered all aspects of App building - REST APIs, persistent settings storage, Creating Angular Apps and using Widgets within them, as well as having one App communicate with another. Hopefully you have learned a lot about App building from this experience, but if you have questions or want to learn more, please reach out to those in the Zowe Foundation so that we can assist.


This program and the accompanying materials are
made available under the terms of the Eclipse Public License v2.0 which accompanies
this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

SPDX-License-Identifier: EPL-2.0

Copyright Contributors to the Zowe Project.
