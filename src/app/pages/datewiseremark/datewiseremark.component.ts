import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"; import { ReportService } from '../report/report.service';
import { report } from '../assessment/report';
@Component({
  selector: 'app-datewiseremark',
  templateUrl: './datewiseremark.component.html',
  styleUrls: ['./datewiseremark.component.css']
})
export class DatewiseremarkComponent implements OnInit {

  constructor(private aroute: ActivatedRoute, private reportService: ReportService, private router: Router) { }
  userId: any
  reportedOn: any
  request: report = new report();
  ngOnInit(): void {
    this.userId = this.aroute.snapshot.params["userId"];
    this.reportedOn = this.aroute.snapshot.params["date"];

    console.log(this.userId)
    console.log(this.reportedOn)
    this.getProgReportedOn()
  }
  reportList: any = [];
  getProgReportedOn() {
    this.request.reportedOn = this.reportedOn
    this.request.userId = this.userId
    //here the type is reportedOn on the 2nd param
    this.reportService.getProgByReportedOn(this.request, "userIdAndReportedOn").subscribe(
      (data: any) => {
        console.log(data);
        this.reportList = data;
      }
    )
  }

  goBack(){
    history.back()
  }

  gotoUpdatereport(item: any) {
    console.log(item)
    this.router.navigateByUrl("/reviewprogram/" + item.id);
  }

}
