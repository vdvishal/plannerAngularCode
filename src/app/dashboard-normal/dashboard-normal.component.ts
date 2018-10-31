import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent,
  CalendarEventAction, CalendarView } from 'angular-calendar';
import { isSameMonth, isSameDay } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Rgba } from 'ngx-color-picker';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../socket.service';
import {SnotifyService,SnotifyPosition, SnotifyToastConfig} from 'ng-snotify';
import { timeout } from 'q';
import { log } from 'util';
import * as moment from 'moment';


@Component({
  selector: 'app-dashboard-normal',
  templateUrl: './dashboard-normal.component.html',
  styleUrls: ['./dashboard-normal.component.css']
})

export class DashboardNormalComponent implements OnInit {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  
  activeDayIsOpen: boolean = false;

  public meetings: CalendarEvent[] = [];

  modalData: {
    event: CalendarEvent;
  };
  token: string;
  position: SnotifyPosition = SnotifyPosition.centerCenter
  userInfo: any;
    

  constructor(public modal: NgbModal,
    public router: Router,
    public notify: ToastrService,
    public socketService: SocketService,
    public appService:AppService,
    private snotifyService: SnotifyService) { }
      
  ngOnInit() {
      this.allMeetings();
      this.token = localStorage.getItem('authToken')
      this.userInfo = this.appService.getUserInfoFromLocalstorage();
      this.setUser();
      this.meetingNotification();
      this.editMeetingNotification();
      this.deleteMeetingNotification();
      this.alarm();
      this.setDefault()
    }

    public setUser = () => {
      this.socketService.setUser(this.token);
    }

    public setDefault():SnotifyToastConfig{
      this.snotifyService.setDefaults({
        global: {
          
        }
      });
      return {
        position: this.position,
        timeout:0
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


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  handleEvent(event: CalendarEvent): void {
    this.modalData = { event};
    this.modal.open(this.modalContent, { size: 'lg' });
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
        let date = moment(data.start)
        let formatDate = date.format('dddd, MMMM Do YYYY, h:mm:ss a')
        this.notify.info(`A meeting has been rescheduled to ${formatDate}`)
        this.allMeetings();
      }
    )
  }

  public deleteMeetingNotification = () => {
    this.socketService.deleteMeetingNotify().subscribe(
      data =>{
        this.allMeetings();
      }
    )
  }

  public alarm = () => {
    this.socketService.alarm().subscribe(
      data => {
        this.snotifyService.confirm("Meeting starting soon.", {
          position:this.position ,
          buttons: [
            {text: 'Dismiss'},
          {text: 'Snooze', action: (toast) => {this.snooze(),this.snotifyService.remove(toast.id)} },
          ]
        });
      }
    )
  }

  public snooze = () => {
    setTimeout(()=>{this.alarm2()},
    5000)
}

public alarm2 = () => {
  this.snotifyService.confirm("Meeting starting soon.", {
    position:this.position ,
    buttons: [
      {text: 'Dismiss'},
    {text: 'Snooze', action: (toast) => {this.snooze(),this.snotifyService.remove(toast.id)} },
    ]
  });
}


  public logout: any = () => {
    this.appService.logout();
    this.socketService.disconnect();
    this.router.navigate(['/login'])
    this.notify.success("Logged out successfully")
  }

}
