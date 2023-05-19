import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { LocalStorageService } from "@core/services/local-storage";
import { finalize } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../authentication/auth.service";
import { LoaderServiceService } from "@app/loader-service.service";

@Injectable({
  providedIn: "root",
})
export class PreRequestService implements HttpInterceptor {
  secretToken = "";

  constructor(
    private authService: AuthService,
    private localStore: LocalStorageService,
    private loaderService: LoaderServiceService
  ) {}

  // function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log("In interceptor");

    this.loaderService.show();

    if (request.url.endsWith("/token") && request.method === "POST") {
      request = request.clone({
        headers: request.headers.set(
          "Authorization",
          `Basic ${environment.CONSUMER_KEY_SECRET}`
        ),
      });

      request = request.clone({
        headers: request.headers.set(
          "Content-Type",
          `application/x-www-form-urlencoded`
        ),
      });

      // request = request.clone({
      //   url: request.url.replace("http://", "https://"),
      // });
    } else {
      this.secretToken = this.getToken();
      request = request.clone({
        headers: request.headers.set(
          "Authorization",
          `Bearer ${this.secretToken}`
        ),
      });
    }

    if (request.url.toString().includes("net/1")) {
      request = request.clone({
        headers: request.headers.set("SOAPAction", ``),
        responseType: "text",
      });
    }

    if (request.url.toString().includes("download-")) {
      request = request.clone({
        responseType: "blob",
      });
    }

    return next.handle(request).pipe(finalize(() => this.loaderService.hide()));
  }

  getToken() {
    const token: any = this.localStore.getData(environment.TOKEN_KEY);
    const tokenExpiryTime: any = this.localStore.getData(
      environment.EXPIRE_IN_KEY
    );
    console.log("Token Expiry:", tokenExpiryTime);
    if (
      tokenExpiryTime.success &&
      new Date(Number(tokenExpiryTime.data)).getTime() > new Date().getTime()
    ) {
      return token && token.success ? token.data : null;
    } else {
      this.authService.logout();
    }
  }
}
