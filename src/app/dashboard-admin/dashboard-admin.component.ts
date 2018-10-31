import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
import { CalendarEvent,
  CalendarEventAction, CalendarView } from 'angular-calendar';
import { isSameMonth, isSameDay, isThisSecond } from 'date-fns';
import { Subject, Observable } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from '../socket.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css',
]
})
export class DashboardAdminComponent implements OnInit {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  
  viewDate: Date = new Date();

  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject();

  modalData: {
    event: CalendarEvent;
  };


  public username: String
  public title: String
  public dateTimeStart: Date;
  public dateTimeEnd: Date;
  public meetings: CalendarEvent[];
  public color:any;
  public editEnd: Date;
  public editStart: Date;
  public editTitle: any;
  public meetingInfo:any;
  public allUsers:any;
  private token: string;
  userInfo: any;
  venue: any;

  constructor(public router: Router,
    public appService:AppService,
    public socketService:SocketService,
    public notify: ToastrService,
    public modal: NgbModal,config: NgbModalConfig,
    private el: ElementRef) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }

  ngOnInit() {
    this.allMeetings(),
    this.getAllUsers(),
    this.token = localStorage.getItem('authToken')
    this.setUser();
    this.meetingNotification();
    this.editMeetingNotification();
    this.deleteMeetingNotification();
    this.userInfo = this.appService.getUserInfoFromLocalstorage()
  }

  public editevent:Boolean=false;

  public showedit:any = () => {
      this.editevent=true;
      this.getMeetingInfo();
  }
  public hideedit:any = () => {
    if(this.editevent){
      this.editevent=false
    }
  }

  public createMeeting:any = () => {
    if(!this.title) {
      this.notify.warning("enter title")
    }
    else{
      let data = {
        title: this.title,
        venue:this.venue,
        username: this.userInfo.userName,
        dateTimeStart:this.dateTimeStart,
        dateTimeEnd:this.dateTimeEnd,
        color:{
          primary:this.color,
          secondary:this.color}
      }
      this.appService.createMeeting(data)
      .subscribe((response) => {
        if(response.status === 200) {
          this.notify.success("Meeting scheduled and notified Succesfully");     
          this.allMeetings()
          this.modal.dismissAll()
          this.socketService.newMeeting(data)
        }
  else {
    this.notify.warning(response.message)
  }
  })
  }
  }

  public getMeetingInfo:any = () => {
    this.meetingInfo = JSON.parse(localStorage.getItem('meetingInfo'))
  }


  public getuserInfo:any = () => {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
  }
  
  public editMeeting:any = () => {
    if(this.meetingInfo.userName === this.userInfo.userName){
      let data = {
        meetingId:this.meetingInfo.meetingId,
        venue:this.venue,
        title: this.editTitle,
        start:this.editStart,
        end:this.editEnd,
        color:{
          primary:this.color,
          secondary:this.color}
      }
      this.appService.editMeeting(data)
      .subscribe((response) => {
        if(response.status === 200) {
          this.notify.success("Meeting scheduled changed and notified Succesfully");     
          this.allMeetings()
          this.socketService.editMeeting(data)
          this.modal.dismissAll()
          this.editevent=false
        }
else {
  this.notify.warning(response.message)
}
})
    }
    else{
      this.notify.warning('Not authorized to change schedule')
    }
  }

  public allMeetings:any = () => {
    this.appService.getAllMeetings().subscribe((response)=>{
      if(response.status===200){
        this.meetings = response.data
        for(var i in response.data){
          this.meetings[i].start = new Date(response.data[i].start)
          this.meetings[i].end = new Date(response.data[i].end)
        }  
      }
      else{
        this.meetings = response.data
        this.notify.warning(response.message)
      }
    })
  }

  public deleteMeeting:any = (id) => {
    if(this.meetingInfo.userName === this.userInfo.userName){
    this.appService.deleteMeeting(id).subscribe((response)=>{
      if(response.status===200){
        this.allMeetings();
        this.modal.dismissAll();
        this.socketService.deleteMeeting(id)
        this.activeDayIsOpen = false;
      }
      else{
        this.notify.warning("Some error occoured")
      }
    })
  }
  else{
    this.notify.warning('Not authorized to change schedule')
  }

}


public deleteMeetingNotification = () => {
  this.socketService.deleteMeetingNotify().subscribe(
    data =>{
      this.allMeetings();
    }
  )
}


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;

      } else {
        this.activeDayIsOpen = true;

      }
    }
  }

  handleEvent(event: CalendarEvent): void {
    this.modalData = {event};
    this.modal.open(this.modalContent, { size: 'lg' }); 
    localStorage.setItem('meetingInfo',JSON.stringify(event))
    this.getMeetingInfo()   
  }

  public getAllUsers:any = () => {
    this.appService.getAllUsers().subscribe((response)=>{
      if(response.status === 200 ){
        this.allUsers = response.data 
      }
      else{
        this.notify.warning(response.message)
      }
    })
  }

  // public showUser:any = (id) => {
  //   console.log(id);
  // }

  public setUser = () => {
    this.socketService.setUser(this.token);
  }

  public meetingNotification = () => {
    this.socketService.newMeetingNotify().subscribe(
      data =>{
        let date = moment(data.dateTimeStart)
        let formatDate = date.format('dddd, MMMM Do YYYY, h:mm:ss a')
        this.notify.info(`A new meeting has been scheduled on ${formatDate}`)
        this.allMeetings();
      }
    )
  }

  public editMeetingNotification = () => {
    this.socketService.editMeetingNotify().subscribe(
      data =>{
        let date = moment(data.dateTimeStart)
        let formatDate = date.format('dddd, MMMM Do YYYY, h:mm:ss a')
        this.notify.info(`A meeting has been rescheduled to ${formatDate}`)
        this.allMeetings();

      }
    )
  }

  public logout: any = () => {
    this.appService.logout();
    this.socketService.disconnect();
    this.router.navigate(['/login'])
    this.notify.success("Logged out successfully")
  }

}
