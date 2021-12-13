import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { HttpClientModule } from '@angular/common/http';
import { FilterComponent } from '../app/list/filter/filter.component';
import { PreviewDetailComponent } from '../app/preview-detail/preview-detail.component';
import { OptionsComponent } from './home/options/options.component';
import { UserSessionService } from './providers/user-session.service';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [AppComponent, FilterComponent, PreviewDetailComponent, OptionsComponent],
  entryComponents: [],
  imports: [HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AndroidPermissions, UserSessionService, QRScanner, SocialSharing, Camera, File ],
  bootstrap: [AppComponent],
})
export class AppModule {}
