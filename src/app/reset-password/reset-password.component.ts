import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public tokeninfo:any;
  passInfo: any;
  mail: any;
  constructor(private notify: ToastrService,private appService:AppService,private router:Router,private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.tokeninfo = this.activatedRoute.snapshot.paramMap.get("token")
  }
  
  public newPassword:any = () => {
    if(!this.mail){
      this.notify.warning("Enter email")
    }
    else if (!this.passInfo) {
      this.notify.warning("Enter new password")
    }
    else{
      let data = {
        email: this.mail,
        password: this.passInfo
      }
  
      let param = {
        tokeninfo: this.tokeninfo
      }
  
      
      this.appService.resetpassword(param,data)
      .subscribe((response) =>{
        if(response.status === 200) {
          this.router.navigate(['/login'])
          this.notify.success(response.message)
        }
      })
    }

  }

}
