import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@app/core/services/authentication/auth.service";
import { AllService } from "@app/core/services/stats-service/all.service";
import { AlertService } from "ngx-alerts";
import jwt_decode from "jwt-decode";
import { environment } from "@env/environment";
import { LocalStorageService } from "@core/services/local-storage";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  showFiller = true;
  units = 0;
  nameInitials: string;
  userName;
  constructor(
    private auth: AuthService,
    private router: Router,
    private allService: AllService,
    private alertService: AlertService,
    private localStore: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.fetchUsernameAndInitials();
  }
  logout() {
    localStorage.clear();

    this.auth.logout();
  }

  fetchUsernameAndInitials() {
    let data = this.localStore.getData(environment.TOKEN_KEY);
    let email: any = jwt_decode(data.data);
    email = email?.sub?.split("@");
    this.userName = email[0];

    email[0] = email[0].split("");
    email[0] = email[0].slice(0, 2);
    email[0] = email[0].join("");

    this.nameInitials = email[0];
    this.nameInitials = this.nameInitials.toUpperCase();
  }

  getProfileInfo() {
    this.allService.getProfile().subscribe(
      (response) => {
        if (!response.success) {
          return;
        }
        localStorage.setItem("userEmail", response.data.email);
        this.userName = response.data.firstname;
        response.data.firstname = response.data.firstname.split("");
        response.data.firstname = response.data.firstname.slice(0, 2);
        response.data.firstname = response.data.firstname.join("");
        this.nameInitials = response.data.firstname;
        this.nameInitials = this.nameInitials.toUpperCase();
      },
      (error) => {}
    );
  }

  profileSettings() {
    this.router.navigateByUrl("userProfile");
  }
}
