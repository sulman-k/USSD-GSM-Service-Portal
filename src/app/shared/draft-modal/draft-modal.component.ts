import { Component, EventEmitter, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "ngx-alerts";
import { AllService } from "@app/core/services/stats-service/all.service";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
  selector: "app-draft-modal",
  templateUrl: "./draft-modal.component.html",
  styleUrls: ["./draft-modal.component.css"],
})
export class DraftModalComponent implements OnInit {
  isOpenDltNode: boolean = false;
  onSave = new EventEmitter();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private alertService: AlertService,
    private allservice: AllService,
    private router: Router,
    private formBuilder: FormBuilder,
    private allService: AllService,
    public dialogRef: MatDialogRef<DraftModalComponent>
  ) {
    if (this.data.flag == "dltCurrentNode") {
      this.isOpenDltNode = true;
    }
  }

  ngOnInit(): void {}
  deleteServiceConfig() {
    // Use element ID to send service call for DELETE request
    this.allService.deleteServiceConf(this.data.e.id).subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.alertService.danger(res.message);
          this.onSave.emit(res);
          return false;
        }
        this.alertService.success(res.message);
        this.onSave.emit(res);
      },
      error(e) {
        this.alertService.danger("something went wrong");
        this.onSave.emit(e);
        console.log("Error===========>", e);
      },
    });
  }

  deleteServiceCode() {
    this.allService
      .deleteServiceCode(
        this.data.e.service_id == undefined
          ? this.data.e.id
          : this.data.e.service_id,
        this.data.e.short_code
      )
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.alertService.danger(res.message);
            this.onSave.emit(res);
            return false;
          }
          this.alertService.success(res.message);
          this.onSave.emit(res);
        },
        error(e) {
          this.alert.danger(e.message);
          this.onSave.emit(e);
          console.log("Error=========>", e);
        },
      });
  }
  deleteCurrentNode() {
    this.dialogRef.close("dlt");
  }

  deleteMenu() {
    this.allService.deleteMenu(this.data.data).subscribe((res) => {
      if (!res.success) {
        this.alertService.danger("Something went Wrong");
        this.onSave.emit(res);
      }
      console.log(res.data);
      this.alertService.success("Menu Deleted Sucessfully");
      this.onSave.emit(res);
    });
  }

  deleteStringBasedCharging() {
    console.log("this.data.element", this.data.element);
    this.allService
      .deleteStringsBasedCharging(this.data.element.id)
      .subscribe((res) => {
        if (!res.success) {
          this.alertService.danger("Cannot delete string based charging");
        }
        console.log(res.data);
        this.alertService.success("String based charging deleted successfully");
        this.onSave.emit(res);
      });
  }

  deleteExclusiveList() {
    console.log("this.data.element", this.data.element);
    this.allService
      .deleteExclusiveList(this.data.element.id)
      .subscribe((res) => {
        if (!res.success) {
          this.alertService.danger("Cannot delete exclusive list");
        }
        console.log(res.data);
        this.alertService.success("Exclusive list deleted successfully");
        this.onSave.emit(res);
      });
  }

  editService() {
    this.allService
      .updateServiceCode(
        this.data.formdata,
        history.state.data.service_id == undefined
          ? history.state.data.id
          : history.state.data.service_id
      )
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.alertService.success(res.message);
            this.onSave.emit(res);
            return false;
          }
          this.alertService.success(res.message);
          this.router.navigate(["/service-code-list-view"]);
          this.onSave.emit(res);
        },
        error(e) {
          this.alertService.success("Something went wrong!");
          this.onSave.emit(e);

          console.log("Error===========>", e);
        },
      });
  }
}
