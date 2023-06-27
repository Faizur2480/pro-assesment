import { DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import {
  NgxFullscreenDirective,
  NgxFullscreenTransition,
} from "@ultimate/ngx-fullscreen";
import { browserRefresh } from "src/app/app.component";
import { message } from "src/app/common";
import Swal from "sweetalert2";

import { AssessmentService } from "./assessment.service";
import { question } from "./question";

import { questions } from "./questions";
import { report } from "./report";
import { ReportService } from "./report.service";

@Component({
  selector: "app-assessment",
  templateUrl: "./assessment.component.html",
  styleUrls: ["./assessment.component.css"],
})
export class AssessmentComponent implements OnInit {
  SS_UserId: any = "";
  SS_TeamId: any = "";
  browserRefresh: any;
  constructor(
    private assessmentService: AssessmentService,
    private reportService: ReportService,
    private router: Router,
    private eleRef: ElementRef,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: any
  ) { }

  @ViewChild("completeBtn")
  completeBtn!: ElementRef;

  questionList: question[] = [];
  generalQnList: question[] = [];
  technicalQnList: question[] = [];

  timeLeft: number = 0; //30 min - 1800 secs
  interval: any;

  answerForm!: FormGroup;
  answerArray: Array<String> = [];
  answerValue: questions = new questions();

  ngAfterViewInit() {
    this.fullscreen.transition.subscribe((change: NgxFullscreenTransition) => {
      console.log(change); // { isFullscreen: boolean, element: Element }
    });
    this.enterFullscreen();
  }

  @ViewChild("fullscreen") fullscreen!: NgxFullscreenDirective;
  @ViewChild("fullScreenBtn") fullScreenBtn!: ElementRef<HTMLElement>;
  @ViewChild("stopBtn") stopBtn!: ElementRef<HTMLElement>;

  enterFullscreen() {
    this.fullscreen.enter();
  }

  exitFullscreen() {
    this.fullscreen.exit();
  }

  visiblitiyHiddenCount: number = 0;
  genQnsCountFromBK: any;
  techQnsCountFromBK: any;
  passPercentage: any;
  formControls: any;
  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    console.log("refreshed?:", browserRefresh);

    if (sessionStorage.getItem("userId") == "null") {
      this.router.navigateByUrl("/");
    }
    sessionStorage.setItem("level", "L1");
    sessionStorage.setItem("isReportSaved", "false");
    let visiblitiyHiddenCount = 0;
    //Visiblity change - switching other tabs
    document.addEventListener("visibilitychange", function () {
      let startBtnel: HTMLElement = document.getElementById(
        "startBtn"
      ) as HTMLElement;
      let stopBtnel: HTMLElement = document.getElementById(
        "stopBtn"
      ) as HTMLElement;
      let completeBtnel: HTMLElement = document.getElementById(
        "completeBtn"
      ) as HTMLElement;
      if (document.hidden) {
        // alert("Hidden")
        visiblitiyHiddenCount++;
        if (visiblitiyHiddenCount <= 3) {
          stopBtnel.click();
          //Click fullscreen button through native element
          alert(
            "WARNING: " +
            visiblitiyHiddenCount +
            " You are not suppose to switch / Move from current tab\nAssessment will end after 3 warnings automatically"
          );

          if (visiblitiyHiddenCount > 3) {
            completeBtnel.click();
          }
        }
      } else {
        // alert("shown")
        // if (visiblitiyHiddenCount <= 3) {
        startBtnel.click();
        // }
        if (visiblitiyHiddenCount > 3) {
          completeBtnel.click();
        }
      }
    });

    //Prevent refresh this current page - when press F5
    window.addEventListener("keyup", disableF5);
    window.addEventListener("keydown", disableF5);

    window.onbeforeunload = function () {
      return false;
    };
    function disableF5(e: {
      which: any;
      keyCode: any;
      preventDefault: () => void;
    }) {
      if ((e.which || e.keyCode) == 116) e.preventDefault();
    }

    //Setting up the user and team id in session storage
    this.SS_UserId = sessionStorage.getItem("userId");
    this.SS_TeamId = sessionStorage.getItem("teamId");

    if (this.SS_UserId == null || this.SS_TeamId == null) {
      this.router.navigateByUrl("/");
      return;
    }

    // var prom = confirm("To prevent you from switching to other web pages Fullscreen mode enabled!")
    // if(prom){
    //Initialize the question form
    this.assessmentService.getSettings().subscribe((res: any) => {
      console.log(res);
      this.genQnsCountFromBK = res[0].genQns;
      this.techQnsCountFromBK = res[0].techQns;
      this.passPercentage = res[0].passPercentage

      const totQns = this.genQnsCountFromBK + this.techQnsCountFromBK;

      this.answerForm = this.formBuilder.group({});
      for (let index = 0; index < totQns; index++) {
        const controlName = `qn${index}`;
        this.answerForm.addControl(controlName, new FormControl(""));
      }

      //assigning questions
      this.getAllAssessmentQns(this.SS_UserId, this.SS_TeamId);

      //Click fullscreen button through native element
      let el: HTMLElement = this.fullScreenBtn.nativeElement;
      el.click();
    });

    // this.answerForm = new FormGroup({

    //   // qn0: new FormControl(""),
    //   // qn1: new FormControl(""),
    //   // qn2: new FormControl(""),
    //   // qn3: new FormControl(""),
    //   // qn4: new FormControl(""),
    //   // qn5: new FormControl(""),
    //   // qn6: new FormControl(""),
    //   // qn7: new FormControl(""),
    //   // qn8: new FormControl(""),
    //   // qn9: new FormControl(""),
    //   // qn10: new FormControl(""),
    //   // qn11: new FormControl(""),
    //   // qn12: new FormControl(""),
    //   // qn13: new FormControl(""),
    //   // qn14: new FormControl(""),
    //   // qn15: new FormControl(""),
    //   // qn16: new FormControl(""),
    //   // qn17: new FormControl(""),
    //   // qn18: new FormControl(""),
    //   // qn19: new FormControl(""),
    //   // qn20: new FormControl(""),
    //   // qn21: new FormControl(""),
    //   // qn22: new FormControl(""),
    //   // qn23: new FormControl(""),
    //   // qn24: new FormControl(""),
    //   // qn25: new FormControl(""),
    //   // qn26: new FormControl(""),
    //   // qn27: new FormControl(""),
    //   // qn28: new FormControl(""),
    //   // qn29: new FormControl(""),
    // });

    // }
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  totalQuestionsCount = 0
  totalQnsList: any[] = []
  getAllAssessmentQns(userId: string, teamId: string) {
    this.assessmentService.getExamQns(userId, teamId).subscribe((data) => {
      console.log(data);
      this.questionList = data;
      this.totalQnsList = data;
      this.totalQuestionsCount = data.length
      console.log(this.questionList.length);

      sessionStorage.setItem(
        "fullName",
        this.questionList[0].firstName + " " + this.questionList[0].lastName
      );
      sessionStorage.setItem("email", this.questionList[0].email);
      sessionStorage.setItem("manager", this.questionList[0].manager);
      sessionStorage.setItem("teamId", this.questionList[0].teamId);
      sessionStorage.setItem("team", this.questionList[0].team);
      sessionStorage.setItem("empCode", this.questionList[0].empCode);
      sessionStorage.setItem("level", "L1");


      //Calculating time based on questions
      //let say, 1 min for each qn
      this.timeLeft = this.questionList.length * 60;

      //Load General questionList
      this.questionList.forEach((element: any, index: any) => {
        // if (index < 5) this.generalQnList.push(element);
        if (index < this.genQnsCountFromBK) this.generalQnList.push(element);
      });

      let techQnlist = this.questionList
      this.technicalQnList = techQnlist.splice(this.genQnsCountFromBK, this.techQnsCountFromBK)

      //Load technicalQnList
      // techQnlist.forEach((element: any, index: any) => {
      //   // if (index >= 5 && index <= 29) this.technicalQnList.push(element);
      //   if (index >= this.genQnsCountFromBK && index < this.techQnsCountFromBK) this.technicalQnList.push(element);
      //   // this.technicalQnList.push(element);
      // });

      //Start the timer
      this.startTimer();
    });
  }

  progressPercentage: number = 0;
  progressColor: string = "";
  timerSec: number = 0;
  startTimer() {
    this.timerSec = 1000;
    this.interval = setInterval(() => {
      this.progressPercentage = Math.trunc((this.timeLeft / 1800) * 100);
      this.timeLeft--;
      this.progressColor = "progress-bar progress-bar-striped ";
      if (this.progressPercentage >= 50) {
        this.progressColor += "bg-success";
      } else if (this.progressPercentage < 20) {
        this.progressColor += "bg-danger";
      } else if (this.progressPercentage > 20 && this.progressPercentage < 50) {
        this.progressColor += "bg-warning";
      }
      // console.log("timeLeft: " + this.timeLeft);
      if (this.timeLeft < 1) {
        clearInterval(this.interval);
        this.showSummary();
      }
    }, this.timerSec);
  }

  answeredQn: any = [];
  onSubmit(value: boolean) {
    //alert("inside on submit method");
    this.answerArray = [];
    this.questionList.forEach((element: any) => {
      this.answerArray.push(element.answer);
    });
    this.technicalQnList.forEach((element: any) => {
      this.answerArray.push(element.answer);
    });
    this.answerValue = this.answerForm.value;
    console.log(this.answerValue);
    this.answeredQnByUser(this.answerValue);
    this.getSubmittedQnDet();
    this.saveUserReport(value);

    console.log("Original Answer: ");
    console.log(this.answerArray);
    console.log("User Answer: ");
    console.log(this.answeredQn);
    sessionStorage.clear();
  }

  //Get the answers submitted by user
  totalNoOfQns: number = 0;
  noOfQnsAnswered: number = 0;
  noOfQnsUnAnswered: number = 0;
  getSubmittedQnDet() {
    //alert("inside on get submitted qn method");
    this.totalNoOfQns = this.totalQuestionsCount;
    this.noOfQnsUnAnswered = 0;
    this.noOfQnsAnswered = 0;
    this.answeredQn.forEach((element: any) => {
      element == "" ? this.noOfQnsUnAnswered++ : this.noOfQnsAnswered++;
    });

    console.log("noOfQnsUnAnswered: " + this.noOfQnsUnAnswered);
    console.log("noOfQnsAnswered: " + this.noOfQnsAnswered);

    this.evaluateQns();
  }

  totalMarkEarned: number = 0;
  totalMark: number = 0;
  evaluateQns() {
    this.totalMarkEarned = 0;
    this.totalMark = this.totalNoOfQns * 1;
    this.answerArray.forEach((element: any, index: any) => {
      console.log("index: " + index);
      console.log(this.answeredQn[index]);
      console.log(element);
      if (this.answeredQn[index] === element) {
        this.totalMarkEarned += 1;
      }
    });
  }

  reportForm: report = new report();
  isReportSave: any;
  saveUserReport(value: boolean) {
    //alert("inside on get save user report method");
    this.reportForm.noOfQuestionsAnswered = this.noOfQnsAnswered.toString();
    this.reportForm.noOfQuestionsNotAnswered =
      this.noOfQnsUnAnswered.toString();

    this.reportForm.percentage =
      Math.ceil((this.totalMarkEarned / this.totalMark) * 100).toString() +
      " %";

    // this.reportForm.status = this.totalMarkEarned > 14 ? "Pass" : "Fail";
    this.reportForm.status = this.totalMarkEarned >= this.passPercentage ? "Pass" : "Fail";

    this.reportForm.teamId = this.SS_TeamId;
    this.reportForm.totalMarks = this.totalMarkEarned.toString();
    this.reportForm.totalNoOfQuestions = this.totalMark.toString();
    this.reportForm.userId = this.SS_UserId;

    console.log(this.reportForm);

    this.exitFullscreen();

    // this.isReportSave = sessionStorage.getItem("isReportSaved");
    if (value) {
      this.reportService.addReports(this.reportForm).subscribe(
        (data) => {
          console.log(data);
          window.close();
          // this.router.navigate([]).then((result: any) => {
          //   window.open("/", "_self");
          // });
          this.isReportSave = "true";
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

  //assigning the answered qn of user in an array
  answeredQnByUser(answerValue: any) {
    //alert("inside on answer qn by user method");
    const answeredQn = [];

    const totQns = this.genQnsCountFromBK + this.techQnsCountFromBK;

    for (let i = 0; i < totQns; i++) {
      const propName = "qn" + i;
      this.answeredQn[i] = answerValue[propName];
    }

    // this.answeredQn[0] = answerValue.qn0;
    // this.answeredQn[1] = answerValue.qn1;
    // this.answeredQn[2] = answerValue.qn2;
    // this.answeredQn[3] = answerValue.qn3;
    // this.answeredQn[4] = answerValue.qn4;
    // this.answeredQn[5] = answerValue.qn5;
    // this.answeredQn[6] = answerValue.qn6;       
    // this.answeredQn[7] = answerValue.qn7;
    // this.answeredQn[8] = answerValue.qn8;
    // this.answeredQn[9] = answerValue.qn9;
    // this.answeredQn[10] = answerValue.qn10;
    // this.answeredQn[11] = answerValue.qn11;
    // this.answeredQn[12] = answerValue.qn12;
    // this.answeredQn[13] = answerValue.qn13;
    // this.answeredQn[14] = answerValue.qn14;
    // this.answeredQn[15] = answerValue.qn15;
    // this.answeredQn[16] = answerValue.qn16;
    // this.answeredQn[17] = answerValue.qn17;
    // this.answeredQn[18] = answerValue.qn18;
    // this.answeredQn[19] = answerValue.qn19;
    // this.answeredQn[20] = answerValue.qn20;
    // this.answeredQn[21] = answerValue.qn21;
    // this.answeredQn[22] = answerValue.qn22;
    // this.answeredQn[23] = answerValue.qn23;
    // this.answeredQn[24] = answerValue.qn24;
    // this.answeredQn[25] = answerValue.qn25;
    // this.answeredQn[26] = answerValue.qn26;
    // this.answeredQn[27] = answerValue.qn27;
    // this.answeredQn[28] = answerValue.qn28;
    // this.answeredQn[29] = answerValue.qn29;
  }

  showSummary() {
    let el: HTMLElement = this.completeBtn.nativeElement as HTMLElement;
    el.click();

    this.onSubmit(false);
  }
}
