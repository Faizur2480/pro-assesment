import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { baseUrl } from "src/app/common";

import { report } from "../assessment/report";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(private httpClient: HttpClient) { }
  //Home URL
  private getAllReportsUrl = baseUrl.BASE_URL + "getAllReports";
  private getAllReportsPageUrl = baseUrl.BASE_URL + "getAllReportsPage";
  private searchUrl = baseUrl.BASE_URL + "searchByReport";
  private downloadReportsUrl = baseUrl.BASE_URL + "downloadReports";
  private getProgByReportedOnUrl = baseUrl.BASE_URL + "getProgByReportedOn";
  private addProgReportsUrl = baseUrl.BASE_URL + "addProgReports";
  private getProgReportsByIdUrl = baseUrl.BASE_URL + "getProgReportsById";
  private updateProgReportsUrl = baseUrl.BASE_URL + "updateProgReports";

  getProgReportsById(id: string) {
    return this.httpClient.get(`${this.getProgReportsByIdUrl}/${id}`);
  }

  addProgReports(request: any) {
    return this.httpClient.post(this.addProgReportsUrl, request);
  }

  updateProgReports(request: any) {
    return this.httpClient.put(this.updateProgReportsUrl, request);
  }

  getAllReports() {
    return this.httpClient.get(this.getAllReportsUrl);
  }

  getProgByReportedOn(req: report, type: string) {
    return this.httpClient.post(`${this.getProgByReportedOnUrl}/${type}`, req);
  }

  getAllReportsPage(params: any) {
    return this.httpClient.get(this.getAllReportsPageUrl, { params });
  }

  downloadReports(report: report[]): Observable<Object> {
    return this.httpClient.put(
      `${this.downloadReportsUrl}`,
      report,
      {

        responseType: 'blob',
      }
    );
  }

  search(type: string, keyword: string): Observable<Object> {
    return this.httpClient.get(`${this.searchUrl}/${type}/${keyword}`);
  }
}
