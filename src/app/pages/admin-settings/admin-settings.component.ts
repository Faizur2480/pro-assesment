import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../admin-dashboard/dashboard.service";
import { settings } from "./settings";
import Swal from "sweetalert2";
import { message } from "./../../common";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-settings",
  templateUrl: "./admin-settings.component.html",
  styleUrls: ["./admin-settings.component.css"],
})
export class AdminSettingsComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSettings();
  }

  settings: settings = new settings();

  getSettings() {
    this.dashboardService.settings().subscribe((data: any) => {
      console.log(data);
      this.settings = data[0];
    });
  }

  updateSettings() {
    this.dashboardService
      .updateSettings(this.settings)
      .subscribe((data: any) => {
        console.log(data);
        if(data.status == 1){
          Swal.fire({
            position: "center",
            icon: "error",
            text: data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }else{
          Swal.fire({
            position: "center",
            icon: "success",
            text: data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
       
      });
    // this.router.navigate(['/admin-dashboard']);
  }

  changeFailPercent() {
    this.settings.failPercentage = this.settings.passPercentage - 1;
  }

  changeProgFailPercent() {
    this.settings.progFailPercentage = this.settings.progPassPercentage - 1;
  }

  onlyNumeric(event:any){
    console.log(event)
    var inputValue = event.charCode;
    if (
      !(inputValue >= 48 && inputValue <= 57) &&
      inputValue != 32
    ) {
      event.preventDefault();
    }
  }
}
