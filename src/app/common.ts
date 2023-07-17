export class baseUrl {
  public static BASE_URL: string = "http://localhost:8080/api/v1/";
  // public static BASE_URL: string = "http://52.91.195.253:8080/assessment/api/v1/";
  // http://52.91.195.253:8080/assessment/
  // http://210.18.155.153:8080/api/v1/
}

export class apiKey {
  public static API_KEY: string = "h1r5pr0";
}

export class patterns {
  public static ONLY_ALPHNUMERIC_PATTERN = new RegExp("^[a-zA-Z0-9]*$");
  public static EMPCODE_PATTERN = new RegExp("^[a-zA-Z0-9]+[-][a-zA-Z0-9]+$");
  public static EMAIL_PATTERN = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
}

export class buttonValue {
  public static START_ASSESS = "Start Assessment";
  public static LOADING_ASSESS = "Loading Assessment...";
}

export class message {
  public static SOMETHING_WRONG =
    "Something went wrong. Please contact administrator";
  public static ALERT_TITLE = "Are you sure?";
  public static UPLOAD_QN_TEXT = "You want all of these questions uploaded!";
  public static CONFIRM_UPLOAD_BTN = "Yes, upload it!";
  public static INACTIVE_TEXT = "You want this question to move to inactive!";
  public static ACTIVE_TEXT = "You want this question to move to active!";
  public static DELETE_TEXT = "You won't be able to revert this!";
  public static CONFIRM_DELETE_BTN = "Yes, delete it!";
  public static CONFIRM_INACTIVE_BTN = "Yes, Move it!";
  public static CANCEL_BTN = "No, cancel!";
}

export class commonFunctions {
  //i/p - array
  //o/p - array
  public static FIND_DUPLICATES = (arr: any) => {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here.
    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  };
}

export class projectDesc {
  public static HIREPROUS =
    "This application is to improve the overall Quality of Recruitment process and reduce the manual dependencies. To make a Single Forum for all technical and non-technical capabilities to be evaluated. To have a common platform to manage the complete Recruitment process and to track progress and to identify any Kaizen points. It has a resource management module to keep track of resource status like employee code, status, project allocation, team, etc..";
  public static EPM =
    "It is an application used to track the employee Overall performance in their work and to give rating and appraisal accordingly. The Employee needs to enter their roles, performance and achievement in the portal which will be sent for review based on their performance, the rating will be given. It is an extended application of HireProUs(Internal Hiring Portal)";
  public static PRO_ASSESS = "This tool that enables employees to demonstrate their abilities by completing assessments specific to their team. Each team's leads serve as administrators and keep tabs on their performance and abilities. The business unit head will receive the overall findings and decide how best to use them."
}

export class qaLinks {
  public static HIREPROUS_QA = "http://3.82.142.185:9393/";
  public static EPM_QA = "http://3.82.142.185:9393/entryLogin";
  public static PRO_ASSESS_QA = "NIL";
}

export class prodLinks {
  public static HIREPROUS_PROD = "http://hireprous.promantus.com:9393/";
  public static EPM_PROD = "http://hireprous.promantus.com:9393/entryLogin";
  public static PRO_ASSESS_PROD = "http://52.91.195.253:4200/";
}
