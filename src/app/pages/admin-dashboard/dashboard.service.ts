import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "src/app/common";
import { widget } from "./dashboard";
import { register } from './../home/register';

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private httpClient: HttpClient) {}
  //Home URL
  private widgetDataUrl = baseUrl.BASE_URL + "widgetData";
  private questionsActiveInactiveUrl = baseUrl.BASE_URL + "questionsActiveInactive";
  private userAttemptsChartUrl = baseUrl.BASE_URL + "userAttemptsChart";
  private userProgAttemptsChartUrl = baseUrl.BASE_URL + "userProgAttemptsChart";
  private datewisePassFailUrl = baseUrl.BASE_URL + "datewisePassFail";
  private teamExamReadinessUrl = baseUrl.BASE_URL + "teamExamReadiness";

  private settingsUrl = baseUrl.BASE_URL + "getAllSettings";
  private updateSettingsUrl = baseUrl.BASE_URL + "updateSettings";

  widgetData() {
    return this.httpClient.get<widget[]>(this.widgetDataUrl);
  }
  
  questionsActiveInactive() {
    return this.httpClient.get<widget[]>(this.questionsActiveInactiveUrl);
  }
  
  datewisePassFail(date: string) {
    return this.httpClient.get<widget[]>(`${this.datewisePassFailUrl}/${date}`);
  }

  userAttemptsChart() {
    return this.httpClient.get<any>(this.userAttemptsChartUrl);
  }

  userProgAttemptsChart() {
    return this.httpClient.get<any>(this.userProgAttemptsChartUrl);
  }
  
  teamExamReadiness() {
    return this.httpClient.get<any>(this.teamExamReadinessUrl);
  }

  settings() {
    return this.httpClient.get<any>(this.settingsUrl);
  }

  updateSettings(request:any){
    return this.httpClient.put(this.updateSettingsUrl, request);
  }
}
