import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';

import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
  ) {
    this.platform.ready().then((_) => {
      this.platform.backButton.subscribeWithPriority(0, () => {
        if (!this.routerOutlet.canGoBack()) {
          App.exitApp();
        }
      });
    });
  }
}
