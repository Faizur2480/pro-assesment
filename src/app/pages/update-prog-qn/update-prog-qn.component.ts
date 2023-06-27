import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { message, commonFunctions } from "src/app/common";
import { AlertifyService } from "src/app/shared-service/alertify.service";
import Swal from "sweetalert2";
import { ProgramQn } from "../add-prog-qn/prog-qn";
import { ProgService } from "../add-prog-qn/prog.service";
import { HomeService } from "../home/home.service";


@Component({
  selector: "app-update-prog-qn",
  templateUrl: "./update-prog-qn.component.html",
  styleUrls: ["./update-prog-qn.component.css"],
})
export class UpdateProgQnComponent implements OnInit {


  constructor(
    private aroute: ActivatedRoute,
    private progService: ProgService,
    private alert: AlertifyService,
    private homeService: HomeService,
    private router: Router
  ) {}

  progQnId: string = "";
  progQn: any;
  teamList: any;
  progQnForm!: FormGroup;
  progQnValue: ProgramQn = new ProgramQn();
  correctAnswerByCopyPaste: string = "";

  ngOnInit(): void {

    this.progQnId = this.aroute.snapshot.params["id"];
    this.progService.getProgramQuestionById(this.progQnId).subscribe(
      (data) => {
        this.getAllTeams();
        console.log(data);
        this.progQn = data;
        //Setting up the value in form Group
        this.progQnForm = new FormGroup({
          question: new FormControl(this.progQn.question, [
            Validators.required,
          ]),
          programLevel: new FormControl(this.progQn.programLevel, [Validators.required]),
          teamId: new FormControl(this.progQn.teamId, [Validators.required]),
          program: new FormControl(this.progQn.program, [Validators.required]),
        });
        //Swal.close();
      },
      (err: any) => {
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

  getAllTeams() {
    this.homeService.getAllTeams().subscribe((data) => {
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
    });
  }

  goBack() {
    history.back();
  }

  checkDuplicateOptions(progQnValue: ProgramQn): boolean {
    return true;
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
    if (this.progQnValue.programLevel == "" || this.progQnValue.programLevel == "Select Level"  ) {
      this.alert.customWarningMsgWithoutBtn("Program Level is required!");
    }
 
    if (this.progQnValue.teamId == "") {
      this.alert.customWarningMsgWithoutBtn("Team is required!");
      return;
    }
    console.log(this.progQnValue);
    this.progQnValue.id = this.progQnId 
    this.alert.showLoading();
    this.progService.updateProgramQuestion(this.progQnValue).subscribe(
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
