import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { fadeInGrow, fadeSlideInOut } from "@app/animations";
import { AllService } from "@app/core/services/stats-service/all.service";
import { DraftModalComponent } from "@app/shared/draft-modal/draft-modal.component";
import { AlertService } from "ngx-alerts";
import { ExportToCsv } from "export-to-csv";
import * as moment from "moment";

@Component({
  selector: "app-view-menus",
  templateUrl: "./view-menus.component.html",
  styleUrls: ["./view-menus.component.css"],

  animations: [fadeInGrow],
})
export class ViewMenusComponent implements OnInit {
  sidenavOpened: boolean = true;
  displayedColumns: string[] = ["short_code", "code_title", "action"];
  dataSource: any = new MatTableDataSource();
  @ViewChild("sorter1") sorter1: MatSort;
  @ViewChild("MatPaginator") MatPaginator: MatPaginator;

  displayLoader: boolean = false;

  constructor(
    private router: Router,
    private allService: AllService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMenuList();
  }

  updateSidebar(e: any) {
    this.sidenavOpened = e;
  }

  getMenuList() {
    this.allService.getMenuList().subscribe({
      next: (res: any) => {
        if (!res.success) {
          return false;
        }

        res.data = res.data.filter((el) => el.short_code !== null);
        console.log("res.data", res.data);
        this.dataSource.data = [];
        this.dataSource.data = res.data.reverse();
        this.dataSource.paginator = this.MatPaginator;
        this.dataSource.sort = this.sorter1;
      },
      error(e) {
        this.alert.danger(e.message);
        console.log("Error==============>", e);
      },
    });
  }

  viewMenu(element: any, name: any) {
    this.router.navigate(["/view-menu"], {
      state: { data: element, name: name },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadEsmeMenus() {
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      useTextFile: false,
      useBom: true,
      filename: `Menus ESMES ${moment().format("YYYY/MM/DD")}`,
      useKeysAsHeaders: true,
    };

    this.allService.downloadMenus().subscribe(
      (res) => {
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(res.data);
      },
      (error) => {
        this.alertService.danger("Something Went wrong");
      }
    );
  }

  addMenu() {
    this.router.navigate(["/menu-add"]);
  }

  deleteMenu(element, boolean) {
    let data;
    if (boolean) {
      data = {
        service_code_id: element.service_code_id,
        is_whitelist: 1,
      };
    } else {
      data = {
        service_code_id: element.service_code_id,
        is_whitelist: 0,
      };
    }

    const dialogRef = this.dialog.open(DraftModalComponent, {
      data: {
        name: "deleteMenu",
        heading: "Are you sure you want to delete this Menu?",
        data,
      },
    });
    // this.dialog.afterAllClosed.subscribe(() => this.getMenuList());

    dialogRef.afterClosed().subscribe((result) => {
      this.displayLoader = true;
      // this.getMenuList();
    });

    dialogRef.componentInstance.onSave.subscribe((result) => {
      this.displayLoader = false;
      this.getMenuList();
    });
  }
}
