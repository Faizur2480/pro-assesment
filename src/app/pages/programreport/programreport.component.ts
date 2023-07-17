import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { report } from '../assessment/report';
import { ReportService } from '../report/report.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

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
  excelReportList: { reportedOn: string, teamName: string, userName: string, scoredMark: number, totalMark: number }[] = [
  ];
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

        // const uniqueRecords = [...new Set(this.reportList.map((obj: any) => JSON.stringify({ reportedOn: obj.reportedOn, teamName: obj.teamName, userName: obj.userName, userId: obj.userId })))].map((str: any) => JSON.parse(str));
        // console.log(uniqueRecords);

        // this.reportList = uniqueRecords

        // Create a Map to store the unique records
        const uniqueRecords = new Map();

        // Iterate through each object
        for (const obj of this.reportList) {
          obj.totalMark = parseInt(obj.totalMark);
          obj.scoredMark = parseInt(obj.scoredMark);
          // Create a unique key based on reportedOn, teamName, userName, and userId
          const key = `${obj.reportedOn}-${obj.teamName}-${obj.userName}-${obj.userId}`;

          // If the key already exists in the Map, add the scoredMark and totalMark values to the existing record
          if (uniqueRecords.has(key)) {
            const record = uniqueRecords.get(key);
            record.scoredMark += parseInt(obj.scoredMark);
            record.totalMark += parseInt(obj.totalMark);
          } else {
            // If the key doesn't exist, create a new record and add it to the Map
            uniqueRecords.set(key, {
              reportedOn: obj.reportedOn,
              teamName: obj.teamName,
              userName: obj.userName,
              userId: obj.userId,
              scoredMark: obj.scoredMark,
              totalMark: obj.totalMark,
              status:Number.isNaN(obj.scoredMark)?"Yet to  review": "Reviewed"
            });
          }
        }

        // Convert the Map values to an array of unique records
        const uniqueRecordsArray = Array.from(uniqueRecords.values());

        console.log(uniqueRecordsArray);
        this.reportList = uniqueRecordsArray
        this.excelReportList = this.reportList
      }
    )
  }

  // Method to export table data to Excel
  exportToExcel(): void {

    // Rearrange the list and remove the userId property
    const rearrangedList = this.excelReportList.map(({ reportedOn, teamName, userName, scoredMark, totalMark }) => ({
      "Full Name": userName,
      "Team": teamName,
      "Scored Marks": scoredMark,
      "Total Marks": totalMark,
      "Reported On": reportedOn
    }));

    // Create an empty workbook and worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rearrangedList);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel file binary data
    const excelData: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob object from the Excel data
    const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link element
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'level2_report.xlsx';
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    link.remove();
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
