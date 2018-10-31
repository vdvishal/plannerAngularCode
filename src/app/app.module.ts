import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppService } from './app.service';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { CommonModule } from '../../node_modules/@angular/common';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { SignupLoginPageComponent } from './signup-login-page/signup-login-page.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DashboardNormalComponent } from './dashboard-normal/dashboard-normal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ColorPickerModule } from 'ngx-color-picker';
import { ContextMenuModule } from 'ngx-contextmenu';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RouteGuard } from './route.guard';
import { RouteNGuard } from './route-n.guard';



@NgModule({
  declarations: [
    AppComponent,
    SignupLoginPageComponent,
    DashboardNormalComponent,
    DashboardAdminComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    ColorPickerModule,
    FormsModule,
    CommonModule,
    NgbModule,
    BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    SnotifyModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      {path:'login',component:SignupLoginPageComponent,canActivate:[RouteGuard]},
      {path: '', redirectTo: 'login', pathMatch: 'full' },
      {path:'normal',component:DashboardNormalComponent,canActivate:[RouteNGuard]},
      {path:'admin',component:DashboardAdminComponent,canActivate:[RouteNGuard]},
      {path:'forgotpassword',component:ForgotPasswordComponent},
      {path:'resetpassword/:token',component:ResetPasswordComponent},
    ])
  ],
  providers: [AppService,{ provide: 'SnotifyToastConfig', useValue: ToastDefaults},
  SnotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
