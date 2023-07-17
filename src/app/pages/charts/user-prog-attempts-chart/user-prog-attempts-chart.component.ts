import { Component, OnInit, ViewChild } from "@angular/core";
import {ChartComponent} from "ng-apexcharts";
import { message } from "src/app/common";
import { AlertifyService } from "src/app/shared-service/alertify.service";
import Swal from "sweetalert2";
import { DashboardService } from "../../admin-dashboard/dashboard.service";

export type ChartOptions = {
  series: any;
  chart: any;
  xaxis: any;
  dataLabels: any;
  grid: any;
  stroke: any;
  title: any;
};

@Component({
  selector: "app-user-prog-attempts-chart",
  templateUrl: "./user-prog-attempts-chart.component.html",
  styleUrls: ["./user-prog-attempts-chart.component.css"],
})
export class UserProgAttemptsChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: any;

  constructor(
    private dashboardService: DashboardService,
    private alert: AlertifyService
  ) {}

  settingValues() {
    this.chartOptions = {
      series: [
        {
          name: "Count",
          data: this.count,
        },
      ],
      chart: {
        export: {
          csv: {
            filename: "recent_user_attepmts",
          },
          svg: {
            filename:"recent_user_attepmts",
          },
          png: {
            filename: "recent_user_attepmts",
          }
        },
        height: 350,
        type: "line",
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: " No. of users attended by recent dates - Level II ",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.8,
        },
      },
      xaxis: {
        categories: this.dates,
      },
    };
  }

  dates: any;
  count: any;
  ngOnInit() {
    this.alert.showLoading();
    this.dashboardService.userProgAttemptsChart().subscribe(
      (data) => {
        console.log(data);
        const { dates, count } = data;
        this.dates = dates;
        this.count = count;

        this.settingValues();
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
}
