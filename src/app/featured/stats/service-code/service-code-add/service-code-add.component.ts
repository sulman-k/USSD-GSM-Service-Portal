import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AllService } from "../../../../core/services/stats-service/all.service";
import { AlertService } from "ngx-alerts";
import { Observable } from "rxjs";
import { fadeSlideInOut } from "@app/animations";
import { StringValidator } from "@app/shared/validators/string.validators";
import { MatDialog } from "@angular/material/dialog";
import { DraftModalComponent } from "@app/shared/draft-modal/draft-modal.component";
import { map, startWith } from "rxjs/operators";
import {
  Options,
  LabelType,
  NgxSliderModule,
} from "@angular-slider/ngx-slider";

@Component({
  selector: "app-service-code-add",
  templateUrl: "./service-code-add.component.html",
  styleUrls: ["./service-code-add.component.css"],
  animations: [fadeSlideInOut],
})
export class ServiceCodeAddComponent implements OnInit {
  addEditServiceChecker: boolean = false;
  displayLoader: boolean = false;
  serviceCodeForm: FormGroup;
  state$: Observable<object>;
  historyData;
  serviceConfig = [];
  prefixService: any;
  showEsmeDropdown = false;
  showProtocolDropDown = true;
  hide: boolean = true;
  treeExistMaintainer = false;
  addresses!: FormArray;
  addressForm: FormGroup;
  numOfFiles = 1;
  previous_option_pattern = "^[0-9]+$|^\\*{1}$|^\\#{1}$";

  constructor(
    private formBuilder: FormBuilder,
    private allService: AllService,
    private alert: AlertService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  @ViewChild("slider") myNameElem: ElementRef;
  short_code: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(
      history.state.checker
        ? /^\*[0-9]+\*[0-9]+\#$/
        : /^(\*|\#)[0-9]+([\*]+[0-9]+)*(\#|\*)$/
    ),
  ]);
  patternText = "Must start with */# and end with */#.";
  is_sponsored_charging: FormControl = new FormControl(false, [
    Validators.required,
  ]);
  esme_charging_msisdn: FormControl = new FormControl(null);
  title: FormControl = new FormControl("", [
    Validators.required,
    StringValidator.noAllSpaces,
  ]);
  description: FormControl = new FormControl("", [
    Validators.required,
    StringValidator.noAllSpaces,
  ]);
  action_id: FormControl = new FormControl("", [Validators.required]);
  is_chargable: FormControl = new FormControl(false, [Validators.required]);
  optional_sms: FormControl = new FormControl(false, [Validators.required]);
  has_menu: FormControl = new FormControl(false, [Validators.required]);
  charge_type: FormControl = new FormControl(null);
  total_slices: FormControl = new FormControl(null);
  amount: FormControl = new FormControl(null);
  parent_id: FormControl = new FormControl(0, [Validators.required]);
  session_timeout: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("^[0-9]+$"),
  ]);
  previous_option: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.previous_option_pattern),
  ]);
  sms_text: FormControl = new FormControl(null);
  is_bank_short_code: FormControl = new FormControl(false, [
    Validators.required,
  ]);
  is_string_based_charging: FormControl = new FormControl(false, [
    Validators.required,
  ]);
  is_sms_mo: FormControl = new FormControl(false, [Validators.required]);

  esme_protocol: FormControl = new FormControl("", [Validators.required]);

  disable: boolean = false;
  consent_menu: FormControl = new FormControl(null);
  consent_lifetime: FormControl = new FormControl(null);
  bank_id: FormControl = new FormControl(null);
  bank_api_url: FormControl = new FormControl(null);

  authentication_api_url: FormControl = new FormControl(null);
  bank_user_name: FormControl = new FormControl(null);
  bank_password: FormControl = new FormControl(null);
  sms_number: FormControl = new FormControl(" ", [Validators.required]);
  sms_number_text: FormControl = new FormControl(" ", [Validators.required]);
  // is_group_consent: FormControl = new FormControl(false, [Validators.required]);
  // group_name: FormControl = new FormControl(0, [Validators.required]);
  group_type: FormControl = new FormControl(0, [Validators.required]);
  authentication_method: FormControl = new FormControl(" ", [
    Validators.required,
  ]);

  fixed: FormControl = new FormControl(true);
  relative: FormControl = new FormControl(false);
  radioButtons: FormControl = new FormControl(true);
  executeFunctionChecker: boolean = true;
  is_sensitive: FormControl = new FormControl(false, [Validators.required]);
  filteredOptions: Observable<any[]>;
  slice_interval: any[] = [];
  // new_group_name: string = "";
  showModal: boolean = false;

  chargable_types = [
    { name: "Session Based", value: 1 },
    { name: "Event Based", value: 2 },
    { name: "Time Based", value: 3 },
  ];

  group_type_selection = [
    { type_name: "Short code for self", value: "For each" },
    { type_name: "Short code for group", value: "For group" },
    { type_name: "Short code for all", value: "For all" },
  ];

  authentication_method_selection = ["JWT", "None"];

  groups_name_selection = [];

  protocolNames: any = [
    { id: 1, name: "SMPP" },
    { id: 2, name: "HTTP/HTTPS" },
    { id: 3, name: "SMS" },
  ];
  minValue: number = 0;
  maxValue: number = 10;
  options: Options = {
    floor: 0,
    ceil: 60,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value.toString();
        case LabelType.High:
          return value.toString();
        default:
          return value.toString();
      }
    },
  };
  // radioButtons = "fixed";
  heading = "Add new service";
  buttonText = "Add Service Code";
  esmes;

  ngOnInit(): void {
    this.historyData = history.state.name;
    this.form();
    this.defaultOptions();
  }

  getServiceCodeGroups() {
    this.allService.getServiceCodeGroups().subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.groups_name_selection = res.data;
        }
      },
      error(e) {},
    });
  }

  authenticationMethodChange() {
    if (this.serviceCodeForm.value.authentication_method == "None") {
      this.serviceCodeForm.controls["bank_password"].setValue(" ");
      this.serviceCodeForm.controls["bank_user_name"].setValue(" ");
      this.serviceCodeForm.controls["authentication_api_url"].setValue(" ");
    } else {
      this.serviceCodeForm.controls["bank_password"].setValue(null);
      this.serviceCodeForm.controls["bank_user_name"].setValue(null);
      this.serviceCodeForm.controls["authentication_api_url"].setValue(null);
    }
  }

  defaultOptions() {
    this.minValue = 0;
    this.maxValue = 10;
    this.options = {
      floor: 0,
      ceil: 60,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return value.toString();
          case LabelType.High:
            return value.toString();
          default:
            return value.toString();
        }
      },
    };
  }
  displayFn(user): string {
    return user && user.esme_name ? user.esme_name : "";
  }

  private _filter(value: string): string[] {
    let filterValue = value.toLowerCase();

    return this.esmes.filter((option) =>
      option.esme_name.toLowerCase().includes(filterValue)
    );
  }

  _keydown(event: any) {
    if (
      !(
        /(^[0-9]+|^\*|^\#)$/.test(event.key) ||
        event.key == "Tab" ||
        event.key == "Backspace"
      )
    ) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  form() {
    this.serviceCodeForm = this.formBuilder.group({
      short_code: this.short_code,
      title: this.title,
      description: this.description,
      is_chargable: this.is_chargable,
      has_menu: this.has_menu,
      charge_type: this.charge_type,
      total_slices: this.total_slices,
      amount: this.amount,
      action_id: this.action_id,
      parent_id: this.parent_id,
      session_timeout: this.session_timeout,
      previous_option: this.previous_option,
      sms_text: this.sms_text,
      fixed: this.fixed,
      relative: this.relative,
      radioButtons: this.radioButtons,
      is_bank_short_code: this.is_bank_short_code,
      consent_menu: this.consent_menu,
      consent_lifetime: this.consent_lifetime,
      bank_id: this.bank_id,
      bank_api_url: this.bank_api_url,
      is_sponsored_charging: this.is_sponsored_charging,
      optional_sms: this.optional_sms,
      esme_charging_msisdn: this.esme_charging_msisdn,

      authentication_api_url: this.authentication_api_url,
      bank_user_name: this.bank_user_name,
      bank_password: this.bank_password,
      esme_protocol: this.esme_protocol,
      sms_number: this.sms_number,
      sms_number_text: this.sms_number_text,
      is_sensitive: this.is_sensitive,
      // is_group_consent: this.is_group_consent,
      group_type: this.group_type,
      is_string_based_charging: this.is_string_based_charging,
      authentication_method: this.authentication_method,
      is_sms_mo: this.is_sms_mo,
      // group_name: this.group_name,
    });
    this.serviceCodeForm.controls["sms_text"].setValue(null);
    this.serviceCodeForm.controls["is_sponsored_charging"].disable();
    //if adding sub service of existing service
    if (this.historyData == "subService") {
      this.heading = "Add Sub Service code";
      this.buttonText = "Add sub service";
      this.patternText = "Correct format *xxx*xxxxxxxx#.";
      this.patchingValuesSubService();
    }

    //while editing the service
    if (this.historyData == "editService") {
      this.addEditServiceChecker = true;
      this.heading = "Edit Service Code";
      this.patchingValues();
      this.updateFieldHistory(history.state.data.esme_protocol);
      this.radioButtonsCheck();
      this.serviceCodeForm.controls["esme_protocol"].setValue(
        history.state.data.esme_protocol
      );
      this.serviceCodeForm.controls["optional_sms"].setValue(
        history.state.data.optional_sms
      );
      this.serviceCodeForm.controls["sms_text"].setValue(
        history.state.data.sms_text
      );

      this.checkRadio(this.serviceCodeForm.getRawValue().radioButtons);
      this.bankingHistory(
        this.serviceCodeForm.getRawValue().is_bank_short_code
      );
      this.onCheckBox2(this.serviceCodeForm.getRawValue().has_menu);
      this.chargeableHistory(this.serviceCodeForm.getRawValue().is_chargable);
      this.update_sponsored();
      // if (history.state.data.is_group_consent) {
      //   this.getServiceCodeGroups();
      // }

      if (
        history.state.data.is_whitelist == 1 ||
        history.state.data.is_normal == 1
      ) {
        this.executeFunctionChecker = false;
        this.treeExistMaintainer = true;
        this.disableFields();
      }
      this.serviceCodeForm.get("short_code").disable();
    }
  }

  disableFields() {
    this.serviceCodeForm.controls["is_bank_short_code"].disable();
    this.serviceCodeForm.controls["has_menu"].disable();
    // this.serviceCodeForm.controls["action_id"].disable();
    this.serviceCodeForm.controls["consent_menu"].disable();
    this.serviceCodeForm.controls["consent_lifetime"].disable();
    this.serviceCodeForm.controls["bank_id"].disable();
    this.serviceCodeForm.controls["bank_api_url"].disable();
    this.serviceCodeForm.controls["authentication_api_url"].disable();
    this.serviceCodeForm.controls["bank_user_name"].disable();
    this.serviceCodeForm.controls["bank_password"].disable();
    this.serviceCodeForm.controls["is_string_based_charging"].disable();
    this.serviceCodeForm.controls["is_sms_mo"].disable();
    //this.serviceCodeForm.controls["is_bank_short_code"].disable()
    this.disable = true;
  }

  bankingHistory(value) {
    if (value == true) {
      this.serviceCodeForm.controls["has_menu"].setValue(false);
      this.serviceCodeForm.controls["has_menu"].setErrors(null);
      this.showProtocolDropDown = true;
      this.showEsmeDropdown = true;
      this.serviceCodeForm.controls["consent_menu"].setValidators(
        Validators.required
      );

      this.serviceCodeForm.controls["consent_lifetime"].setValidators([
        Validators.required,
        Validators.pattern("^[0-9]+$"),
      ]);

      this.serviceCodeForm.controls["bank_id"].setValidators([
        Validators.required,
        Validators.pattern("^[0-9]+$"),
      ]);

      this.serviceCodeForm.controls["bank_api_url"].setValidators(
        Validators.required
      );

      this.serviceCodeForm.controls["authentication_api_url"].setValidators(
        Validators.required
      );

      this.serviceCodeForm.controls["bank_user_name"].setValidators(
        Validators.required
      );

      this.serviceCodeForm.controls["bank_password"].setValidators(
        Validators.required
      );
    } else {
      // this.serviceCodeForm.controls["fixed"].setValue(false);
      // this.serviceCodeForm.controls["relative"].setValue(false);

      // this.serviceCodeForm.controls["has_menu"].enable();

      // this.showEsmeDropdown = true;
      this.showProtocolDropDown = true;

      this.serviceCodeForm.controls["consent_menu"].setValue(null);
      this.serviceCodeForm.controls["consent_menu"].setErrors(null);

      this.serviceCodeForm.controls["consent_lifetime"].setValue(null);
      this.serviceCodeForm.controls["consent_lifetime"].setErrors(null);

      this.serviceCodeForm.controls["bank_id"].setValue(null);
      this.serviceCodeForm.controls["bank_id"].setErrors(null);

      this.serviceCodeForm.controls["bank_api_url"].setValue(null);
      this.serviceCodeForm.controls["bank_api_url"].setErrors(null);

      this.serviceCodeForm.controls["authentication_api_url"].setValue(null);
      this.serviceCodeForm.controls["authentication_api_url"].setErrors(null);

      this.serviceCodeForm.controls["bank_user_name"].setValue(null);
      this.serviceCodeForm.controls["bank_user_name"].setErrors(null);

      this.serviceCodeForm.controls["bank_password"].setValue(null);
      this.serviceCodeForm.controls["bank_password"].setErrors(null);

      this.serviceCodeForm.controls["has_menu"].setValidators(
        Validators.required
      );
    }
  }

  onCheckBox2(value) {
    if (!this.serviceCodeForm.value.is_bank_short_code) {
      if (value == true) {
        this.showProtocolDropDown = false;
        this.showEsmeDropdown = false;
      } else {
        this.showProtocolDropDown = true;
        this.showEsmeDropdown = true;
      }
    }
  }

  checkSubService() {
    if (this.historyData == "subService") {
      if (
        !this.serviceCodeForm.value.short_code.includes(
          history.state.data.short_code.replace(/#$/, "*")
        )
      ) {
        this.serviceCodeForm.controls["short_code"].setValue(
          history.state.data.short_code.replace(/#$/, "*")
        );
      }
    }
  }

  patchingValues() {
    this.serviceCodeForm.patchValue({
      short_code: history.state.data.short_code,
      // subServiceCode: "*12345*45#",
      title: history.state.data.code_title,
      description: history.state.data.code_description,
      total_slices:
        history.state.data.total_slices == null
          ? 0
          : history.state.data.total_slices,
      is_chargable:
        history.state.data.is_chargable == 1
          ? (history.state.data.is_chargable = true)
          : false,
      has_menu:
        history.state.data.has_menu == 1
          ? (history.state.data.has_menu = true)
          : false,
      charge_type:
        history.state.data.charge_type == 3
          ? this.checkEditChargeableTypes()
          : history.state.data.is_chargable == 0
          ? 0
          : history.state.data.charge_type,
      amount:
        history.state.data.is_chargable == 0 ? 0 : history.state.data.amount,
      esme_charging_msisdn: history.state.data.esme_charging_msisdn,
      action_id: history.state.data.action_id,

      parent_id: history.state.data.id,
      session_timeout: history.state.data.session_timeout / 1000,
      previous_option: history.state.data.previous_option,
      fixed:
        history.state.data.fixed == 1
          ? (history.state.data.fixed = true)
          : false,
      relative:
        history.state.data.relative == 1
          ? (history.state.data.relative = true)
          : false,
      is_bank_short_code:
        history.state.data.is_bank_short_code == 1
          ? (history.state.data.is_bank_short_code = true)
          : false,
      consent_menu: history.state.data.consent_menu,
      consent_lifetime: history.state.data.consent_lifetime,
      bank_id: history.state.data.bank_id,
      bank_api_url: history.state.data.bank_api_url,
      sms_number: history.state.data.sms_number,
      sms_number_text: history.state.data.sms_number_text,
      authentication_api_url: history.state.data.authentication_api_url,
      bank_user_name: history.state.data.bank_user_name,
      bank_password: history.state.data.bank_password,
      esme_protocol: history.state.data.esme_protocol,
      is_sponsored_charging:
        history.state.data.is_sponsored_charging == 1
          ? (history.state.data.is_sponsored_charging = true)
          : false,
      is_sensitive: history.state.data.is_sensitive == 1 ? true : false,
      group_type: history.state.data.group_type,
      is_string_based_charging:
        history.state.data.is_string_based_charging == 1 ? true : false,
      authentication_method: history.state.data.authentication_method,
      is_sms_mo: history.state.data.is_sms_mo == 1 ? true : false,
    });
  }

  findDropdownName(ID) {
    let id = this.esmes.filter((findID) => {
      return findID.esme_id == ID;
    });

    return id[0].esme_name;
  }

  checkIsStringBasedCharging(event) {
    if (event.checked) {
      this.serviceCodeForm.controls["has_menu"].setValue(false);
      this.serviceCodeForm.controls["is_chargable"].setValue(false);
      this.serviceCodeForm.controls["is_bank_short_code"].setValue(false);
      this.chargeable(false);
      this.banking(false);
      this.onCheckBox(false);
    } else {
      // do nothing
    }
  }

  checkIsSmsMo(event) {
    if (event.checked) {
      this.onCheckBox(false);
      this.banking(false);
      this.serviceCodeForm.controls["has_menu"].setValue(false);
      this.serviceCodeForm.controls["is_bank_short_code"].setValue(false);
      this.serviceCodeForm.controls["is_string_based_charging"].setValue(false);
      this.serviceCodeForm.controls["esme_protocol"].setValue(0);
      this.serviceCodeForm.controls["action_id"].setValue(0);
    } else {
    }
  }

  setIntervalFieldValues() {
    for (let i = 0; i < this.slice_interval.length; i++) {
      (<HTMLInputElement>document.getElementById("amount" + (i + 1))).value =
        this.slice_interval[i].amount;
    }
  }

  patchingValuesSubService() {
    this.serviceCodeForm.patchValue({
      short_code: history.state.data.short_code.replace(/#$/, "*"),
      // subServiceCode: "*12345*45#",
      parent_id: history.state.data.id,
    });
  }

  getHttpSmppConfig(id) {
    this.allService.getHttpSmppConf(id).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          if (res.data.data.length > 0) {
            this.esmes = res.data.data;
          }
        }
      },
      error(e) {},
    });
  }

  updateFieldHistory(esme_protocol) {
    if (esme_protocol != null) {
      this.getHttpSmppConfig(esme_protocol);
    }
  }

  updateField(value) {
    this.esmes = [];

    if (value == 1) {
      this.showEsmeDropdown = true;
      this.serviceCodeForm.controls["action_id"].setValue(null);
      this.serviceCodeForm.controls["sms_number"].setValue(" ");
      this.serviceCodeForm.controls["sms_number_text"].setValue(" ");
      this.getHttpSmppConfig(value);
    } else if (value == 2) {
      this.showEsmeDropdown = true;
      this.serviceCodeForm.controls["action_id"].setValue(null);
      this.serviceCodeForm.controls["sms_number"].setValue(" ");
      this.serviceCodeForm.controls["sms_number_text"].setValue(" ");
      this.getHttpSmppConfig(value);
    } else if (value == 3) {
      this.showEsmeDropdown = false;
      this.serviceCodeForm.controls["sms_number"].setValue(null);
      this.serviceCodeForm.controls["sms_number_text"].setValue(null);
      this.serviceCodeForm.controls["action_id"].setValue(0);
    } else {
      this.showEsmeDropdown = false;
    }
  }

  onCheckBox(value) {
    if (!this.disable) {
      if (!this.serviceCodeForm.value.is_bank_short_code) {
        if (value == true) {
          this.serviceCodeForm.controls["action_id"].setValue(0);
          this.serviceCodeForm.controls["action_id"].setErrors(null);
          this.serviceCodeForm.controls["esme_protocol"].setValue(0);
          this.serviceCodeForm.controls["esme_protocol"].setErrors(null);
          this.serviceCodeForm.controls["sms_number"].setValue(" ");
          this.serviceCodeForm.controls["sms_number_text"].setValue(" ");
          // this.serviceCodeForm.value.has_menu =
          //   !this.serviceCodeForm.value.has_menu;
          this.showProtocolDropDown = false;
          this.showEsmeDropdown = false;
        } else {
          this.showProtocolDropDown = true;
          this.serviceCodeForm.controls["action_id"].setValue(null);
          this.serviceCodeForm.controls["esme_protocol"].setValue(null);
        }
      }
    }
  }

  banking(value) {
    if (!this.disable) {
      if (value == true) {
        this.serviceCodeForm.controls["group_type"].setValue(null);
        this.serviceCodeForm.controls["has_menu"].setValue(false);
        this.serviceCodeForm.controls["has_menu"].disable();
        this.serviceCodeForm.controls["has_menu"].setErrors(null);
        this.serviceCodeForm.controls["esme_protocol"].setValue(null);
        this.serviceCodeForm.controls["authentication_method"].setValue("JWT");

        // this.serviceCodeForm.controls["action_id"].setValue("null");
        // this.serviceCodeForm.controls["action_id"].setErrors(null);
        // this.showEsmeDropdown = false;
        this.showProtocolDropDown = true;

        this.serviceCodeForm.controls["esme_protocol"].setValidators(
          Validators.required
        );

        this.serviceCodeForm.controls["consent_menu"].setValidators(
          Validators.required
        );

        this.serviceCodeForm.controls["consent_lifetime"].setValidators([
          Validators.min(0),
          Validators.required,
        ]);

        this.serviceCodeForm.controls["bank_id"].setValidators([
          Validators.required,
          Validators.pattern("^[0-9]+$"),
        ]);

        this.serviceCodeForm.controls["bank_api_url"].setValidators(
          Validators.required
        );

        this.serviceCodeForm.controls["authentication_api_url"].setValidators(
          Validators.required
        );

        this.serviceCodeForm.controls["bank_user_name"].setValidators(
          Validators.required
        );
        // this.serviceCodeForm.controls["bank_user_name"].setValidators(
        //   [ Validators.required,Validators.pattern('^[a-z A-Z _ .]+$')]
        //  );
        this.serviceCodeForm.controls["bank_password"].setValidators(
          Validators.required
        );
      } else {
        this.serviceCodeForm.controls["group_type"].setValue(0);
        this.serviceCodeForm.controls["authentication_method"].setValue(" ");
        // this.serviceCodeForm.controls["group_name"].setValue(0);
        // this.serviceCodeForm.controls["fixed"].setValue(false);
        // this.serviceCodeForm.controls["relative"].setValue(false);
        // if (!this.serviceCodeForm.controls.is_sponsored_charging.value) {
        //   this.serviceCodeForm.controls["has_menu"].enable();
        // }
        // this.serviceCodeForm.controls["has_menu"].enable();

        // this.showEsmeDropdown = true;
        this.showProtocolDropDown = true;

        this.serviceCodeForm.controls["consent_menu"].setValue(null);
        this.serviceCodeForm.controls["consent_menu"].setErrors(null);

        this.serviceCodeForm.controls["consent_lifetime"].setValue(null);
        this.serviceCodeForm.controls["consent_lifetime"].setErrors(null);

        this.serviceCodeForm.controls["bank_id"].setValue(null);
        this.serviceCodeForm.controls["bank_id"].setErrors(null);

        this.serviceCodeForm.controls["bank_api_url"].setValue(null);
        this.serviceCodeForm.controls["bank_api_url"].setErrors(null);

        this.serviceCodeForm.controls["authentication_api_url"].setValue(null);
        this.serviceCodeForm.controls["authentication_api_url"].setErrors(null);

        this.serviceCodeForm.controls["bank_user_name"].setValue(null);
        this.serviceCodeForm.controls["bank_user_name"].setErrors(null);

        this.serviceCodeForm.controls["bank_password"].setValue(null);
        this.serviceCodeForm.controls["bank_password"].setErrors(null);

        this.serviceCodeForm.controls["has_menu"].setValidators(
          Validators.required
        );
      }
    }
  }

  chargeableHistory(value: boolean) {
    if (value) {
      this.serviceCodeForm.controls["charge_type"].setValidators(
        Validators.required
      );
      this.serviceCodeForm.controls["total_slices"].setValidators(
        Validators.required
      );

      this.serviceCodeForm.controls["is_sponsored_charging"].enable();

      if (this.serviceCodeForm.getRawValue().has_menu == false) {
        this.showProtocolDropDown = true;
        this.showEsmeDropdown = true;
      } else {
        this.serviceCodeForm.controls["esme_protocol"].setValue(0);
      }

      this.serviceCodeForm.controls["amount"].setValidators([
        Validators.required,
        Validators.min(0),
        Validators.pattern("^[.0-9]+$"),
      ]);
    } else {
      if (this.serviceCodeForm.getRawValue().has_menu == false) {
        this.showProtocolDropDown = true;
        this.showEsmeDropdown = true;
      }
      // this.showProtocolDropDown = true;
      // this.showEsmeDropdown = true;

      // this.serviceCodeForm.controls["esme_protocol"].setValue(null);
      // this.serviceCodeForm.controls["esme_protocol"].setErrors(null);
      this.serviceCodeForm.controls["charge_type"].setValue(null);
      this.serviceCodeForm.controls["charge_type"].setErrors(null);
      this.serviceCodeForm.controls["total_slices"].setValue(0);
      this.serviceCodeForm.controls["total_slices"].setErrors(null);
      this.serviceCodeForm.controls["is_sponsored_charging"].setValue(false);
      this.serviceCodeForm.controls["is_sponsored_charging"].disable();
      this.serviceCodeForm.controls["amount"].setValue(null);
      this.serviceCodeForm.controls["amount"].setErrors(null);
      this.serviceCodeForm.controls["esme_charging_msisdn"].setErrors(null);
      this.serviceCodeForm.controls["esme_charging_msisdn"].setValidators(null);
    }
    this.update_sponsored();
  }

  chargeable(value: boolean) {
    if (value) {
      this.serviceCodeForm.controls["charge_type"].setValidators(
        Validators.required
      );
      this.serviceCodeForm.controls["total_slices"].setValidators(
        Validators.required
      );

      if (this.serviceCodeForm.getRawValue().is_sms_mo == false) {
        this.serviceCodeForm.controls["esme_protocol"].setValue(null);
      }

      this.serviceCodeForm.controls["is_sponsored_charging"].setValue(true);
      this.serviceCodeForm.controls["is_sponsored_charging"].enable();

      this.showProtocolDropDown = true;

      this.serviceCodeForm.controls["amount"].setValidators([
        Validators.required,
        Validators.min(0),
        Validators.pattern("^[.0-9]+$"),
      ]);
    } else {
      this.slice_interval = [];
      if (this.serviceCodeForm.getRawValue().has_menu == false) {
        this.showProtocolDropDown = true;
        this.showEsmeDropdown = false;

        if (this.serviceCodeForm.getRawValue().is_sms_mo == false) {
          this.serviceCodeForm.controls["esme_protocol"].setValue(null);
          this.serviceCodeForm.controls["action_id"].setValue(null);
        }
      } else {
        this.serviceCodeForm.controls["esme_protocol"].setValue(null);
        this.serviceCodeForm.controls["action_id"].setValue(null);
      }

      //    this.serviceCodeForm.controls["esme_protocol"].setErrors(null);
      this.serviceCodeForm.controls["charge_type"].setValue(null);
      this.serviceCodeForm.controls["charge_type"].setErrors(null);

      this.serviceCodeForm.controls["total_slices"].setValue(0);
      this.serviceCodeForm.controls["total_slices"].setErrors(null);

      this.serviceCodeForm.controls["is_sponsored_charging"].setValue(false);
      this.serviceCodeForm.controls["is_sponsored_charging"].disable();
      this.serviceCodeForm.controls["amount"].setValue(null);
      this.serviceCodeForm.controls["amount"].setErrors(null);
      this.serviceCodeForm.controls["esme_charging_msisdn"].setErrors(null);
      this.serviceCodeForm.controls["esme_charging_msisdn"].setValidators(null);
    }
    this.update_sponsored();
  }

  findDropdownIDs() {
    let id = this.esmes.filter((findID) => {
      return findID.esme_name == this.serviceCodeForm.getRawValue().action_id;
    });
    this.serviceCodeForm.controls["action_id"].setValue(id[0]?.esme_id);
  }

  onSubmit() {
    let formdata: any = {};
    formdata = this.serviceCodeForm.getRawValue();
    formdata.session_timeout = formdata.session_timeout * 1000;
    (formdata.slice_intervals =
      formdata.charge_type == 3 ? JSON.stringify(this.addresses.value) : []),
      this.allService.addServiceCode(formdata).subscribe(
        (res: any) => {
          if (!res.success) {
            this.alert.success(res.message);
            this.displayLoader = false;
            return false;
          }
          this.alert.success(res.message);
          this.displayLoader = false;
          this.router.navigate(["/service-code-list-view"]);
        },
        (error) => {
          if (error.error.error.message != undefined) {
            if (error.error.error.message.includes("1062")) {
              this.alert.danger("Duplicate entries are not allowed");
              this.displayLoader = false;
              return true;
            }
            this.displayLoader = false;
          }
          this.alert.danger("Something went wrong!");
          this.displayLoader = false;
        }
      );
  }

  editService() {
    // SERVICE CALL FOR POST REQUEST ON FORM SUBMISSION

    let formdata;

    formdata = this.serviceCodeForm.getRawValue();
    formdata.session_timeout = formdata.session_timeout * 1000;
    formdata.slice_intervals =
      formdata.charge_type == 3 ? JSON.stringify(this.addresses.value) : [];
    const dialogRef = this.dialog.open(DraftModalComponent, {
      data: {
        name: "editService",
        heading: "Are you sure you want to edit this service code?",
        formdata,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.displayLoader = true;
    });

    dialogRef.componentInstance.onSave.subscribe((result) => {
      this.displayLoader = false;
    });
  }

  clearForm() {
    this.router.navigateByUrl("/service-code-list-view");
  }

  checkRadio(event) {
    if (this.serviceCodeForm.value.radioButtons == true) {
      this.serviceCodeForm.controls["fixed"].setValue(true);
      this.serviceCodeForm.controls["relative"].setValue(false);
    }

    if (this.serviceCodeForm.value.radioButtons == false) {
      this.serviceCodeForm.controls["fixed"].setValue(false);
      this.serviceCodeForm.controls["relative"].setValue(true);
    }
  }

  radioButtonsCheck() {
    if (history.state.data.fixed == 1) {
      this.serviceCodeForm.controls["radioButtons"].setValue(true);
    } else if (history.state.data.relative == 1) {
      this.serviceCodeForm.controls["radioButtons"].setValue(false);
    } else {
      this.serviceCodeForm.controls["radioButtons"].setValue(null);
    }
  }
  update_sponsored() {
    if (this.serviceCodeForm.controls.is_sponsored_charging.value) {
      if (this.treeExistMaintainer == false) {
        this.serviceCodeForm.controls["has_menu"].setValue(false);
      }
      this.showProtocolDropDown = true;

      this.serviceCodeForm.controls["esme_charging_msisdn"].setValidators([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern("^[0-9]+$"),
        Validators.maxLength(16),
      ]);
    } else {
      if (
        !this.serviceCodeForm.value.is_bank_short_code &&
        this.treeExistMaintainer == false
      ) {
      }

      this.serviceCodeForm.controls["esme_charging_msisdn"].setValue(null);
      this.serviceCodeForm.controls["esme_charging_msisdn"].setValidators(null);
      this.serviceCodeForm.controls["esme_charging_msisdn"].setErrors(null);
    }
  }

  update_sms() {
    if (this.serviceCodeForm.controls.optional_sms.value) {
      this.serviceCodeForm.controls["sms_text"].setValidators([
        Validators.required,
      ]);

      this.serviceCodeForm.controls["sms_text"].setValue(null);
    } else {
      this.serviceCodeForm.controls["sms_text"].clearValidators();
      this.serviceCodeForm.controls["sms_text"].updateValueAndValidity();
      this.serviceCodeForm.controls["sms_text"].setValue(" ");
    }
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  setInterval = 0;
  currentIndex = 1;

  setOptions(setMinValue) {
    this.maxValue = setMinValue + 10;
    this.options = {
      floor: setMinValue + 1,
      ceil: 60,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return value.toString();
          case LabelType.High:
            return value.toString();
          default:
            return value.toString();
        }
      },
    };
  }

  //Slice Based Charging Implementation

  createAddress(): FormGroup {
    return this.formBuilder.group({
      minValue: new FormControl("", [
        Validators.required,
        StringValidator.noAllSpaces,
      ]),
      maxValue: new FormControl("", [
        Validators.required,
        StringValidator.noAllSpaces,
      ]),
      amount: new FormControl("", [
        Validators.required,
        StringValidator.noAllSpaces,
      ]),
    });
  }

  addAddress(count: any): void {
    this.addresses = this.addressForm.get("addresses") as FormArray;
    this.addresses.push(this.createAddress());
    this.addresses.clear();

    const fillArray = (value: number, len: number) => {
      const arr: any = [];
      for (let i = 0; i < len; i++) {
        this.addresses.push(this.createAddress());
      }
      return arr;
    };

    fillArray(2, count);
  }

  increment(value, condition) {
    if (condition == 1) {
      if (value == 3) return false;
      this.numOfFiles = ++this.numOfFiles;
      this.addAddress(value + 1);
    } else {
      if (value == 1) return false;

      this.numOfFiles = --this.numOfFiles;
      this.addAddress(value - 1);
    }
  }

  get addressControls() {
    return this.addressForm.get("addresses")["controls"];
  }

  checkChargeableTypes() {
    if (this.serviceCodeForm.value.charge_type == 3) {
      this.serviceCodeForm.controls["total_slices"].setValue(0);
      this.addressForm = this.formBuilder.group({
        addresses: this.formBuilder.array([this.createAddress()]),
      });
    } else {
      this.serviceCodeForm.controls["total_slices"].setValue(0);
      this.addressForm ? this.addressForm.valid : null;
    }
    this.slice_interval = [];
  }

  checkEditChargeableTypes() {
    this.serviceCodeForm.controls["total_slices"].setValue(0);
    this.addressForm = this.formBuilder.group({
      addresses: this.formBuilder.array([this.createAddress()]),
    });
    this.slice_interval = JSON.parse(history.state.data.slice_intervals);
    this.addAddress(this.slice_interval.length);
    this.numOfFiles = this.slice_interval.length;
    this.addresses.setValue(this.slice_interval);

    return 3;
  }
}
