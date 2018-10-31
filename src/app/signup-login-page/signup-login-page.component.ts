import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup-login-page',
  templateUrl: './signup-login-page.component.html',
  styleUrls: ['./signup-login-page.component.css']
})
export class SignupLoginPageComponent implements OnInit {
  public email: any;
  public password: any;

  public mail: any;
  public newpassword: any;
  public firstName: String
  public lastName:String
  public number:Number
  public username: String;
  public admin:String;
  public normal:String;
  public suffix:String;

  constructor(
    public router: Router,
    public appService:AppService,
    private notify: ToastrService) { }

  ngOnInit() {
  }


  show = false;

  public adminCheck:any = () => {
    if(this.admin == 'admin'){
      this.suffix = '-admin'
    }
    else{
      this.suffix = ''
    }
  }

  public token:any = () => {
    this.show = !this.show;
  }

  public login:any = () => {
    if(!this.email) {
      this.notify.warning("enter email")
    }
    else if(!this.password) {
      this.notify.warning("enter password")
    }
    else {
      let data = {
        email: this.email,
        password: this.password
      }
      this.appService.login(data)
      .subscribe((response) => {
        if (response.error.status === 400){
          this.notify.error(response.error.message)
        }
        else if(response.status === 200) {
            localStorage.setItem('authToken',response.data.token)
            this.appService.setUserInfoInLocalStorage(response.data.userDetails)
            if(response.data.userDetails.userName.includes("-admin")){
              this.router.navigate(['/admin']);
            }else{
              this.router.navigate(['/normal']);
            }
        }
        else {
          this.notify.error(response.message)
        }
      },
      error => {
       if(error.status == 400){
        this.notify.error(error.error.message);
       }
       else {
        this.notify.error(error.error.message);
       }
   }
  )
}

}
  public signup:any = () => {
    this.adminCheck()
    let data :any = {
      email: this.mail,
      username:`${this.username}${this.suffix}`,
      password:this.newpassword,
      firstName:this.firstName,
      lastName:this.lastName,
      number:this.number
    }
    console.log(data);
    
    this.appService.signup(data)
    .subscribe((response) => {
      if(response.status === 200) {
        this.router.navigate(['/login']);
        this.notify.success("success");  
        this.token();    
}
else {
  this.notify.warning(response.message)
}
})
  }
  
}

