import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AllService } from "../../../../core/services/stats-service/all.service";
import { AlertService } from "ngx-alerts";
import { DraftModalComponent } from "@app/shared/draft-modal/draft-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { fadeInGrow } from "@app/animations";
import * as moment from "moment";
import { ExportToCsv } from "export-to-csv";

@Component({
  selector: "app-service-code-list-view",
  templateUrl: "./service-code-list-view.component.html",
  styleUrls: ["./service-code-list-view.component.css"],
  animations: [fadeInGrow],
})
export class ServiceCodeListViewComponent implements OnInit, AfterViewInit {
  sidenavOpened: boolean = true;
  displayLoader: boolean = false;
  displayedColumns: string[] = [
    "short_code",
    "code_title",
    "esme_name",
    "esme_protocol",
    "is_chargable",
    "is_bank_short_code",
    "created_by",
    "created_dt",
    "action",
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
    this.getServiceCodeList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.MatPaginator;
    this.dataSource.sort = this.sorter1;
  }

  updateSidebar(e) {
    this.sidenavOpened = e;
  }
  downloadUsers() {
    this.arrayToBeDownloaded();

    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      useTextFile: false,
      useBom: true,
      filename: "Service Codes",
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(this.service_array);
  }

  arrayToBeDownloaded() {
    this.service_array = this.service_array.map(function (item) {
      return {
        id: item.id,
        short_code: item.short_code,
        code_description: item.code_description,
        code_title: item.code_title,
        session_timeout: item.session_timeout,
        has_menu: item.has_menu,
        esme_name: item.esme_name,
        sms_text: item.sms_text,
        esme_charging_msisdn:
          item.esme_charging_msisdn == undefined
            ? null
            : item.esme_charging_msisdn,
        amount: item.amount == undefined ? null : item.amount,
        consent_lifetime: item.consent_lifetime,
        bank_api_url:
          item.bank_api_url == undefined ? null : item.esme_charging_msisdn,
        consent_menu: item.consent_menu,
        sms_number_text:
          item.sms_number_text == "" ? null : item.sms_number_text,
        sms_number: item.sms_number == "" ? null : item.sms_number,
        charge_type:
          item.charge_type == 0
            ? "None"
            : item.charge_type == 1
            ? "Session Based"
            : item.charge_type == 2
            ? "Event Based"
            : item.charge_type == 3
            ? "Time Based"
            : null,
        authentication_method:
          item.authentication_method == " "
            ? "None"
            : item.authentication_method,
        group_type:
          item.group_type == 0
            ? "None"
            : item.group_type == 1
            ? "Short code for self"
            : item.group_type == 2
            ? "Short code for group"
            : item.group_type == 3
            ? "Short code for all"
            : null,
        esme_protocol:
          item.esme_protocol == 1
            ? "SMPP"
            : item.esme_protocol == 2
            ? "HTTP"
            : item.esme_protocol == 3
            ? "SMS"
            : "",
        is_sensitive: item.is_sensitive,
        is_chargable: item.is_chargable == 1 ? "True" : "False",
        is_bank_short_code: item.is_bank_short_code == 1 ? "True" : "False",
        is_string_based_charging: item.is_string_based_charging,
        is_sms_mo: item.is_sms_mo,
        is_optional_sms: item.optional_sms,
        is_sponsored_charging: item.is_sponsored_charging,
        fixed: item.fixed,
        relative: item.relative,
        created_by: item.created_by,
        created_dt: moment(item.created_dt).format("DD-MMM-YYYY"),
      };
    });
  }

  getServiceCodeList() {
    this.allService.getServiceCodesList().subscribe({
      next: (res: any) => {
        if (!res.success) {
          return false;
        }
        this.changeDateFormatter(res.data);
        this.service_array = [];
        this.sub_service_array = [];
        for (let a of res.data)
          if (a.parent_id == 0) this.service_array.push(a);

        for (let a of res.data)
          if (a.parent_id !== 0) this.sub_service_array.push(a);

        this.dataSource.data = [];
        this.dataSource.data = this.service_array;
      },
      error(e) {
        this.alert.success(e.message);

        console.log("Error=========>", e);
      },
    });
  }

  changeDateFormatter(data: any[]) {
    for (let i = 0; i < data.length; i++) {
      data[i].created_dt = moment(data[i].created_dt).format(
        "MM-DD-YYYY HH:mm:ss"
      );
    }
  }

  editServiceCode(element) {
    console.log(element);
    this.router.navigate(["/service-code-add"], {
      state: { data: element, name: "editService", checker: false },
    });
  }

  editSubServiceCode(element) {
    console.log(element);
    this.router.navigate(["/service-code-add"], {
      state: { data: element, name: "editService", checker: true },
    });
  }

  openDialog(e) {
    const dialogRef = this.dialog.open(DraftModalComponent, {
      data: {
        name: "deleteService",
        heading: "Are you sure you want to delete this Service?",
        e,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.displayLoader = true;
    });
    dialogRef.componentInstance.onSave.subscribe((result) => {
      this.displayLoader = false;
      this.getServiceCodeList();
    });
  }

  addSubService(e) {
    this.router.navigate(["/service-code-add"], {
      state: { data: e, name: "subService", checker: true },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addServiceCode() {
    this.router.navigate(["/"]);
  }
}
