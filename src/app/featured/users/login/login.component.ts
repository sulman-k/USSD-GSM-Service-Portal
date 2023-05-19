import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroupDirective,
  NgForm,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { UserService } from "./../../../core/services/users/user.service";
import { AuthService } from "./../../../core/services/authentication/auth.service";
import { AlertService } from "ngx-alerts";
import { fade } from "@app/animations";
import * as xml2js from "xml2js";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [fade],
})
export class LoginComponent implements OnInit {
  email: FormControl = new FormControl("", [Validators.required]);
  password: FormControl = new FormControl("", [Validators.required]);
  loginForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  returnUrl = "";
  submitted: boolean = false;
  error: boolean = false;
  hide: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private auth: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
    if (this.loginForm.valid) {
      console.log("s");
    }
    // Validate Token
    // if (this.auth.validateToken()) {
    //   // get return url from route parameters or default to '/home'
    //   this.returnUrl =
    //     this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
    //   this.router.navigateByUrl(this.returnUrl);
    // }
    // get return url from route parameters or default to '/'
    // this.returnUrl =
    //   this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  public onSubmit() {
    const formValues = this.loginForm.value;
    const user = {
      username: formValues.email,
      password: formValues.password,
    };

    // this.router.navigateByUrl("/dashboard");
    this.userService.login(user);

    this.userService.user$.subscribe(
      (resp) => {
        if (
          resp.scope.includes("service-admin") ||
          resp.scope.includes("service-user")
        ) {
          this.submitted = true;
          this.auth.exchangeCredentials(resp);
          this.loginForm.reset();
          this.router.navigateByUrl("/dashboard");
        } else {
          this.alertService.danger(
            "You don't have permission to access this module. Please contact administrator for to grant you access."
          );
          return;
        }
      },

      (error: any) => {
        let xml;
        const parser = new xml2js.Parser({
          strict: false,
          trim: true,
          normalizeTags: true,
          mergeAttrs: true,
        });
        if (error?.error?.error?.data) {
          parser.parseString(error.error.error.data, (err, result) => {
            let errorText =
              result["soapenv:envelope"]["soapenv:body"][0]["soapenv:fault"][0][
                "faultstring"
              ][0];
            this.alertService.danger(errorText);
          });
        } else {
          console.log("error", error);
          console.log("error", error.error.error.error_description);
          this.alertService.danger(
            error.error.error.error_description
              ? error.error.error.error_description
              : "Something Went Wrong"
          );
        }
        this.error = true;
      }
    );
  }
}
