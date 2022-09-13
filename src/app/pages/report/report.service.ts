import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { baseUrl } from "src/app/common";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(private httpClient: HttpClient) {}
  //Home URL
  private getAllReportsUrl = baseUrl.BASE_URL + "getAllReports";
  private searchUrl = baseUrl.BASE_URL + "searchByReport";

  getAllReports() {
    return this.httpClient.get(this.getAllReportsUrl);
  }

  search(type: string, keyword: string): Observable<Object> {
    return this.httpClient.get(`${this.searchUrl}/${type}/${keyword}`);
  }
}
