import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '../../../node_modules/@angular/router';
import { ToastrService } from '../../../node_modules/ngx-toastr';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public email:any
  show:Boolean = false;
  errors: any;
  constructor(private notify: ToastrService,private appService:AppService,private router:Router) { }

  ngOnInit() {
  }

  public token:any = () => {
    this.show = !this.show;
  }

  public forgotpassword:any = () => {
    if(!this.email) {
      this.notify.warning("Enter email")
    }
    else{
      this.show = true;

      let data = {
        email: this.email
      }
  
      this.appService.forgotpassword(data)
      .subscribe((response) =>{
        if(response.status === 200) {

        }
      },
      error => {
        if(error.status == 400){
         this.errors = error.error.message
        }
        else {
          this.errors = error.error.message
        }
    })
    }

  }

}
