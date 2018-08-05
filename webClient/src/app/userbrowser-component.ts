import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Inject, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response} from '@angular/http';
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
    private http: Http,
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