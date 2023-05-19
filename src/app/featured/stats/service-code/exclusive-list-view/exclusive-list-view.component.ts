import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AllService } from "@app/core/services/stats-service/all.service";
import { DraftModalComponent } from "@app/shared/draft-modal/draft-modal.component";
import { AlertService } from "ngx-alerts";

@Component({
  selector: "app-exclusive-list-view",
  templateUrl: "./exclusive-list-view.component.html",
  styleUrls: ["./exclusive-list-view.component.css"],
})
export class ExclusiveListViewComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "short_code",
    "msisdn_pattern",
    "created_by",
    "action",
  ];
  dataSource: any = new MatTableDataSource();
  @ViewChild("sorter1") sorter1: MatSort;
  @ViewChild("MatPaginator") MatPaginator: MatPaginator;

  constructor(
    private allService: AllService,
    private alert: AlertService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getExclusiveList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.MatPaginator;
    this.dataSource.sort = this.sorter1;
  }

  getExclusiveList() {
    this.allService.getExclusiveList().subscribe(
      (res) => {
        if (!res.success) {
          console.log("Cannot fetch string based charging, please try again");
          return;
        }
        this.dataSource.data = res.data;
      },
      (error) => {
        this.alert.danger(
          "Cannot fetch string based charging, please try again"
        );
      }
    );
  }

  editString(element) {
    this.router.navigate(["/exclusive-list"], {
      state: { data: element },
    });
  }

  deleteString(element) {
    const dialogRef = this.dialog.open(DraftModalComponent, {
      data: {
        name: "deleteExclusiveList",
        heading: "Are you sure you want to delete this Exclusive list number",
        element,
      },
    });

    dialogRef.componentInstance.onSave.subscribe((result) => {
      this.getExclusiveList();
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
