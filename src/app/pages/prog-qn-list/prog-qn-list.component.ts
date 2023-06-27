import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { message } from "src/app/common";
import { AlertifyService } from "src/app/shared-service/alertify.service";
import Swal from "sweetalert2";
import { ProgService } from "../add-prog-qn/prog.service";
import { HomeService } from "../home/home.service";

@Component({
  selector: "app-prog-qn-list",
  templateUrl: "./prog-qn-list.component.html",
  styleUrls: ["./prog-qn-list.component.css"],
})
export class ProgQnListComponent implements OnInit {
  progList: any[] = [];

  constructor(
    private progService: ProgService,
    private alert: AlertifyService,
    private homeService: HomeService
  ) {}

  teamId: any;
  role: any;
  ngOnInit(): void {
    this.getAllProgramQuestionsPage();
    this.getAllTeams();
    this.teamId = sessionStorage.getItem("teamId")?.toString();
    this.role = sessionStorage.getItem("role")?.toString();
  }

  swalWithBootstrapButtons: any = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  getAllProgramQuestionsPage() {
    this.isSearchEnabled = false;
    this.clearFields();
    const params = this.getRequestParams(this.page, this.pageSize);
    this.alert.showLoading();
    this.progService.getAllProgramQuestionsPage(params).subscribe(
      (data: any) => {
        console.log(data);
        const { programQns, totalItems } = data;
        this.progList = programQns;
        this.count = totalItems;
        Swal.close();
      },
      (err) => {
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

  teamList: any;
  getAllTeams() {
    this.alert.showLoading();
    this.homeService.getAllTeams().subscribe(
      (data) => {
        console.log(data);
        this.teamList = data;
      },
      (err) => {
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

  isSearchEnabled: boolean = false;
  searchprogramQnsPage() {
    this.isSearchEnabled = true;
    if (this.searchType == "") {
      this.alert.customErrMsgWithoutBtn("Select any one option");
      return;
    }
    if (this.searchKey == "" && this.searchType == "program") {
      this.alert.customErrMsgWithoutBtn("Keyword is Required");
      return;
    }
    if (this.searchKey == "" && this.searchType == "programLevel") {
      this.alert.customErrMsgWithoutBtn("Keyword is Required");
      return;
    }
    if (this.searchKey == "" && this.searchType == "team") {
      this.alert.customErrMsgWithoutBtn("Team is Required");
      return;
    }
    const params = this.getRequestParams(this.page, this.pageSize);

    this.alert.showLoading();
    this.progService
      .searchProgramQusetionPage(this.searchType, this.searchKey, params)
      .subscribe(
        (data: any) => {
          console.log(data);
          const { progQns, currentPage, totalItems } = data;
          this.progList = progQns;
          this.count = totalItems;
          this.page = currentPage + 1;
          Swal.close();
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

  searchKey: string = "";
  searchType: string = "";

  isEnableTeam: boolean = false;
  isEnableSearchText: boolean = true;
  isEnableProgramLevel: boolean = false;
  isEnableDate: boolean = false;
  onChangeStatus(event: any) {
    if (event == "team") {
      this.isEnableTeam = true;
      this.isEnableSearchText = false;
      this.isEnableDate = false;
      this.isEnableProgramLevel = false;
    } 
    else if (event == "date") {
      this.isEnableTeam = false;
      this.isEnableSearchText = false;
      this.isEnableDate = true;
      this.isEnableProgramLevel = false;
    } 
    
    else if (event == "programLevel") {
      this.isEnableTeam = false;
      this.isEnableSearchText = false;
      this.isEnableDate = false;
      this.isEnableProgramLevel = true;
    } 
    
    else {
      this.searchKey = "";
      this.isEnableTeam = false;
      this.isEnableSearchText = true;
      this.isEnableDate = false;
      this.isEnableProgramLevel = false;
    
    }
  }

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9, 12];
  params: any = {};

  handlePageChange(event: any) {
    this.page = event;
    if (this.isSearchEnabled) {
      this.searchprogramQnsPage();
    } else {
      this.getAllProgramQuestionsPage();
    }
  }

  handlePageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getAllProgramQuestionsPage();
  }

  getRequestParams(page: number, pageSize: number) {
    if (page) {
      this.params[`page`] = page - 1;
    }

    if (pageSize) {
      this.params[`size`] = pageSize;
    }

    return this.params;
  }

  inactiveProgramById(qnId: string) {
    this.swalWithBootstrapButtons
      .fire({
        title: message.ALERT_TITLE,
        text: message.INACTIVE_TEXT,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: message.CONFIRM_INACTIVE_BTN,
        cancelButtonText: message.CANCEL_BTN,
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          this.callingInactiveService(qnId);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.swalWithBootstrapButtons.fire(
            "Cancelled",
            "Question is safe :)",
            "info"
          );
        }
      });
  }

  callingInactiveService(qnId: string) {
    this.progService
      .inactiveProgramQuestionById(qnId)
      .subscribe((data: any) => {
        console.log(data);
        Swal.fire({
          title: data.message,
        }).then((result) => {
          console.log(result.isConfirmed);
          if (result.isConfirmed) {
            Swal.close();
            this.getAllProgramQuestionsPage();
          }
        });
      });
  }

  clearFields() {
    this.searchKey = "";
    this.searchType = "";
  }

  deleteProgramById(qnId: string) {
    this.swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          this.page = 1
          this.pageSize = 3
          this.callingDeleteService(qnId);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.swalWithBootstrapButtons.fire(
            "Cancelled",
            "Question is safe :)",
            "info"
          );
        }
      });
  }

  callingDeleteService(qnId: string) {
    this.progService.deleteProgramQuestionById(qnId).subscribe((data: any) => {
      console.log(data);
      Swal.fire({
        title: data.message,
      }).then((result) => {
        console.log(result.isConfirmed);
        if (result.isConfirmed) {
          Swal.close();
          this.getAllProgramQuestionsPage();
        }
      });
    });
  }

}
