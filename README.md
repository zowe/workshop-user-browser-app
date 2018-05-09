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
    1. Adding your App to the Desktop
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

© 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
ROCKET SOFTWARE, INC. CONFIDENTIAL
