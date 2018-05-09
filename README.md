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
1. Building your first Dataservice
    1. Making an NPM package
    1. Working with ExpressJS
    1. Adding your Dataservice to the App
    1. Issuing a REST request from your App
1. Adding your first Widget
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

© 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
ROCKET SOFTWARE, INC. CONFIDENTIAL
