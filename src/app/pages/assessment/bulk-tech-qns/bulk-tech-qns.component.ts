import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AlertifyService } from "src/app/shared-service/alertify.service";
import Swal from "sweetalert2";
type AOA = any[][];
import * as XLSX from "xlsx";
import { message } from "src/app/common";
import { Router } from "@angular/router";
import { HomeService } from "../../home/home.service";
import { TechService } from "../../add-tech-qn/tech.service";
import { generalQn } from "../../add-gen-qn/gen-qn";
@Component({
  selector: "app-bulk-tech-qns",
  templateUrl: "./bulk-tech-qns.component.html",
  styleUrls: ["./bulk-tech-qns.component.css"],
})
export class BulkTechQnsComponent implements OnInit {
  constructor(
    private homeService: HomeService,
    private techService: TechService,
    private alert: AlertifyService,
    private router: Router
  ) {}

  teamList: any[] = [];
  filteredTeamList: any[] = [];
  teamId: any = "0";
  role: any;
  SS_TeamId:any
  ngOnInit() {
    this.SS_TeamId = sessionStorage.getItem("teamId")?.toString();
    this.role = sessionStorage.getItem("role")?.toString();
    this.homeService.getAllTeams().subscribe((data: any) => {
      console.log(data);
      this.teamList = data;
      if (this.role == "SA") {
        this.filteredTeamList = this.teamList;
      } else {
        this.teamList.forEach((element: any, index: any) => {
          if (element.id == this.SS_TeamId) {
            this.filteredTeamList.push(element);
          }
        });
      }
    });
  }

  resultList: generalQn[] = [];
  genDto: generalQn = new generalQn();
  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "array" };
  fileName: string = "SheetJS.xlsx";

  @ViewChild("myInput")
  myInputVariable!: ElementRef;

  swalWithBootstrapButtons: any = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  saveBulkQn() {
    console.log("resultList");
    console.log(this.resultList);
    this.swalWithBootstrapButtons
      .fire({
        title: message.ALERT_TITLE,
        text: message.UPLOAD_QN_TEXT,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: message.CONFIRM_UPLOAD_BTN,
        cancelButtonText: message.CANCEL_BTN,
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          this.callingSaveBulkTechQnsService();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.swalWithBootstrapButtons.fire("Cancelled", "", "info");
        }
      });
  }

  callingSaveBulkTechQnsService() {
    this.alert.showLoading();
    this.techService.saveBulkTechQuestions(this.resultList).subscribe(
      (data: any) => {
        Swal.close();
        console.log(data);
        const { status, message, duplicateQns } = data;
        if (status == 0) {
          //After added
          Swal.fire({
            title: message,
            showDenyButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.clearInput();
              this.router.navigateByUrl("/tech-qn-list");
            }
          });
        } else if (status == 1) {
          Swal.fire({
            position: "center",
            icon: "error",
            text: message,
            showConfirmButton: true,
          });
        } else if (status == 1 && duplicateQns == "duplicateQns" || duplicateQns != undefined) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: message,
            text: duplicateQns,
            showConfirmButton: true,
          });
        }
      },
      (err:any) => {
        console.log("Error :");
        console.log(err);
        Swal.fire({
          position: "center",
          icon: "error",
          title: message.SOMETHING_WRONG,
          text: err,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  clearInput() {
    this.myInputVariable.nativeElement.value = "";
    this.teamId = "0";
    this.data = [];
    this.resultList = [];
  }

  enableSaveBtn: boolean = false;

  onFileChange(evt: any) {
    if (this.teamId == "0") {
      this.alert.customErrMsgTitle("Team is required!");
      this.clearInput();
      return;
    } else {
      this.data = [];
      this.resultList = [];
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>evt.target;
      if (target.files.length !== 1)
        throw new Error("Cannot use multiple files");
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
        console.log("data:", this.data);

        var len = this.data.length;

        for (var i = 0; i < len; i++) {
          if (this.data[i].length > 6) {
            this.enableSaveBtn = false;
            Swal.fire({
              title:
                "Invalid Data found. First 6 columns should be used to upload the questions. Check your excel and re-upload",
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                this.enableSaveBtn = false;
                return;
              }
            });
          } else {
            this.enableSaveBtn = true;
          }
        }

        for (var i = 0; i < len; i++) {
          this.genDto = new generalQn();
          this.genDto.question = this.data[i][0];
          this.genDto.option1 = this.data[i][1];
          this.genDto.option2 = this.data[i][2];
          this.genDto.option3 = this.data[i][3];
          this.genDto.option4 = this.data[i][4];
          this.genDto.answer = this.data[i][5];
          this.genDto.teamId = this.teamId;
          this.resultList.push(this.genDto);
        }

        // console.log(this.resultList);

        this.resultList.map((res) => {
          console.log(res);
          if (
            res.question === undefined ||
            res.option1 === undefined ||
            res.option2 === undefined ||
            res.option3 === undefined ||
            res.option4 === undefined ||
            res.answer === undefined
          ) {
            Swal.fire({
              title: "Invalid Data found. Check your excel and re-upload",
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                return;
              }
            });
            this.enableSaveBtn = false;
            return;
          } else {
            this.enableSaveBtn = true;
          }
        });
      };
      reader.readAsBinaryString(target.files[0]);
    }
  }
}
