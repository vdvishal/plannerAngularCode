import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { HttpErrorResponse, HttpParams,HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public baseUrl = 'http://dateapi.uiwiz.xyz/api/v1'

  constructor(private http:HttpClient) { }

  public setUserInfoInLocalStorage = (data) =>{
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public login(data): Observable<any> {
    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password);
    return this.http.post(`${this.baseUrl}/users/login`,params)
  }
  
  public signup(data): Observable<any> {
    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password)
    .set('userName', data.username)
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('mobileNumber',data.number)

    return this.http.post(`${this.baseUrl}/users/signup`,params)

  }

  public getAllUsers():Observable<any> {
    return this.http.get(`${this.baseUrl}/users/get/allusers`)
  }

  public createMeeting(data): Observable<any> {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');

    return this.http.post(`${this.baseUrl}/meeting/create`,data,{headers})
  }

  public editMeeting(data): Observable<any> {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/form-data');

    return this.http.post(`${this.baseUrl}/meeting/edit/${data.meetingId}`,data,{headers})
  }

  public getAllMeetings():Observable<any>{
    return this.http.get(`${this.baseUrl}/meeting/allmeetings`)
  }

  public deleteMeeting(id):Observable<any>{
    const params = new HttpParams()
    .set('meetingId', id)
    return this.http.post(`${this.baseUrl}/meeting/delete`,params)
  }

  public logout():any {
    localStorage.removeItem('authToken');
 }

 public forgotpassword(data):any {
  return this.http.post(`${this.baseUrl}/users/resetpassword`,data)
}

public resetpassword(param,data):any {
  return this.http.post(this.baseUrl + '/users/resetpassword/' + param.tokeninfo,data)
}

}
