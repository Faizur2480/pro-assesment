
import { Component, OnInit } from "@angular/core";

import { message } from "src/app/common";

import { AlertifyService } from "src/app/shared-service/alertify.service";

import Swal from "sweetalert2";

import { GeneralService } from "../add-gen-qn/general.service";

import { TechService } from "../add-tech-qn/tech.service";

import { HomeService } from "../home/home.service";




@Component({

  selector: "app-inactive-qn",

  templateUrl: "./inactive-qn.component.html",

  styleUrls: ["./inactive-qn.component.css"],

})

export class InactiveQnComponent implements OnInit {

  teamId: any;

  constructor(

    private alert: AlertifyService,

    private homeService: HomeService,

    private techService: TechService

  ) {}




  role: any;

  ngOnInit(): void {

    this.teamId = sessionStorage.getItem("teamId")?.toString();

    this.role = sessionStorage.getItem("role")?.toString();

  }




  isSearchEnabled: boolean = false;

  searchKey: string = "";

  searchType: string = "";




  isEnableTeam: boolean = false;

  onChangeStatus(event: any) {

    if (event == "techQuestions" || event == 'progQuestions') {

      this.getAllTeams();

      this.isEnableTeam = true;

    } else {

      this.isEnableTeam = false;

    }

  }




  teamList: any;

  getAllTeams() {

    this.alert.showLoading();

    this.homeService.getAllTeams().subscribe(

      (data) => {

        console.log(data);

        this.teamList = data;

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




  page = 1;

  count = 0;

  pageSize = 5;

  pageSizes = [5, 10, 15];

  params: any = {};




  handlePageChange(event: any) {

    this.page = event;

    this.getInactiveQns();

  }




  handlePageSizeChange(event: any) {

    this.pageSize = event.target.value;

    this.page = 1;

    this.getInactiveQns();

  }




  swalWithBootstrapButtons: any = Swal.mixin({

    customClass: {

      confirmButton: "btn btn-success",

      cancelButton: "btn btn-danger",

    },

    buttonsStyling: false,

  });




  activeQuestionById(id: string) {

    this.swalWithBootstrapButtons

      .fire({

        title: message.ALERT_TITLE,

        text: message.ACTIVE_TEXT,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: message.CONFIRM_INACTIVE_BTN,

        cancelButtonText: message.CANCEL_BTN,

        reverseButtons: true,

      })

      .then((result: any) => {

        if (result.isConfirmed) {

          this.callingActiveQnService(id);

        } else if (result.dismiss === Swal.DismissReason.cancel) {

          this.swalWithBootstrapButtons.fire(

            "Cancelled",

            "Question is still in-active state :)",

            "info"

          );

        }

      });

  }




  inactiveGenTechList: any[] = [];

  inactiveProgList: any[] = [];

  private callingActiveQnService(id: string) {

    this.techService.activeQuestionById(this.searchType, id).subscribe(

      (data: any) => {

        console.log(data);

        const { message, status } = data;

        if (status == 0) {

          Swal.fire({

            title: message,

          }).then((result) => {

            console.log(result.isConfirmed);

            if (result.isConfirmed) {

              Swal.close();

              this.getInactiveQns();

            }

          });

        }

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




  getInactiveQns() {

    if (this.searchType == "") {

      this.alert.customErrMsgWithoutBtn("Select any one option");

      return;

    }




    if (this.isEnableTeam) {

      if (this.searchKey == "") {

        this.alert.customErrMsgWithoutBtn("Keyword is Required");

        return;

      }

    } else {

      this.searchKey = "none";

    }




    this.alert.showLoading();

    this.techService.getInactiveQns(this.searchType, this.searchKey).subscribe(

      (data: any) => {

        console.log(data);

        const { inactiveQns } = data;

        if (this.searchType == "progQuestions") {

          this.inactiveGenTechList = [];

          this.inactiveProgList = inactiveQns;

        } else {

          this.inactiveGenTechList = inactiveQns;

          this.inactiveProgList = [];

        }

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




  clearFields() {

    this.searchKey = "";

    this.searchType = "";

    this.inactiveGenTechList = [];
    this.inactiveProgList = [];

  }

}


