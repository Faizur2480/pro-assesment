import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertifyService } from "src/app/shared-service/alertify.service";
import Swal from "sweetalert2";
import { HomeService } from "../home/home.service";
import { adminReq } from "./admin";
import { AdminService } from "./admin.service";

@Component({
  selector: "app-admin-login",
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.css"],
})
export class AdminLoginComponent implements OnInit {
  constructor(
    private route: Router,
    private homeService: HomeService,
    private alert: AlertifyService,
    private adminService: AdminService
  ) {}
  loginForm!: FormGroup;
  loginErr: boolean = false;
  loginFormInit: boolean = true;
  reqFormInit: boolean = false;

  reqForm!: FormGroup;
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
      ]),
      adminRadio: new FormControl("SA", Validators.required),
    });
  }

  loadModalData() {
    this.loginFormInit = false;
    this.reqFormInit = true;
    this.reqForm = new FormGroup({
      reason: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      teamId: new FormControl("", [Validators.required]),
    });

    this.getAllTeams();
  }

  teamList: any;
  getAllTeams() {
    this.homeService.getAllTeams().subscribe((data) => {
      console.log(data);
      this.teamList = data;
    });
  }

  resData: any;
  admionReqDet: adminReq = new adminReq();
  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.value.adminRadio == "SA") {
      if (
        this.loginForm.value.email == "admin@promantus.com" &&
        this.loginForm.value.password == "admin"
      ) {
        this.loginErr = false;
        sessionStorage.setItem("role", "SA");
        sessionStorage.setItem("email", this.loginForm.value.email.toString());
        this.route.navigateByUrl("/admin-dashboard");
        this.loginForm.reset();

      } else {
        this.loginErr = true;
        this.route.navigateByUrl("/admin-login");
      }
    }

    if (this.loginForm.value.adminRadio == "A") {
      this.admionReqDet.email = this.loginForm.value.email;
      this.admionReqDet.password = this.loginForm.value.password;

      this.adminService
        .getAdminReqDet(this.admionReqDet)
        .subscribe((data: any) => {
          console.log(data);

          const { status, message, res } = data;
          if (status == 1) {
            Swal.fire({
              position: "center",
              icon: "error",
              text: message,
              showConfirmButton: true,
            });
          } else if (status == 0) {
            Swal.fire({
              title: message,
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                sessionStorage.setItem("role", "A");
                sessionStorage.setItem("teamId", res.teamId);
                sessionStorage.setItem("email", this.loginForm.value.email);
                this.route.navigateByUrl("/admin-dashboard");
              }
            });
          }
        });
    }
  }

  adminReq: adminReq = new adminReq();
  onSubmitReq() {
    console.log(this.reqForm.value);
    this.adminReq.email = this.reqForm.value.email;
    this.adminReq.reason = this.reqForm.value.reason;
    this.adminReq.teamId = this.reqForm.value.teamId;
    this.adminService.addAdminRequest(this.adminReq).subscribe((data: any) => {
      console.log(data);

      const { status, message } =  data;
      if (status == 1) {
        Swal.fire({
          position: "center",
          icon: "error",
          text: message,
          showConfirmButton: true,
        });
      } else if (status == 0) {
        Swal.fire({
          title: message,
          showDenyButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); 
          }
        });
      }
    });
  }

  closeReqModal() {
    this.loginFormInit = true;
    this.reqFormInit = false;
    this.loginForm.reset({
      adminRadio: "SA",
    });
    this.reqForm.reset();
  }
}
