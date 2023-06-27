import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddGenQnComponent } from "./pages/add-gen-qn/add-gen-qn.component";
import { AddTechQnComponent } from "./pages/add-tech-qn/add-tech-qn.component";
import { AdminDashboardComponent } from "./pages/admin-dashboard/admin-dashboard.component";
import { AdminLoginComponent } from "./pages/admin-login/admin-login.component";
import { AdminRequestComponent } from "./pages/admin-request/admin-request.component";
import { AssessmentComponent } from "./pages/assessment/assessment.component";
import { GenQnListComponent } from "./pages/gen-qn-list/gen-qn-list.component";
import { HomeComponent } from "./pages/home/home.component";
import { InactiveQnComponent } from "./pages/inactive-qn/inactive-qn.component";
import { MainComponent } from "./pages/bulk-gen-qns/bulk-gen-qns.component";
import { ReportComponent } from "./pages/report/report.component";
import { TeamListComponent } from "./pages/team-list/team-list.component";
import { TechQnListComponent } from "./pages/tech-qn-list/tech-qn-list.component";
import { UpdateGenQnComponent } from "./pages/update-gen-qn/update-gen-qn.component";
import { UpdateTechQnComponent } from "./pages/update-tech-qn/update-tech-qn.component";
import { UsersListComponent } from "./pages/users-list/users-list.component";
import { BulkTechQnsComponent } from "./pages/bulk-tech-qns/bulk-tech-qns.component";
import { AllProLinksComponent } from "./pages/all-pro-links/all-pro-links.component";
import { AdminSettingsComponent } from "./pages/admin-settings/admin-settings.component";
import { ProgramComponent } from "./pages/program/program.component";
import { AddProgQnComponent } from "./pages/add-prog-qn/add-prog-qn.component";
import { UpdateProgQnComponent } from "./pages/update-prog-qn/update-prog-qn.component";
import { ProgQnListComponent } from "./pages/prog-qn-list/prog-qn-list.component";
// import { BulkProgQnsComponent } from "./pages/bulk-prog-qns/bulk-prog-qns.component";
import { ProgramreportComponent } from "./pages/programreport/programreport.component";
import { DatewiseremarkComponent } from "./pages/datewiseremark/datewiseremark.component";
import { ReviewprogramComponent } from "./pages/reviewprogram/reviewprogram.component";
const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "assessment", component: AssessmentComponent },
  { path: "admin-login", component: AdminLoginComponent },
  { path: "admin-dashboard", component: AdminDashboardComponent },
  { path: "add-gen-qn", component: AddGenQnComponent },
  { path: "settings", component: AdminSettingsComponent },
  { path: "add-tech-qn", component: AddTechQnComponent },
  { path: "add-prog-qn", component: AddProgQnComponent },
  { path: "edit-gen-qn/:id", component: UpdateGenQnComponent },
  { path: "edit-tech-qn/:id", component: UpdateTechQnComponent },
  { path: "edit-tech-qn", component: UpdateTechQnComponent },
  { path: "edit-prog-qn/:id", component: UpdateProgQnComponent },
  { path: "edit-prog-qn", component: UpdateProgQnComponent },
  { path: "gen-qn-list", component: GenQnListComponent },
  { path: "prog-qn-list", component: ProgQnListComponent },
  { path: "tech-qn-list", component: TechQnListComponent },
  { path: "team-list", component: TeamListComponent },
  { path: "user-list", component: UsersListComponent },
  { path: "report", component: ReportComponent },
  { path: "inactive-qn", component: InactiveQnComponent },
  { path: "admin-request", component: AdminRequestComponent },
  { path: "upload-gen-qns", component: MainComponent },
  { path: "upload-tech-qns", component: BulkTechQnsComponent },
  // { path: "upload-prog-qns", component: BulkProgQnsComponent },
  { path: "promantus-projects", component: AllProLinksComponent },
  { path: "program", component: ProgramComponent },
  { path: "programreport", component: ProgramreportComponent },
  { path: "datewisereport/:date/:userId", component: DatewiseremarkComponent },
  { path: "reviewprogram/:id", component: ReviewprogramComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }


