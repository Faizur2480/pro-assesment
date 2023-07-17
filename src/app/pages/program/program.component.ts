import { DOCUMENT } from '@angular/common';
import { question } from './../assessment/question';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { browserRefresh } from 'src/app/app.component';
import Swal from "sweetalert2";
import { Router } from '@angular/router';
import { AssessmentService } from '../assessment/assessment.service';
import { ReportService } from '../report/report.service';
import { NgxFullscreenDirective } from '@ultimate/ngx-fullscreen';
import { ProgService } from '../add-prog-qn/prog.service';
import { questions } from '../assessment/questions';
import { report } from '../assessment/report';
import { message } from 'src/app/common';



@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit {
  SS_UserId: any = "";
  SS_TeamId: any = "";
  htmlContent: any
  questions: any
  programQnList: question[] = [];
  editorConfig: any = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter your program here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    insertImage: '',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  browserRefresh: any;
  programForm!: FormGroup;
  startTime: any;

  constructor(
    private assessmentService: AssessmentService,
    private progService: ProgService,
    private repService: ReportService,
    private router: Router,
    private eleRef: ElementRef,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: any

  ) { }
  @ViewChild("completeBtn")
  completeBtn!: ElementRef;
  timeLeft: number = 0;
  interval: any;
  beginnerCount: any
  intermediateCount: any
  advancedCount: any

  visiblitiyHiddenCount: number = 0;
  @ViewChild("fullscreen") fullscreen!: NgxFullscreenDirective;
  @ViewChild("fullScreenBtn") fullScreenBtn!: ElementRef<HTMLElement>;
  @ViewChild("stopBtn") stopBtn!: ElementRef<HTMLElement>;

  enterFullscreen() {
    this.fullscreen.enter();
  }

  exitFullscreen() {
    this.fullscreen.exit();
  }

  ngOnInit(): void {
    sessionStorage.setItem("level", "L2");
    this.browserRefresh = browserRefresh;
    console.log("refreshed?:", browserRefresh);

    if (sessionStorage.getItem("userId") == "null") {
      this.router.navigateByUrl("/");
    }

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
    console.log(this.SS_UserId)
    this.SS_TeamId = sessionStorage.getItem("teamId");

    if (this.SS_UserId == null || this.SS_TeamId == null) {
      this.router.navigateByUrl("/");
      return;
    }

    //Initialize the question form
    this.assessmentService.getSettings().subscribe((res: any) => {
      console.log(res);
      this.beginnerCount = res[0].beginner;
      this.intermediateCount = res[0].intermediate;
      this.advancedCount = res[0].advanced

      const totQns = this.beginnerCount + this.intermediateCount + this.advancedCount;

      this.programForm = this.formBuilder.group({});
      for (let index = 0; index < totQns; index++) {
        const controlName = `qn${index}`;
        this.programForm.addControl(controlName, new FormControl(""));
      }

      //assigning questions
      this.getprogramQns( this.SS_TeamId,this.SS_UserId);

      //Click fullscreen button through native element
      let el: HTMLElement = this.fullScreenBtn.nativeElement;
      el.click();
    });

    // const totQns = this.programQnList.length;
    console.log(this.programForm)
    //Calculating time for questions
    var countOfA = 0, countOfB = 0, countOfI = 0
    var timeForA = 0, timeForB = 0, timeForI = 0
    for (var i = 0; i < this.programQnList.length; i++) {
      if (this.programQnList[i].programLevel == "B") {
        countOfB = countOfB + 1;
      } else if (this.programQnList[i].programLevel == "I") {
        countOfI = countOfI + 1;
      } else if (this.programQnList[i].programLevel == "A") {
        countOfA = countOfA + 1;
      }
    }
    if (countOfB != 0) {
      timeForB = countOfB * 900;
    }
    if (countOfI != 0) {
      timeForI = countOfI * 1800;
    }
    if (countOfA != 0) {
      timeForA = countOfA * 2700;
    }
    this.timeLeft = timeForA + timeForB + timeForI;

    // time starting here
    this.startTimer();
  }
  getprogramQns(teamId: string, userId: string) {
    this.progService.getProgramQns(teamId, userId).subscribe((data) => {
      console.log(data);
      this.programQnList = data
      sessionStorage.setItem(
        "fullName",
        this.programQnList[0].firstName + " " + this.programQnList[0].lastName
      );
      sessionStorage.setItem("team", this.programQnList[0].team);
      sessionStorage.setItem("email", this.programQnList[0].email);
      sessionStorage.setItem("manager", this.programQnList[0].manager);
      sessionStorage.setItem("empCode", this.programQnList[0].empCode);
      sessionStorage.setItem("level", "L2");

      var countB = 0
      var countI = 0
      var countA = 0

      var timeB = 0
      var timeA = 0
      var timeI = 0
      for (var i = 0; i < data.length; i++) {
        if (data[i].programLevel == "B") {
           countB = countB + 1;
        } else if (data[i].programLevel == "I") {
          countI = countI + 1;
        } else if (data[i].programLevel == "A") {
          countA = countA + 1;
        }
      }
      if (countB != 0) {
        timeB = countB * 900;
      }
      if (countI != 0) {
        timeI = countI * 1800;
      }
      if (countA != 0) {
        timeA = countA * 2700;
      }
      this.timeLeft = timeA + timeB + timeI;
      console.log(this.timeLeft)
      // time starting here
      this.startTimer();
    });
  }
  stopTimer() {
    clearInterval(this.interval);
  }
  timerSec: number = 0;
  progressPercentage: number = 0;
  progressColor: string = "";
  // startTimer() {
  //   this.timerSec = 1000;
  //   this.interval = setInterval(() => {
  //     this.progressPercentage = Math.trunc((this.timeLeft / 1800) * 100);
  //     this.timeLeft--;
  //     this.progressColor = "progress-bar progress-bar-striped ";
  //     if (this.progressPercentage >= 50) {
  //       this.progressColor += "bg-success";
  //     } else if (this.progressPercentage < 20) {
  //       this.progressColor += "bg-danger";
  //     } else if (this.progressPercentage > 20 && this.progressPercentage < 50) {
  //       this.progressColor += "bg-warning";
  //     }
  //     console.log("timeLeft: " + this.timeLeft);
  //     if (this.timeLeft < 1) {
  //       clearInterval(this.interval);
  //     }
  //   }, this.timerSec);
  // }
  minEndTime = 0 // 15mins = 900 sec
  enableEndBtn: boolean = true
  startTimer() {
    const targetDuration = 1800; // Target duration in seconds
    const intervalDuration = 2000; // Interval duration in milliseconds
    this.minEndTime = this.timeLeft - 60

    this.progressPercentage = Math.trunc((this.timeLeft / targetDuration) * 100);
    this.progressColor = "progress-bar progress-bar-striped ";

    if (this.progressPercentage >= 50) {
      this.progressColor += "bg-success";
    } else if (this.progressPercentage < 20) {
      this.progressColor += "bg-danger";
    } else if (this.progressPercentage > 20 && this.progressPercentage < 50) {
      this.progressColor += "bg-warning";
    }

    this.interval = setInterval(() => {
      this.timeLeft--;
      this.progressPercentage = Math.trunc((this.timeLeft / targetDuration) * 100);

      console.log("timeLeft: " + this.timeLeft);


      // if (this.timeLeft == this.minEndTime) {
      //   this.enableEndBtn = true
      // }
      if (this.timeLeft < 1) {
        clearInterval(this.interval);
        this.onSubmit(true)
      }
    }, intervalDuration);
  }


  answerValue: any;
  answerList: any[] = []
  progReport: report = new report();

  onSubmit(value: boolean) {
    //alert("inside on submit method");
    Swal.fire({
      title: "Do you want to end the test?",
      showDenyButton: false,
      showCancelButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.answerValue = this.programForm.value;
        console.log(this.answerValue);
    
        let index = 0;
        for (let key in this.answerValue) {
          var progReport = { question: "", answer: "", level: "", userId: 0, teamId: 0 };
          if (this.answerValue.hasOwnProperty(key)) {
            const value = this.answerValue[key];
    
            console.log(key, value);
            progReport.question = this.programQnList[index].program
            progReport.answer = value
            progReport.level = this.programQnList[index].programLevel
            progReport.userId = this.SS_UserId
            progReport.teamId = this.SS_TeamId
          }
          this.answerList.push(progReport)
          index++;
        }
        console.log(this.answerList)
        this.saveUserReport(value);
    
        sessionStorage.clear();
      }else{
        return;
      }
    });
    
  }
  reportForm: report = new report();
  saveUserReport(value: boolean) {

    // this.reportForm.status = this.totalMarkEarned > 14 ? "Pass" : "Fail";
    // this.reportForm.question = this.answerValue.

    // this.reportForm.teamId = this.SS_TeamId;
    // this.reportForm.totalMarks = this.totalMarkEarned.toString();
    // this.reportForm.totalNoOfQuestions = this.totalMark.toString();
    // this.reportForm.userId = this.SS_UserId;

    // console.log(this.reportForm);

    // this.exitFullscreen();

    // // this.isReportSave = sessionStorage.getItem("isReportSaved");
    // if (value) {
    this.repService.addProgReports(this.answerList).subscribe(
      (data) => {
        console.log(data);
         window.close();
        // this.router.navigate([]).then((result: any) => {
        //   window.open("/", "_self");
        // });
        // this.isReportSave = "true";
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
    // }
  }

}
