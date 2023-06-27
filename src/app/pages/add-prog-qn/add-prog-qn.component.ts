import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { message } from "src/app/common";
import { AlertifyService } from "src/app/shared-service/alertify.service";
import Swal from "sweetalert2";
import { ProgramQn } from "../add-prog-qn/prog-qn";
import { HomeService } from "../home/home.service";
import { ProgService } from "../add-prog-qn/prog.service";

@Component({
  selector: "app-add-prog-qn",
  templateUrl: "./add-prog-qn.component.html",
  styleUrls: ["./add-prog-qn.component.css"],
})
export class AddProgQnComponent implements OnInit {
  constructor(
    private homeService: HomeService,
    private progService: ProgService,
    private alert: AlertifyService,
    private router: Router
  ) { }
  teamList: any;
  teamId: any;
  role: any;
  progQnForm!: FormGroup;
  progQnValue: ProgramQn = new ProgramQn();
  correctAnswerByCopyPaste: string = "";

  ngOnInit(): void {
    this.teamId = sessionStorage.getItem("teamId")?.toString();
    this.role = sessionStorage.getItem("role")?.toString();

    this.progQnForm = new FormGroup({
      program: new FormControl("", [Validators.required]),
      programLevel: new FormControl("Select Level", [Validators.required]),
      question: new FormControl("", [Validators.required]),
      questionLevel: new FormControl("Select Level", [Validators.required]),
      teamId: new FormControl("Select Team", [Validators.required]),
      mulQn: new FormControl(false, [Validators.required]),
    });

    this.getAllTeams();
  }

  filteredTeamList: any[] = [];
  getAllTeams() {
    this.homeService.getAllTeams().subscribe(
      (data) => {
        console.log(data);
        this.teamList = data;
        if (this.role == "SA") {
          this.filteredTeamList = this.teamList;
        } else {
          this.teamList.forEach((element: any, index: any) => {
            if (element.id == this.teamId) {
              this.filteredTeamList.push(element);
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


  goBack() {
    history.back();
  }

  onSubmit() {
    this.progQnValue = this.progQnForm.value;

    this.progQnValue.program = this.progQnValue.program.trim();
    this.progQnValue.programLevel = this.progQnValue.programLevel.trim();
    console.log(this.progQnValue)
    if (this.progQnValue.program == "") {
      this.alert.customWarningMsgWithoutBtn("Program is required!");
      return;
    }
    if (this.progQnValue.programLevel == "" || this.progQnValue.programLevel == "Select Level") {
      this.alert.customWarningMsgWithoutBtn("Program Level is required!");
    }

      this.progQnValue.question = this.progQnValue.question.trim();
      this.progQnValue.questionLevel = this.progQnValue.questionLevel.trim();

      if (this.progQnValue.teamId == "") {
        this.alert.customWarningMsgWithoutBtn("Team is required!");
        return;
      }
      console.log(this.progQnValue);
      this.alert.showLoading();
      this.progService.addProgramQuestion(this.progQnValue).subscribe(
        (data: any) => {
          Swal.close();
          console.log(data);

          if (data.status == 0) {
            //After added
            Swal.fire({
              title: data.message,
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                if (!this.progQnForm.value.mulQn) {
                  this.router.navigateByUrl("/prog-qn-list");
                } else {
                  this.progQnForm.reset();
                }
              }
            });
          } else if (data.status == 1) {
            Swal.fire({
              position: "center",
              icon: "error",
              text: data.message,
              showConfirmButton: false,
              timer: 1500,
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
}