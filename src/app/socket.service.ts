import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://dateapi.uiwiz.xyz/'
  private socket:any;

  constructor() { this.socket = io(this.url);}

  public setUser = (data) => {    
    this.socket.emit("set-user", data);
  }

  public newMeeting = (data) => {
    this.socket.emit("new-meeting-notify",data)
  }

  public editMeeting = (data) => {
    this.socket.emit("edit-meeting-notify",data)
  }

  public deleteMeeting = (id) => {
    this.socket.emit("delete-meeting-notify",id)
  }

  public newMeetingNotify = () => {
    return Observable.create((observer) => {
      this.socket.on('new-meeting',data=>{
        observer.next(data)
        console.log(data);
        
      })
    })
  }

  public editMeetingNotify = () => {
    return Observable.create((observer) => {
      this.socket.on('edit-meeting',data=>{
        observer.next(data)
      })
    })
  }

  public deleteMeetingNotify = () => {
    return Observable.create((observer) => {
      this.socket.on('delete-meeting',data=>{
        observer.next(data)
      })
    })
  }

  public alarm = () => {
    return Observable.create((observer) => {
      this.socket.on('alarm',data=>{
        observer.next(data)
      })
    })
  }

  public snooze = (userId) => {
    this.socket.emit('snooze',userId)
  }

  // public snoozeR = (userId) => {
  //   return Observable.create((observer) => {
  //     this.socket.on(`${userId}`,data=>{
  //       observer.next(data)
  //     })
  //   })
  // }

  public disconnect = () => {
    this.socket.disconnect()
  }

}
