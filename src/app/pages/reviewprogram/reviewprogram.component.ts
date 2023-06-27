import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../report/report.service';
import { report } from '../assessment/report';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reviewprogram',
  templateUrl: './reviewprogram.component.html',
  styleUrls: ['./reviewprogram.component.css']
})
export class ReviewprogramComponent implements OnInit {

  constructor(private aroute: ActivatedRoute, private reportService: ReportService, private router: Router) { }
  id: any
  ngOnInit(): void {
    this.id = this.aroute.snapshot.params["id"];
    this.getProgReportsById()
  }
  prog: any
  getProgReportsById() {
    this.reportService.getProgReportsById(this.id).subscribe(
      (data: any) => {
        console.log(data);
        this.prog = data;
      }
    )
  }

  request: report = new report()
  updateProgReport() {
    this.request.id = this.id
    this.request.scoredMark = this.prog.scoredMark
    this.request.remarks = this.prog.remarks
    this.request.userId = this.prog.userId

    this.reportService.updateProgReports(this.request).subscribe(
      (data: any) => {
        console.log(data);
        Swal.fire({
          title: data.message,
          showDenyButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            history.back()
          }
        });
      }
    )
  }

  goBack() {
    history.back()
  }

}
