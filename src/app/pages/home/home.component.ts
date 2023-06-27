import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { baseUrl, buttonValue, message, patterns } from "src/app/common";
import { HomeService } from "./home.service";
import { register } from "./register";
import { team } from "./team";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AlertifyService } from "src/app/shared-service/alertify.service";
import { ConnectableObservable } from "rxjs";
import { DashboardService } from "../admin-dashboard/dashboard.service";
import { FormBuilder } from '@angular/forms';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  numericPattern = /^[0-9]*$/;
  adminRadio: any;

  constructor(
    private homeService: HomeService,
    private route: Router,
    private alert: AlertifyService,
    private settingService: DashboardService
  ) { }

  registerForm!: FormGroup;
  registerValue: register = new register();
  isEmpCodeValid: boolean = true;
  isEmailValid: boolean = true;
  teamList: any;
  settings: any;
  totalQns: number = 0;
  totalPrgQns: number = 0;
  ngOnInit() {
    sessionStorage.clear();
    this.registerForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      empCode: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      manager: new FormControl("", [Validators.required]),
      teamId: new FormControl("", [Validators.required]),
      level: new FormControl("", [Validators.required]),
      // phnNumber: new FormControl("", [Validators.required]),
      // code: new FormControl("", [Validators.required]),
    });

    this.getAllTeams();
    this.getDialingCodes();
    this.settingService.settings().subscribe((data: any) => {
      console.log(data);
      this.settings = data[0];
      this.totalQns = this.settings.genQns + this.settings.techQns;
      this.totalPrgQns = this.settings.beginner + this.settings.intermediate + this.settings.advanced;
    });
  }

  codes: any[] = [];
  getDialingCodes() {
    this.homeService.getDialingCodes().subscribe((data: any) => {
      console.log(data);
      this.codes = data;
    });
  }

  navigateToProgramPage() {
    if (this.registerForm && this.registerForm.get('lvlRadio')) {
      const level = this.adminRadio.get('lvlRadio').value;
      if (level === 'A') {
        this.route.navigate(['/program']);
      }
    }
  }


  getAllTeams() {
    this.homeService.getAllTeams().subscribe((data) => {
      console.log(data);
      this.teamList = data;
    });
  }



  resData: any;
  submitBtnValue: string = buttonValue.START_ASSESS;
  errMsg: string = "";
  acceptTC: string = "";
  onSubmit() {
    this.errMsg = "";
    this.submitBtnValue = buttonValue.LOADING_ASSESS;
    this.registerValue = this.registerForm.value;
    console.log(this.registerValue);
    this.registerValue.empCode = this.registerForm.value.empCode;
    if (!patterns.EMAIL_PATTERN.test(this.registerValue.email)) {
      this.isEmailValid = false;
      this.submitBtnValue = buttonValue.START_ASSESS;
      return;
    }
    if (!patterns.EMPCODE_PATTERN.test(this.registerValue.empCode)) {
      this.isEmpCodeValid = false;
      this.submitBtnValue = buttonValue.START_ASSESS;
      return;
    }

    this.registerValue.empCode = this.registerValue.empCode.toUpperCase();
    this.registerValue.email = this.registerValue.email.trim().toLowerCase();
    this.registerValue.level = this.registerValue.level
    Swal.fire({
      title: "Read Instruction",
      html: this.registerValue.level == "L1" ? `There are ${this.totalQns} overall questions.
      Each question carries 1 mark.
      Once an assessment has begun, it cannot be stopped`: `There are ${this.totalPrgQns} overall question(s). You can end your assesment only after 15 mins`,
      showDenyButton: true,
      confirmButtonText: "Start",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          // this.validatePhnNumber();
          //new user
          this.saveUser("false");
        } else {
          this.submitBtnValue = buttonValue.START_ASSESS;
          Swal.fire({ icon: "error", text: "You are not accepted." });
        }
      } else {
        this.submitBtnValue = buttonValue.START_ASSESS;
        return;
      }
    });
  }

  userDto: register = new register();
  openAlertToGetEmail() {
    Swal.fire({
      title: "Submit your registerd Email",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Look up",
      showLoaderOnConfirm: true,
      preConfirm: (inputEmail) => {
        let email = inputEmail.trim().toLowerCase();

        if (email == "") {
          Swal.showValidationMessage(`Email is required!`);
        }

        this.userDto.email = email;
        return fetch(`${baseUrl.BASE_URL}getUserByEmail`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.userDto),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`Email is required!`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        this.registerValue = result.value;
        console.log(result.value);
        if (result.value.status == 1) {
          Swal.fire(`Couldn't find your Email`, "", "info");
        } else {
          Swal.fire({
            title: `Confirm your details below and start your test`,
            width: 600,
            showCancelButton: true,
            confirmButtonText: "Start",
            html: `
                <table class="table text-dark">
                  <tr>
                    <th scope="row" class="p-3">Employee ID</th>
                    <td class="p-3">:</td>
                    <td class="p-3">${result.value.empCode}</td>
                  </tr>
                  <tr>
                    <th scope="row" class="p-3">Email</th>
                    <td class="p-3">:</td>
                    <td class="p-3">${result.value.email}</td>
                  </tr>
                  <tr>
                    <th scope="row" class="p-3">Full Name</th>
                    <td class="p-3">:</td>
                    <td class="p-3">${result.value.firstName} ${result.value.lastName}</td>
                  </tr>
                  <tr>
                    <th scope="row" class="p-3">Manager</th>
                    <td class="p-3">:</td>
                    <td class="p-3">${result.value.manager}</td>
                  </tr>
                  <tr>
                    <th scope="row" class="p-3">Team</th>
                    <td class="p-3">:</td>
                    <td class="p-3">${result.value.team}</td>
                  </tr>
              </table>
          `,
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Read Instruction",
                html: this.registerValue.level == "L1" ? `There are ${this.totalQns} overall questions.
      Each question carries 1 mark.
      Once an assessment has begun, it cannot be stopped`: `There are ${this.totalPrgQns} overall question(s). You can end your assesment only after 15 mins`,
                showDenyButton: true,
                confirmButtonText: "Start",
                denyButtonText: `Cancel`,
              }).then((result) => {
                if (result.isConfirmed) {
                  if (result.value) {
                    this.saveUser("true");
                  } else {
                    this.submitBtnValue = buttonValue.START_ASSESS;
                    Swal.fire({ icon: "error", text: "You are not accepted." });
                  }
                } else {
                  this.submitBtnValue = buttonValue.START_ASSESS;
                  return;
                }
              });
            }
          });
        }
      }
    });
  }

  private validatePhnNumber() {
    this.alert.showLoading();
    var phnNumber = (
      this.registerValue.code + this.registerValue.phnNumber
    ).trim();
    this.homeService.validatePhnNumber(phnNumber).subscribe(
      (data) => {
        this.alert.hideLoading();
        this.resData = data;
        console.log("After saving in DB(user): ");
        console.log(this.resData);
        if (this.resData) {
          //this.saveUser()
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Invalid Phone Number",
            showConfirmButton: false,
            timer: 2000,
          });
          this.submitBtnValue = buttonValue.START_ASSESS;
        }
      },
      (err) => {
        console.log("Error :");
        console.log(err);
        Swal.fire({
          position: "center",
          icon: "error",
          title: message.SOMETHING_WRONG,
          showConfirmButton: false,
          timer: 1500,
        });
        // this.errMsg =
        this.submitBtnValue = buttonValue.START_ASSESS;
      }
    );
  }



  private saveUser(isFromAreadyAppread: string) {
    this.alert.showLoading();
    const params = isFromAreadyAppread;
    this.homeService.addUser(this.registerValue, params).subscribe(
      (data) => {
        this.alert.hideLoading();
        this.resData = data;
        console.log("After saving in DB(user): ");
        console.log(this.resData);
        if (this.resData.status == 0) {
          this.submitBtnValue = buttonValue.START_ASSESS;
          if (this.registerValue.level == "L1") {
            this.route.navigate([]).then((result: any) => {
              window.open("/assessment", "_blank");
            });

          }
          else {
            this.route.navigate([]).then((result: any) => {
              window.open("/program", "_blank");
            });
          }
          // this.route.navigateByUrl("/assessment");
          console.log(this.registerValue)
          this.savedInSession(this.registerValue, this.resData);
          this.registerForm.reset();

          Swal.fire({
            position: "center",
            icon: "success",
            title: this.resData.message,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: this.resData.message,
            showConfirmButton: false,
            timer: 2000,
          });
          // this.errMsg = this.resData.message;
          this.submitBtnValue = buttonValue.START_ASSESS;
          this.registerForm.reset();
        }
      },
      (err) => {
        console.log("Error :");
        console.log(err);
        Swal.fire({
          position: "center",
          icon: "error",
          title: message.SOMETHING_WRONG,
          showConfirmButton: false,
          timer: 1500,
        });
        // this.errMsg =
        this.submitBtnValue = buttonValue.START_ASSESS;
      }
    );
  }

  savedInSession(form: register, resultData: any) {
    sessionStorage.setItem("email", form.email);
    sessionStorage.setItem("empcode", form.empCode);
    sessionStorage.setItem("teamId", form.teamId);
    sessionStorage.setItem("userId", resultData.id);

  }

  previousValue = "";

  onlyAplhabetic(event: any) {
    var inputValue = event.charCode;
    if (
      !(inputValue >= 65 && inputValue <= 90) &&
      !(inputValue >= 97 && inputValue <= 122) &&
      inputValue != 32 &&
      inputValue != 0
    ) {
      event.preventDefault();
    }
  }
}
