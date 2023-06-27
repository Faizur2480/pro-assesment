import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { report } from '../assessment/report';
import { ReportService } from '../report/report.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programreport',
  templateUrl: './programreport.component.html',
  styleUrls: ['./programreport.component.css']
})
export class ProgramreportComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCurrentDate()
    this.getProgReportedOn()

  }
  reportList: any = [];
  todayDate: any
  request: report = new report();
  reportDate: any

  getProgReportedOn() {
    this.request.reportedOn = this.todayDate
    //here the type is reportedOn on the 2nd param
    this.reportService.getProgByReportedOn(this.request, "reportedOn").subscribe(
      (data: any) => {
        console.log(data);
        this.reportList = data;

        const uniqueRecords = [...new Set(this.reportList.map((obj: any) => JSON.stringify({ reportedOn: obj.reportedOn, teamName: obj.teamName, userName: obj.userName, userId: obj.userId })))].map((str: any) => JSON.parse(str));
        console.log(uniqueRecords);

        this.reportList = uniqueRecords
      }
    )
  }

  gotoDatewisereport(item: any) {
    this.router.navigateByUrl("/datewisereport/" + this.todayDate + "/" + item.userId);
  }

  getVal() {
    this.getProgReportedOn()
  }

  getCurrentDate() {
    this.todayDate = new Date().toISOString().substring(0, 10);
  }
}
