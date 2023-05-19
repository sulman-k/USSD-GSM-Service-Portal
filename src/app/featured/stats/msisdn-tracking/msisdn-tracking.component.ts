import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AlertService } from "ngx-alerts";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";
import { AllService } from "@app/core/services/stats-service/all.service";

@Component({
  selector: "app-msisdn-tracking",
  templateUrl: "./msisdn-tracking.component.html",
  styleUrls: ["./msisdn-tracking.component.css"],
})
export class MsisdnTrackingComponent implements OnInit {
  sidenavOpened: boolean = true;
  displayLoader: boolean = false;
  displayedColumns: string[] = [
    "short_code",
    "code_title",
    "code_description",
    "created_by",
    "created_dt",
  ];
  dataSource: any = new MatTableDataSource();
  @ViewChild("sorter1") sorter1: MatSort;
  @ViewChild("MatPaginator") MatPaginator: MatPaginator;

  service_array = [];
  sub_service_array = [];

  constructor(
    private router: Router,
    private allService: AllService,
    private alert: AlertService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMsisdnHistory();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.MatPaginator;
    this.dataSource.sort = this.sorter1;
  }

  updateSidebar(e) {
    this.sidenavOpened = e;
  }

  getMsisdnHistory() {
    this.allService.getMsisdnHistory("21324343231").subscribe({
      next: (res: any) => {
        if (!res.success) {
          return false;
        }
      },
      error(e) {
        this.alert.success(e.message);

        console.log("Error=========>", e);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
