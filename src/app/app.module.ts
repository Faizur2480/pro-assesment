import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./pages/home/home.component";
import { AssessmentComponent } from "./pages/assessment/assessment.component";
import { FormatTimePipe } from "./pipes/format-time.pipe";
import { UserDetailsComponent } from "./shared-components/user-details/user-details.component";
import { AdminLoginComponent } from "./pages/admin-login/admin-login.component";
import { AdminDashboardComponent } from "./pages/admin-dashboard/admin-dashboard.component";
import { AddGenQnComponent } from "./pages/add-gen-qn/add-gen-qn.component";
import { AddTechQnComponent } from "./pages/add-tech-qn/add-tech-qn.component";
import { AdminHeaderComponent } from "./pages/admin-header/admin-header.component";
import { GenQnListComponent } from "./pages/gen-qn-list/gen-qn-list.component";
import { TechQnListComponent } from "./pages/tech-qn-list/tech-qn-list.component";
import { UpdateGenQnComponent } from "./pages/update-gen-qn/update-gen-qn.component";
import { UpdateTechQnComponent } from "./pages/update-tech-qn/update-tech-qn.component";
import { MainComponent } from "./pages/bulk-gen-qns/bulk-gen-qns.component";
import { TeamListComponent } from "./pages/team-list/team-list.component";
import { ReportComponent } from './pages/report/report.component';
import { NgxPaginationModule } from "ngx-pagination";
import { NgApexchartsModule } from "ng-apexcharts";
import { UserAttemptsChartComponent } from './pages/charts/user-attempts-chart/user-attempts-chart.component';
import { ExamStatusChartComponent } from './pages/charts/exam-status-chart/exam-status-chart.component';
import { ExamStatusChartDonutComponent } from './pages/charts/exam-status-chart-donut/exam-status-chart-donut.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { InactiveQnComponent } from './pages/inactive-qn/inactive-qn.component';
import { ActiveInactiveChartComponent } from './pages/charts/active-inactive-chart/active-inactive-chart.component';
import { AdminRequestComponent } from './pages/admin-request/admin-request.component';
import { BulkTechQnsComponent } from './pages/bulk-tech-qns/bulk-tech-qns.component';
import { NgxFullscreenModule } from "@ultimate/ngx-fullscreen";
import { AllProLinksComponent } from './pages/all-pro-links/all-pro-links.component';
import { AdminSettingsComponent } from './pages/admin-settings/admin-settings.component';
import { ProgramComponent } from './pages/program/program.component';
import { AngularEditorModule } from "angular-editor55";
import { AddProgQnComponent } from './pages/add-prog-qn/add-prog-qn.component';
import { BulkProgQnsComponent } from './pages/bulk-prog-qns/bulk-prog-qns.component';
import { ProgQnListComponent } from './pages/prog-qn-list/prog-qn-list.component';
import { UpdateProgQnComponent } from './pages/update-prog-qn/update-prog-qn.component';
import { ProgramreportComponent } from './pages/programreport/programreport.component';
import { DatewiseremarkComponent } from './pages/datewiseremark/datewiseremark.component';
import { ReviewprogramComponent } from './pages/reviewprogram/reviewprogram.component';
import { UserProgAttemptsChartComponent } from './pages/charts/user-prog-attempts-chart/user-prog-attempts-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AssessmentComponent,
    FormatTimePipe,
    UserDetailsComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AddGenQnComponent,
    AddTechQnComponent,
    AdminHeaderComponent,
    GenQnListComponent,
    TechQnListComponent,
    UpdateGenQnComponent,
    UpdateTechQnComponent,
    MainComponent,
    TeamListComponent,
    ReportComponent,
    UserAttemptsChartComponent,
    ExamStatusChartComponent,
    ExamStatusChartDonutComponent,
    UsersListComponent,
    InactiveQnComponent,
    ActiveInactiveChartComponent,
    AdminRequestComponent,
    BulkTechQnsComponent,
    AllProLinksComponent,
    AdminSettingsComponent,
    ProgramComponent,
    AddProgQnComponent,
    BulkProgQnsComponent,
    ProgQnListComponent,
    UpdateProgQnComponent,
    ProgramreportComponent,
    DatewiseremarkComponent,
    ReviewprogramComponent,
    UserProgAttemptsChartComponent,
  ],
  imports: [
    
    NgxPaginationModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgApexchartsModule,
    NgxFullscreenModule,
    AngularEditorModule,
    ReactiveFormsModule,
    AngularEditorModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
