// Our top-level JS file
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
// start the app
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
