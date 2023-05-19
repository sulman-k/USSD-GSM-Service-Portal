import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { fadeSlideInOut } from "@app/animations";
import { AllService } from "@app/core/services/stats-service/all.service";
import { environment } from "@env/environment";
import { AlertService } from "ngx-alerts";
import { Observable } from "rxjs";
import { StringValidator } from "../../validators/string.validators";

@Component({
  selector: "app-menu-add",
  templateUrl: "./menu-add.component.html",
  styleUrls: ["./menu-add.component.css"],
  animations: [fadeSlideInOut],
})
export class MenuAddComponent implements OnInit {
  allServiceCode;
  currentTreeSelectionMaintainer;
  filteredServiceCode = [];
  cloneChecker: boolean;
  showProtocolDropDown: boolean = true;
  showEsmeDropDown = false;
  radio_Button_Checker: string;
  is_normal_model: boolean = true;
  is_whitelist_model: boolean = false;
  displayLoader: boolean = false;
  history_menu_item_text;
  history_short_code_dtmf;
  jsonStructureChangeChecker: boolean = false;
  currentUpdateParent: any;
  currentParentObject: any;
  d3TreeWidth: any = 0;
  d3TreeHeight: any = 0;
  menu_form_div: string = "block";
  sub_menu_div: string = "none";
  mainJson: any = [];
  showCurrentParent: any = "";
  currentParent: any = "";
  titleMaintainer;
  obj: any = {};
  menuForm: FormGroup;
  subMenuForm: FormGroup;
  startForm: FormGroup;
  serviceCodeId;
  serviceCodeNumber;
  subServiceCodeId;
  subServiceShortCode;
  state$: Observable<object>;
  serviceCode: FormControl = new FormControl("", [Validators.required]);
  filteredServiceCodeControl: FormControl = new FormControl(0, [
    Validators.required,
  ]);
  selectTreeType: FormControl = new FormControl(0, [Validators.required]);
  menu_title: FormControl = new FormControl("", [Validators.required]);
  menu_press_option: FormControl = new FormControl("", [
    Validators.required,
    // Validators.pattern("^[0-9]+$"),
  ]);
  menu_has_menu: FormControl = new FormControl(false, [Validators.required]);
  menu_action_id: FormControl = new FormControl("", [Validators.required]);

  menu_is_input: FormControl = new FormControl(false, [Validators.required]);
  menu_input_level: FormControl = new FormControl(0, [Validators.required]);

  sub_is_input: FormControl = new FormControl(false, [Validators.required]);
  sub_input_level: FormControl = new FormControl(0, [Validators.required]);

  sub_title: FormControl = new FormControl("", [Validators.required]);
  sub_press_option: FormControl = new FormControl("", [
    Validators.required,
    // Validators.pattern("^[0-9]+$"),
  ]);
  sub_has_menu: FormControl = new FormControl(false, [Validators.required]);
  sub_action_id: FormControl = new FormControl("", [Validators.required]);
  menu_sms_text: FormControl = new FormControl(false, [Validators.required]);
  menu_optional_sms: FormControl = new FormControl(" ", [Validators.required]);
  sub_sms_text: FormControl = new FormControl(false, [Validators.required]);
  sub_optional_sms: FormControl = new FormControl(" ", [Validators.required]);
  menu_is_chargeable: FormControl = new FormControl(false, [
    Validators.required,
  ]);
  menu_amount: FormControl = new FormControl(0, [Validators.required]);
  sub_is_chargeable: FormControl = new FormControl(false, [
    Validators.required,
  ]);

  sub_charge_type: FormControl = new FormControl(0, [Validators.required]);
  menu_charge_type: FormControl = new FormControl(0, [Validators.required]);
  menu_take_user_input: FormControl = new FormControl(false, [
    Validators.required,
  ]);
  sub_take_user_input: FormControl = new FormControl(false, [
    Validators.required,
  ]);
  menu_is_transferable: FormControl = new FormControl(false, [
    Validators.required,
  ]);
  sub_is_transferable: FormControl = new FormControl(false, [
    Validators.required,
  ]);
  menu_service_code_flow: FormControl = new FormControl(0, [
    Validators.required,
  ]);
  sub_service_code_flow: FormControl = new FormControl(0, [
    Validators.required,
  ]);

  menu_transfer_ussdString: FormControl = new FormControl("null", [
    Validators.required,
  ]);

  sub_transfer_ussdString: FormControl = new FormControl("null", [
    Validators.required,
  ]);

  menu_user_input: FormControl = new FormControl(" ", [Validators.required]);
  sub_user_input: FormControl = new FormControl(" ", [Validators.required]);

  whiteListGroupChecker: boolean = false;
  whiteListgroup = [];

  menu_esme_protocol: FormControl = new FormControl("", [Validators.required]);
  sub_esme_protocol: FormControl = new FormControl("", [Validators.required]);
  white_list_group_id: FormControl = new FormControl(0, [Validators.required]);
  sub_amount: FormControl = new FormControl(0, [Validators.required]);

  menu_is_package_code: FormControl = new FormControl(false, [
    Validators.required,
  ]);
  sub_is_package_code: FormControl = new FormControl(false, [
    Validators.required,
  ]);

  menu_package_code_text: FormControl = new FormControl(" ", [
    Validators.required,
  ]);
  sub_package_code_text: FormControl = new FormControl(" ", [
    Validators.required,
  ]);

  menu_is_3p_num: FormControl = new FormControl(false, [Validators.required]);
  sub_is_3p_num: FormControl = new FormControl(false, [Validators.required]);

  menu_is_consent: FormControl = new FormControl(false, [Validators.required]);

  sub_is_consent: FormControl = new FormControl(false, [Validators.required]);

  menu_is_sensitive: FormControl = new FormControl(false, [
    Validators.required,
  ]);

  sub_is_sensitive: FormControl = new FormControl(false, [Validators.required]);

  menu_consent_text: FormControl = new FormControl(" ", [Validators.required]);

  sub_consent_text: FormControl = new FormControl(" ", [Validators.required]);

  menu_is_root: FormControl = new FormControl(false, [Validators.required]);

  sub_is_root: FormControl = new FormControl(false, [Validators.required]);

  menu_sms_number: FormControl = new FormControl(" ", [Validators.required]);
  sub_sms_number: FormControl = new FormControl(" ", [Validators.required]);

  menu_sms_number_text: FormControl = new FormControl(" ", [
    Validators.required,
  ]);
  sub_sms_number_text: FormControl = new FormControl(" ", [
    Validators.required,
  ]);

  editWhitelistID: number = 0;
  is_whitelist_checker: boolean;
  is_normal_checker: boolean;
  forwhite;
  fornormal;
  isEditable = true;
  menuWhiteListChecker;
  shortCodeModal: string;
  serviceCodes: any = [];
  esmeConfig: any = [];
  normalflowCodes: any = [];
  normalFlowCodesDtmf: any = [];
  lengthJson;
  isUpdate: boolean = false;
  showModal: string;
  showDltModal: string;
  nodeForDlt: any = {};
  totalFields: number = 0;
  getTransferableData: any[] = [];
  formGroup: FormGroup;
  formChangesSubscription;
  enableInputValidity: boolean = true;
  @Output() outputJson: EventEmitter<any> = new EventEmitter();
  @ViewChild("form", { static: true }) ngForm: NgForm;
  chargeable_types = [
    { name: "Session Based", id: 1 },
    { name: "Event Based", id: 2 },
    { name: "Time Based", id: 3 },
  ];
  treeType: string[] = ["Normal", "WhiteList"];

  protocolNames: any = [
    { id: 1, name: "SMPP" },
    { id: 2, name: "HTTP/HTTPS" },
    { id: 3, name: "SMS" },
  ];
  counter: any = 0;

  addresses!: FormArray;
  numOfFiles = 1;
  addressForm: FormGroup;
  slice_interval = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private allService: AllService,
    private alert: AlertService
  ) {
    this.validateMenuForm();
    this.validateSubMenuForm();
    this.validateStartForm();
  }

  ngOnInit(): void {
    if (history.state.name === "editMenu") {
      this.mainJson = history.state.data.press_options;
    }

    this.lengthJson = this.mainJson.length;
    this.getCodes();
    this.getWhiteListGroups();

    this.mainJson.push({
      press_options: [],
    });
    if (!history.state.data) {
      this.showShorCodeModal();
    }
  }

  getWhiteListGroups() {
    this.allService.getWhiteListGroups().subscribe(
      (res) => {
        if (!res.success) {
          this.alert.danger("Unable to fetch white list group");
          return false;
        }
        this.whiteListgroup = res.data;
      },
      (error) => {
        this.alert.danger("Unable to fetch white list group");
      }
    );
  }

  validateStartForm() {
    this.startForm = this.fb.group({
      serviceCode: this.serviceCode,
      filteredServiceCodeControl: this.filteredServiceCodeControl,
      white_list_group_id: this.white_list_group_id,
      selectTreeType: this.selectTreeType,
    });
  }

  validateMenuForm() {
    this.menuForm = this.fb.group({
      menu_title: this.menu_title,
      menu_take_user_input: this.menu_take_user_input,
      menu_user_input: this.menu_user_input,
      menu_press_option: this.menu_press_option,
      menu_has_menu: this.menu_has_menu,
      menu_action_id: this.menu_action_id,
      menu_sms_text: this.menu_sms_text,
      menu_optional_sms: this.menu_optional_sms,
      menu_is_chargeable: this.menu_is_chargeable,
      menu_amount: this.menu_amount,
      menu_charge_type: this.menu_charge_type,
      menu_is_transferable: this.menu_is_transferable,
      menu_service_code_flow: this.menu_service_code_flow,
      menu_transfer_ussdString: this.menu_transfer_ussdString,
      menu_esme_protocol: this.menu_esme_protocol,
      menu_is_package_code: this.menu_is_package_code,
      menu_package_code_text: this.menu_package_code_text,
      menu_is_3p_num: this.menu_is_3p_num,
      menu_is_consent: this.menu_is_consent,
      menu_consent_text: this.menu_consent_text,
      menu_is_root: this.menu_is_root,
      menu_is_input: this.menu_is_input,
      menu_input_level: this.menu_input_level,
      menu_sms_number: this.menu_sms_number,
      menu_sms_number_text: this.menu_sms_number_text,
      menu_is_sensitive: this.menu_is_sensitive,
    });
  }

  validateSubMenuForm() {
    this.subMenuForm = this.fb.group({
      sub_title: this.sub_title,
      sub_take_user_input: this.sub_take_user_input,
      sub_user_input: this.sub_user_input,
      sub_press_option: this.sub_press_option,
      sub_action_id: this.sub_action_id,
      sub_has_menu: this.sub_has_menu,
      sub_sms_text: this.sub_sms_text,
      sub_optional_sms: this.sub_optional_sms,
      sub_is_chargeable: this.sub_is_chargeable,
      sub_amount: this.sub_amount,
      sub_charge_type: this.sub_charge_type,
      sub_is_transferable: this.sub_is_transferable,
      sub_service_code_flow: this.sub_service_code_flow,
      sub_transfer_ussdString: this.sub_transfer_ussdString,
      sub_esme_protocol: this.sub_esme_protocol,
      sub_is_package_code: this.sub_is_package_code,
      sub_package_code_text: this.sub_package_code_text,
      sub_is_3p_num: this.sub_is_3p_num,
      sub_is_consent: this.sub_is_consent,
      sub_consent_text: this.sub_consent_text,
      sub_is_root: this.sub_is_root,
      sub_is_input: this.sub_is_input,
      sub_input_level: this.sub_input_level,
      sub_sms_number: this.sub_sms_number,
      sub_sms_number_text: this.sub_sms_number_text,
      sub_is_sensitive: this.sub_is_sensitive,
    });
  }

  updateField(value) {
    this.esmeConfig = [];

    if (value == 1) {
      this.showEsmeDropDown = true;
      this.menuForm.controls["menu_sms_number"].setValue(" ");
      this.menuForm.controls["menu_sms_number_text"].setValue(" ");

      this.subMenuForm.controls["sub_sms_number"].setValue(" ");
      this.subMenuForm.controls["sub_sms_number_text"].setValue(" ");
      this.getEsmeConfig(value);
    } else if (value == 2) {
      this.showEsmeDropDown = true;
      this.menuForm.controls["menu_sms_number"].setValue(" ");
      this.menuForm.controls["menu_sms_number_text"].setValue(" ");
      this.subMenuForm.controls["sub_sms_number"].setValue(" ");
      this.subMenuForm.controls["sub_sms_number_text"].setValue(" ");
      this.getEsmeConfig(value);
    } else if (value == 3) {
      this.showEsmeDropDown = false;
      this.menuForm.controls["menu_action_id"].setValue(0);
      this.subMenuForm.controls["sub_action_id"].setValue(0);
      this.menuForm.controls["menu_sms_number"].setValue(null);
      this.menuForm.controls["menu_sms_number_text"].setValue(null);
      this.subMenuForm.controls["sub_sms_number"].setValue(null);
      this.subMenuForm.controls["sub_sms_number_text"].setValue(null);
    } else {
      this.showEsmeDropDown = false;
    }
  }

  menuCheck(value, checker?) {
    if (value) {
      this.showEsmeDropDown = false;
      this.menuForm.controls["menu_action_id"].setValue(0);
      this.menuForm.controls["menu_esme_protocol"].setValue(0);
      this.subMenuForm.controls["sub_action_id"].setValue(0);
      this.subMenuForm.controls["sub_esme_protocol"].setValue(0);
      this.menuForm.controls["menu_is_package_code"].setValue(false);
      this.subMenuForm.controls["sub_is_package_code"].setValue(false);
      this.menuForm.controls["menu_is_input"].setValue(false);
      this.subMenuForm.controls["sub_is_input"].setValue(false);
      this.menuForm.controls["menu_sms_number"].setValue(" ");
      this.menuForm.controls["menu_sms_number_text"].setValue(" ");
      this.subMenuForm.controls["sub_sms_number"].setValue(" ");
      this.subMenuForm.controls["sub_sms_number_text"].setValue(" ");
      this.menuForm.controls["menu_is_sensitive"].setValue(false);
      this.subMenuForm.controls["sub_is_sensitive"].setValue(false);

      this.packageCodeCheck(false);
      this.hasInputCheck(false);
    } else {
      this.menuForm.controls["menu_action_id"].setValue(null);
      this.menuForm.controls["menu_esme_protocol"].setValue(null);
      this.subMenuForm.controls["sub_action_id"].setValue(null);
      this.subMenuForm.controls["sub_esme_protocol"].setValue(null);
    }
  }

  chargeCheck(value) {
    if (value) {
      this.menuForm.controls["menu_amount"].setValue(null);
      this.menuForm.controls["menu_charge_type"].setValue(null);

      this.subMenuForm.controls["sub_amount"].setValue(null);
      this.subMenuForm.controls["sub_charge_type"].setValue(null);
      return;
    }

    this.menuForm.controls["menu_amount"].setValue(0);
    this.menuForm.controls["menu_charge_type"].setValue(0);
    this.subMenuForm.controls["sub_amount"].setValue(0);
    this.subMenuForm.controls["sub_charge_type"].setValue(0);
  }

  messageCheck(value) {
    if (value) {
      this.menuForm.controls["menu_optional_sms"].setValue(null);
      this.subMenuForm.controls["sub_optional_sms"].setValue(null);
      return;
    }
    this.menuForm.controls["menu_optional_sms"].setValue(" ");
    this.subMenuForm.controls["sub_optional_sms"].setValue(" ");
  }

  userInputCheck(value) {
    if (value) {
      this.menuForm.controls["menu_user_input"].setValue(null);
      this.subMenuForm.controls["sub_user_input"].setValue(null);
      return;
    }
    this.menuForm.controls["menu_user_input"].setValue(" ");
    this.subMenuForm.controls["sub_user_input"].setValue(" ");
    this.menuForm.controls["menu_is_consent"].setValue(false);
    this.subMenuForm.controls["sub_is_consent"].setValue(false);
    this.consentCheck(false);
  }

  packageCodeCheck(value) {
    if (value) {
      this.menuForm.controls["menu_package_code_text"].setValue(null);
      this.subMenuForm.controls["sub_package_code_text"].setValue(null);
      this.menuForm.controls["menu_is_3p_num"].setValue(false);
      this.subMenuForm.controls["sub_is_3p_num"].setValue(false);
      return;
    }
    this.menuForm.controls["menu_package_code_text"].setValue(" ");
    this.subMenuForm.controls["sub_package_code_text"].setValue(" ");
    this.menuForm.controls["menu_is_3p_num"].setValue(false);
    this.subMenuForm.controls["sub_is_3p_num"].setValue(false);
  }

  hasInputCheck(value) {
    if (value) {
      this.menuForm.controls["menu_input_level"].setValue(1);
      this.subMenuForm.controls["sub_input_level"].setValue(1);
      this.setInputFields(true);
      return;
    }
    this.menuForm.controls["menu_input_level"].setValue(0);
    this.subMenuForm.controls["sub_input_level"].setValue(0);
    this.totalFields = 0;
    this.enableInputValidity = true;
  }

  consentCheck(value) {
    if (value) {
      this.menuForm.controls["menu_consent_text"].setValue(null);
      this.subMenuForm.controls["sub_consent_text"].setValue(null);
      return;
    }
    this.menuForm.controls["menu_consent_text"].setValue(" ");
    this.subMenuForm.controls["sub_consent_text"].setValue(" ");
  }

  getSubNormalFlowCode(value) {
    this.getTransferable();

    if (value) {
      this.subMenuForm.controls["sub_has_menu"].setValue(false);
      this.subMenuForm.controls["sub_action_id"].setValue(0);
      this.subMenuForm.controls["sub_esme_protocol"].setValue(0);
      this.menuForm.controls["menu_sms_number"].setValue(" ");
      this.menuForm.controls["menu_sms_number_text"].setValue(" ");
      this.subMenuForm.controls["sub_sms_number"].setValue(" ");
      this.subMenuForm.controls["sub_sms_number_text"].setValue(" ");
      this.subMenuForm.controls["sub_service_code_flow"].setValue(null);
      this.subMenuForm.controls["sub_transfer_ussdString"].setValue(null);
      this.menuForm.controls["menu_is_sensitive"].setValue(false);
      this.subMenuForm.controls["sub_is_sensitive"].setValue(false);
      this.showEsmeDropDown = false;
    } else {
      this.subMenuForm.controls["sub_service_code_flow"].setValue(0);
      this.subMenuForm.controls["sub_transfer_ussdString"].setValue("null");
      this.subMenuForm.controls["sub_action_id"].setValue(null);
      this.subMenuForm.controls["sub_esme_protocol"].setValue(null);
      this.subMenuForm.controls["sub_is_root"].setValue(false);
    }
  }

  routeCheck(value) {
    if (value) {
      this.subMenuForm.controls["sub_transfer_ussdString"].setValue("null");
      this.menuForm.controls["menu_transfer_ussdString"].setValue("null");
      this.normalflowCodes = this.getTransferableData;
    } else {
      this.subMenuForm.controls["sub_transfer_ussdString"].setValue(null);
      this.menuForm.controls["menu_transfer_ussdString"].setValue(null);
      this.normalflowCodes = this.getTransferableData.filter((x) => {
        return x.is_whitelist != 0 || x.is_normal != 0;
      });
    }
  }

  getTransferable() {
    let spliced;
    this.allService
      .getNormalFlowCodes(this.currentTreeSelectionMaintainer == 2 ? 1 : 0)
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.alert.danger(res.message);
            return false;
          }
          this.getTransferableData = res.data;
          this.normalflowCodes = this.getTransferableData.filter((x) => {
            return x.is_whitelist != 0 || x.is_normal != 0;
          });
        },
        error(e) {},
      });
  }

  getTransferableMenuList(whitelist, id, root?) {
    let spliced;
    whitelist
      ? (this.currentTreeSelectionMaintainer = 2)
      : (this.currentTreeSelectionMaintainer = 1);
    this.allService.getNormalFlowCodes(whitelist == true ? 1 : 0).subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.alert.danger(res.message);
          return false;
        }

        this.getTransferableData = res.data;
        this.normalflowCodes = this.getTransferableData.filter((x) => {
          return x.is_whitelist != 0 || x.is_normal != 0;
        });
        this.routeCheck(root == 0 ? false : true);
      },
      error(e) {},
    });
  }

  getNormalFlowCodes(value) {
    this.getTransferable();

    if (value) {
      this.menuForm.controls["menu_has_menu"].setValue(false);
      this.menuForm.controls["menu_action_id"].setValue(0);
      this.menuForm.controls["menu_esme_protocol"].setValue(0);
      this.menuForm.controls["menu_sms_number"].setValue(" ");
      this.menuForm.controls["menu_sms_number_text"].setValue(" ");
      this.subMenuForm.controls["sub_sms_number"].setValue(" ");
      this.subMenuForm.controls["sub_sms_number_text"].setValue(" ");
      this.menuForm.controls["menu_service_code_flow"].setValue(null);
      this.menuForm.controls["menu_transfer_ussdString"].setValue(null);
      this.menuForm.controls["menu_is_sensitive"].setValue(false);
      this.subMenuForm.controls["sub_is_sensitive"].setValue(false);
      this.showEsmeDropDown = false;
    } else {
      this.menuForm.controls["menu_service_code_flow"].setValue(0);
      this.menuForm.controls["menu_transfer_ussdString"].setValue("null");
      this.menuForm.controls["menu_action_id"].setValue(null);
      this.menuForm.controls["menu_esme_protocol"].setValue(null);
      this.menuForm.controls["menu_is_root"].setValue(false);
    }
  }

  serviceCodeFlowCodes(event?) {
    if (this.menuForm.value.menu_is_root) {
      let root_dtmf = this.getTransferableData.filter((x) => {
        if (x.id == this.menuForm.value.menu_service_code_flow) {
          return x.short_code;
        }
      });
      this.menuForm.controls["menu_transfer_ussdString"].setValue(
        root_dtmf[0].short_code
      );
    }

    this.normalFlowCodesDtmf = [];
    this.allService
      .getDtmfsById(
        this.menuForm.value.menu_service_code_flow,
        this.currentTreeSelectionMaintainer == 2 ? 1 : 0
      )
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.alert.danger(res.message);
            return false;
          }
          if (res.data.length > 0) {
            for (let i of res.data) {
              let push = {
                unModified: i,
                modified: i.replace(/\+/g, "*"),
              };
              push.modified = push.modified.includes("wl-")
                ? push.modified.slice(3)
                : push.modified;

              this.normalFlowCodesDtmf.push(push);
            }
          }
          // this.normalFlowCodesDtmf = res.data;
        },
        error(e) {},
      });
  }

  subServiceCodeFlowCodes() {
    if (this.subMenuForm.value.sub_is_root) {
      let root_dtmf = this.getTransferableData.filter((x) => {
        if (x.id == this.subMenuForm.value.sub_service_code_flow) {
          return x.short_code;
        }
      });
      this.subMenuForm.controls["sub_transfer_ussdString"].setValue(
        root_dtmf[0].short_code
      );
    }

    this.normalFlowCodesDtmf = [];
    this.allService
      .getDtmfsById(
        this.subMenuForm.value.sub_service_code_flow,
        this.currentTreeSelectionMaintainer == 2 ? 1 : 0
      )
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.alert.danger(res.message);
            return false;
          }
          if (res.data.length > 0) {
            for (let i of res.data) {
              let push = {
                unModified: i,
                modified: i.replace(/\+/g, "*"),
              };
              push.modified = push.modified.includes("wl-")
                ? push.modified.slice(3)
                : push.modified;
              this.normalFlowCodesDtmf.push(push);
            }
          }
        },
        error(e) {},
      });
  }

  getEsmeConfig(value) {
    this.allService.getHttpSmppConf(value).subscribe({
      next: (res: any) => {
        if (!res.success) {
          this.alert.danger(res.message);
          return false;
        }
        if (res.data.data.length > 0) {
          this.esmeConfig = res.data.data;
        }
      },
      error(e) {},
    });
  }

  getCodes() {
    this.allService.getServiceCodesList().subscribe({
      next: (res: any) => {
        if (res.success != true) {
          alert(res.message);
          return false;
        }
        this.allServiceCode = res.data;

        let serviceData = res.data.filter((value: any) => {
          if (value.has_menu) return value;
        });
        let finalData = serviceData.filter((value: any) => {
          if (!value.is_whitelist || !value.is_normal) return value;
        });
        this.serviceCodes = finalData;
      },
      error(e) {},
    });
  }

  getFilteredServiceCode(serviceCodes) {
    this.filteredServiceCode = [];
    let data = serviceCodes;
    for (let x of data) {
      if (this.currentTreeSelectionMaintainer == 1) {
        if (x.is_normal == 1) {
          this.filteredServiceCode.push(x);
        }
      }
      if (this.currentTreeSelectionMaintainer == 2) {
        if (this.startForm.value.selectTreeType == "Normal") {
          if (x.is_normal == 1) {
            this.filteredServiceCode.push(x);
          }
        }
        if (this.startForm.value.selectTreeType == "WhiteList") {
          if (x.is_whitelist == 1) {
            this.filteredServiceCode.push(x);
          }
        }
      }
    }
  }

  getWhiteTreeTypeServiceCode(treeType) {
    this.filteredServiceCode = [];
    this.startForm.controls["filteredServiceCodeControl"].setValue(null);

    let data = this.allServiceCode;
    for (let x of data) {
      if (treeType == "Normal") {
        if (x.is_normal == 1) {
          this.filteredServiceCode.push(x);
        }
      }
      if (treeType == "WhiteList") {
        if (x.is_whitelist == 1) {
          this.filteredServiceCode.push(x);
        }
      }
    }
  }

  cloneTree($event) {
    if ($event.checked) {
      this.cloneChecker = true;
      this.startForm.controls["filteredServiceCodeControl"].setValue(null);
      this.startForm.controls["selectTreeType"].setValue("Normal");
      this.getFilteredServiceCode(this.allServiceCode);
    } else {
      this.cloneChecker = false;
      this.startForm.controls["filteredServiceCodeControl"].setValue(0);
      this.startForm.controls["selectTreeType"].setValue(0);
      this.filteredServiceCode = [];
      this.mainJson[0].press_options = [];
    }
  }

  changeFilteredServiceCode(value) {
    if (this.currentTreeSelectionMaintainer == 2) {
      this.allService
        .getMenuById(
          value.service_id == undefined ? value.id : value.service_id,
          this.startForm.value.selectTreeType == "WhiteList" ? true : false
        )
        .subscribe((res) => {
          this.convertToJson(res.data);
        });
      return;
    }
    this.allService
      .getMenuById(
        value.service_id == undefined ? value.id : value.service_id,
        false
      )
      .subscribe((res) => {
        this.convertToJson(res.data);
      });
  }

  changeServiceCode(e: any) {
    console.log("e", e.id);
    this.forwhite = false;
    this.fornormal = false;
    let shortcode = this.serviceCodes.filter((obj) => obj.id == e.id);
    this.serviceCodeNumber = shortcode[0].short_code;
    this.serviceCodeId = e.service_id == undefined ? e.id : e.service_id;
    if (!e.is_whitelist && !e.is_normal) {
      this.whiteListGroupChecker = false;
      this.startForm.controls["white_list_group_id"].setValue(0);
      this.is_normal_checker = true;
      this.currentTreeSelectionMaintainer = 1;
      this.is_whitelist_checker = false;
      this.menuWhiteListChecker = false;
    }
    if (e.is_whitelist && !e.is_normal) {
      this.whiteListGroupChecker = false;
      this.startForm.controls["white_list_group_id"].setValue(0);
      this.is_whitelist_checker = true;
      this.is_normal_checker = true;
      this.forwhite = true;
      this.menuWhiteListChecker = false;
      this.currentTreeSelectionMaintainer = 1;
    }
    if (!e.is_whitelist && e.is_normal) {
      this.whiteListGroupChecker = true;
      this.startForm.controls["white_list_group_id"].setValue(null);
      this.is_whitelist_checker = true;
      this.is_normal_checker = true;
      this.fornormal = true;
      this.menuWhiteListChecker = true;
      this.currentTreeSelectionMaintainer = 2;
    }

    if (this.fornormal) {
      this.radio_Button_Checker = "is_whitelist";
    } else if (this.forwhite) {
      this.radio_Button_Checker = "is_normal";
    } else {
      this.radio_Button_Checker = "is_normal";
    }

    this.getTransferable();
  }

  changeRadio(e) {
    if (this.is_whitelist_checker && this.is_normal_checker) {
      return false;
    }
    if (e == "is_whitelist") {
      this.whiteListGroupChecker = true;
      this.startForm.controls["white_list_group_id"].setValue(null);
      this.is_whitelist_checker = true;
      this.is_normal_checker = false;
      this.menuWhiteListChecker = true;
      this.serviceCodeNumber = "wl-" + this.serviceCodeNumber;
      this.currentTreeSelectionMaintainer = 2;
    }
    if (e == "is_normal") {
      this.whiteListGroupChecker = false;
      this.startForm.controls["white_list_group_id"].setValue(0);
      this.is_whitelist_checker = false;
      this.is_normal_checker = true;
      this.menuWhiteListChecker = false;
      this.currentTreeSelectionMaintainer = 1;
    }

    this.getTransferable();
    if (this.cloneChecker) {
      this.mainJson[0].press_options = [];
      this.startForm.controls["filteredServiceCodeControl"].setValue(0);
      this.getFilteredServiceCode(this.allServiceCode);
      console.log(this.mainJson);
      this.outputJson.emit(this.mainJson);
    }
  }

  resetForm(id: any) {
    const formId = <HTMLFormElement>document.getElementById(id);
    formId.reset();
  }

  isValidPressOption($event: any) {
    let val = $event.target.value;
    if (val <= 0) {
      $event.target.value = "";
      this.subMenuForm.controls["sub_press_option"].setValue("");
      this.menuForm.controls["menu_press_option"].setValue("");
      return false;
    }
  }

  isValidPressOption01(event: any) {
    if (event < 0 || event > 1) {
      event = "";
      return false;
    }
  }

  isValidTitle(arr: any, $event: any, child?: boolean) {
    let nodes = arr;

    if (child == false) {
      for (let x of this.mainJson[0].press_options) {
        if (x.menu_item_text == $event.target.value) {
          $event.target.value = "";
          this.subMenuForm.controls["sub_title"].setValue("");
          this.menuForm.controls["menu_title"].setValue("");
          this.alert.danger(
            "Same name is already added on parent nodes, please try another"
          );
          return false;
        }
      }
    }

    if (child == true) {
      if (this.titleMaintainer.menu_item_text == $event.target.value) {
        $event.target.value = "";
        this.subMenuForm.controls["sub_title"].setValue("");
        this.menuForm.controls["menu_title"].setValue("");
        this.alert.danger("Cannot add same name as parent");
        return false;
      }

      for (let x of this.titleMaintainer.press_options) {
        if (x.menu_item_text == $event.target.value) {
          $event.target.value = "";
          this.subMenuForm.controls["sub_title"].setValue("");
          this.menuForm.controls["menu_title"].setValue("");
          this.alert.danger(
            "Same name is already added on parent " +
              this.titleMaintainer.menu_item_text +
              " please try another"
          );
          return false;
        }
      }
    }
  }

  deleteMenu(parentNode = this.nodeForDlt) {
    this.currentParent = "";
    this.currentParent = parentNode.menu_unique;
    this.walkTree(
      this.mainJson[0].press_options,
      this.currentParent,
      "delete",
      []
    );
    this.lengthJson = this.mainJson[0].press_options.length;
    this.closedltMenuDialog();
  }

  updateMenu(parentNode) {
    let menu_unique;
    this.openDialog();
    this.history_menu_item_text = parentNode.menu_item_text;
    this.history_short_code_dtmf = parentNode.short_code_dtmf;
    this.subServiceShortCode = parentNode.short_code_dtmf;
    this.currentParentObject = {};
    this.titleMaintainer = {};
    this.titleMaintainer = parentNode;
    menu_unique = this.titleMaintainer.menu_unique;
    this.currentParentObject = parentNode;
    this.currentParent = "";
    this.getPathCounter = 0;
    this.getPath(this.mainJson[0].press_options, menu_unique);

    this.showCurrentParent = "";
    this.showCurrentParent = parentNode.menu_item_text;
    this.currentParent = parentNode.menu_unique;
    let firstLayerNodes = [];
    this.mainJson[0].press_options.forEach((element: any) => {
      firstLayerNodes.push(element.menu_unique);
    });
    this.isUpdate = true;
    this.walkTree(
      this.mainJson[0].press_options,
      this.currentParent,
      "update",
      firstLayerNodes
    );
  }

  walkTree(arr: any, parentNode: any, flag: string, firstLayerNodes: any) {
    let nodes = arr;
    nodes.forEach((child: any) => {
      if (child.menu_unique == parentNode) {
        if (flag == "delete") {
          const index = nodes.indexOf(child);
          if (index > -1) {
            nodes.splice(index, 1);
          }
          console.log(this.mainJson);
          this.outputJson.emit(this.mainJson);
        }

        if (flag == "update") {
          let elementExists = firstLayerNodes.find((x: any) => x == parentNode);

          if (elementExists) {
            this.resetForm("menuForm");
            // child.charge_type == 3
            //   ? this.checkEditChargeableTypes(child.slice_intervals)
            //   : null;
            this.menuForm.controls["menu_service_code_flow"].setErrors(null);
            this.menuForm.patchValue({
              menu_title: child.menu_item_text,
              menu_take_user_input: child.take_user_input,
              menu_user_input: child.user_input,
              menu_is_consent: child.is_consent,
              menu_consent_text: child.consent_text,
              menu_is_package_code: child.is_package_code,
              menu_package_code_text: child.package_code_text,
              menu_is_3p_num: child.is_3p_num,
              menu_press_option: child.short_code_dtmf,
              menu_has_menu: child.has_menu,
              menu_action_id: child.action_id,
              menu_sms_text: child.sms_text,
              menu_optional_sms: child.optional_sms || " ",
              menu_is_chargeable: child.is_chargeable,
              menu_amount: child.amount || 0,
              menu_charge_type: child.charge_type || 0,
              menu_is_transferable: child.is_transferable,
              menu_transfer_ussdString: child.transfer_ussdString,
              menu_esme_protocol: child.esme_protocol,
              menu_service_code_flow: child.service_code_flow,
              menu_is_root: child.is_root,
              menu_is_input: child.is_input,
              menu_input_level: child.input_level,
              menu_sms_number: child.sms_number,
              menu_sms_number_text: child.sms_number_text,
              menu_is_sensitive: child.is_sensitive,
            });

            if (child.is_input) {
              this.totalFields = child.input_level;

              setTimeout(() => {
                this.inputMessageArrayFetch(child.input_message, true);
              }, 500);
            }

            if (child.is_root) {
              this.normalflowCodes = this.getTransferableData;
            } else {
              this.normalflowCodes = this.getTransferableData.filter((x) => {
                return x.is_whitelist != 0 || x.is_normal != 0;
              });
            }

            if (child.has_menu || child.is_transferable) {
              this.showEsmeDropDown = false;
            }

            if (child.is_transferable) {
              this.serviceCodeFlowCodes();
            }

            if (child.esme_protocol == 1 || child.esme_protocol == 2) {
              this.updateField(child.esme_protocol);
            }

            this.sub_menu_div = "none";
            this.menu_form_div = "block";
          } else {
            this.resetForm("subMenuForm");
            // child.charge_type == 3
            //   ? this.checkEditChargeableTypes(child.slice_intervals)
            //   : null;
            this.subMenuForm.controls["sub_service_code_flow"].setErrors(null);
            this.subMenuForm.patchValue({
              sub_title: child.menu_item_text,
              sub_take_user_input: child.take_user_input,
              sub_user_input: child.user_input,
              sub_is_consent: child.is_consent,
              sub_consent_text: child.consent_text,
              sub_is_package_code: child.is_package_code,
              sub_package_code_text: child.package_code_text,
              sub_is_3p_num: child.is_3p_num,
              sub_press_option: child.short_code_dtmf,
              sub_action_id: child.action_id,
              sub_has_menu: child.action_id == 0 ? child.has_menu : false,
              sub_sms_text: child.sms_text,
              sub_optional_sms: child.optional_sms || " ",
              sub_is_chargeable: child.is_chargeable,
              sub_amount: child.amount || 0,
              sub_charge_type: child.charge_type || 0,
              sub_is_transferable: child.is_transferable,
              sub_transfer_ussdString: child.transfer_ussdString,
              sub_esme_protocol: child.esme_protocol,
              sub_service_code_flow: child.service_code_flow,
              sub_is_root: child.is_root,
              sub_is_input: child.is_input,
              sub_input_level: child.input_level,
              sub_sms_number: child.sms_number,
              sub_sms_number_text: child.sms_number_text,
              sub_is_sensitive: child.is_sensitive,
            });

            if (child.is_input) {
              this.totalFields = child.input_level;

              setTimeout(() => {
                this.inputMessageArrayFetch(child.input_message, false);
              }, 500);
            }

            if (child.has_menu || child.is_transferable) {
              this.showEsmeDropDown = false;
            }

            if (child.is_transferable) {
              this.subServiceCodeFlowCodes();
            }
            if (child.esme_protocol == 1 || child.esme_protocol == 2) {
              this.updateField(child.esme_protocol);
            }
            this.sub_menu_div = "block";
            this.menu_form_div = "none";
          }
        }
        console.log(this.mainJson);
        this.outputJson.emit(this.mainJson);
      } else {
        this.walkTree(child.press_options, parentNode, flag, firstLayerNodes);
      }
    });
  }

  inputMessageArrayFetch(array, boolean: Boolean) {
    if (boolean) {
      for (let i = 0; i < this.totalFields; i++) {
        (<HTMLInputElement>document.getElementById("amount" + i)).value =
          array[i];
      }
    } else {
      for (let i = 0; i < this.totalFields; i++) {
        (<HTMLInputElement>document.getElementById("sub-amount" + i)).value =
          array[i];
      }
    }
  }

  inputMessageArrayInsert(boolean: boolean) {
    let inputArray = [];
    if (boolean) {
      for (let i = 0; i < this.totalFields; i++) {
        inputArray.push(
          (<HTMLInputElement>document.getElementById("amount" + i)).value
        );
      }
    } else {
      for (let i = 0; i < this.totalFields; i++) {
        inputArray.push(
          (<HTMLInputElement>document.getElementById("sub-amount" + i)).value
        );
      }
    }

    while (inputArray.length < 5) inputArray.push(null);
    return inputArray;
  }

  saveMenuForm() {
    this.closeDialog();
    let counter = 0;
    for (let x of this.mainJson[0].press_options) {
      counter = counter + x.menu_item_text.length;
    }
    counter = counter + this.menuForm.value.menu_title.length;
    if (this.isUpdate) {
      counter = counter - this.currentParentObject.menu_item_text.length;
    }
    if (counter > environment.characterLimit) {
      this.alert.danger(
        "Maximum character limit of " + environment.characterLimit + " reached"
      );
      counter = counter - this.menuForm.value.menu_title.length;
      return false;
    }

    if (!this.isUpdate) {
      for (let [i, obj] of this.mainJson[0].press_options.entries()) {
        if (
          this.mainJson[0].press_options[i].short_code_dtmf ==
          this.menuForm.value.menu_press_option.toString()
        ) {
          this.menuForm.controls.menu_press_option.setValue("");
          this.menuForm.reset();
          this.patchValueMenuForm();
          return false;
        }
      }

      //CHECK LATER IF ANY ISSUE ARISES
      this.mainJson[0].press_options.push({
        menu_press_options: this.menuForm.value.menu_press_option,
        is_input: this.menuForm.value.menu_is_input,
        input_level: this.menuForm.value.menu_input_level,
        menu_unique:
          this.menuForm.value.menu_title +
          this.menuForm.value.menu_press_option.toString() +
          Math.random(),
        is_package_code: this.menuForm.value.menu_is_package_code,
        package_code_text: this.menuForm.value.menu_is_package_code
          ? this.menuForm.value.menu_package_code_text
          : " ",
        is_3p_num: this.menuForm.value.menu_is_3p_num,
        take_user_input: this.menuForm.value.menu_take_user_input,
        user_input: this.menuForm.value.menu_take_user_input
          ? this.menuForm.value.menu_user_input
          : " ",
        is_consent: this.menuForm.value.menu_is_consent,
        is_root: this.menuForm.value.menu_is_root,
        consent_text: this.menuForm.value.menu_consent_text,
        menu_item_text: this.menuForm.value.menu_title,
        short_code_dtmf: this.menuForm.value.menu_press_option.toString(),
        has_menu: this.menuForm.value.menu_has_menu,
        action_id: this.menuForm.value.menu_action_id,
        sms_text: this.menuForm.value.menu_sms_text,
        optional_sms: this.menuForm.value.menu_sms_text
          ? this.menuForm.value.menu_optional_sms
          : " ",
        is_chargeable: this.menuForm.value.menu_is_chargeable,
        amount: this.menuForm.value.menu_is_chargeable
          ? this.menuForm.value.menu_amount
          : 0,
        charge_type: this.menuForm.value.menu_is_chargeable
          ? this.menuForm.value.menu_charge_type
          : 0,
        is_transferable: this.menuForm.value.menu_is_transferable,
        transfer_ussdString: this.menuForm.value.menu_transfer_ussdString,
        esme_protocol: this.menuForm.value.menu_esme_protocol,
        service_code_flow: this.menuForm.value.menu_service_code_flow,
        sms_number: this.menuForm.value.menu_sms_number,
        sms_number_text: this.menuForm.value.menu_sms_number_text,
        is_sensitive: this.menuForm.value.menu_is_sensitive,
        parent_id: 0,
        press_options: [],
        input_message: this.menuForm.value.menu_is_input
          ? this.inputMessageArrayInsert(true)
          : [null, null, null, null, null],
        slice_intervals: [],
      });
    }

    if (this.isUpdate) {
      let verified: boolean = true;
      let verifyPressOptions: boolean = true;

      if (
        this.history_short_code_dtmf ==
        this.menuForm.value.menu_press_option.toString()
      ) {
        verifyPressOptions = false;
      }

      if (verifyPressOptions) {
        for (let checker of this.mainJson[0].press_options) {
          if (
            checker.short_code_dtmf ==
            this.menuForm.value.menu_press_option.toString()
          ) {
            this.alert.danger(
              "Cannot add with same press options, please try another one"
            );
            verified = false;
          }
        }
      }

      if (verified) {
        this.mainJson[0].press_options.forEach((child, index) => {
          if (child.menu_unique == this.currentParent) {
            this.mainJson[0].press_options[index] = {
              menu_press_options: this.menuForm.value.menu_press_option,
              is_input: this.menuForm.value.menu_is_input,
              input_level: this.menuForm.value.menu_input_level,
              menu_unique:
                this.menuForm.value.menu_title +
                this.menuForm.value.menu_press_option.toString() +
                Math.random(),
              is_package_code: this.menuForm.value.menu_is_package_code,
              package_code_text: this.menuForm.value.menu_package_code_text,
              is_3p_num: this.menuForm.value.menu_is_3p_num,
              take_user_input: this.menuForm.value.menu_take_user_input,
              is_root: this.menuForm.value.menu_is_root,
              is_consent: this.menuForm.value.menu_is_consent,
              consent_text: this.menuForm.value.menu_consent_text,
              user_input: this.menuForm.value.menu_take_user_input
                ? this.menuForm.value.menu_user_input
                : " ",
              menu_item_text: this.menuForm.value.menu_title,
              short_code_dtmf: this.menuForm.value.menu_press_option.toString(),

              has_menu: this.menuForm.value.menu_has_menu,
              action_id: this.menuForm.value.menu_action_id,
              sms_text: this.menuForm.value.menu_sms_text,
              optional_sms: this.menuForm.value.menu_sms_text
                ? this.menuForm.value.menu_optional_sms
                : " ",
              is_chargeable: this.menuForm.value.menu_is_chargeable,
              amount: this.menuForm.value.menu_is_chargeable
                ? this.menuForm.value.menu_amount
                : 0,
              charge_type: this.menuForm.value.menu_is_chargeable
                ? this.menuForm.value.menu_charge_type
                : 0,
              is_transferable: this.menuForm.value.menu_is_transferable,
              transfer_ussdString: this.menuForm.value.menu_transfer_ussdString,
              esme_protocol: this.menuForm.value.menu_esme_protocol,
              service_code_flow: this.menuForm.value.menu_service_code_flow,
              sms_number: this.menuForm.value.menu_sms_number,
              sms_number_text: this.menuForm.value.menu_sms_number_text,
              is_sensitive: this.menuForm.value.menu_is_sensitive,
              parent_id: 0,
              input_message: this.menuForm.value.menu_is_input
                ? this.inputMessageArrayInsert(true)
                : [null, null, null, null, null],
              press_options:
                this.menuForm.value.menu_has_menu == false
                  ? []
                  : child.press_options,
              slice_intervals: [],
            };
          }
        });
      }
    }
    this.mainJson[0].press_options = this.mainJson[0].press_options.sort(
      (a, b) => {
        return a.menu_press_options - b.menu_press_options;
      }
    );
    this.outputJson.emit(this.mainJson);

    this.resetForm("menuForm");
    this.isUpdate = false;
    this.lengthJson = this.mainJson.length;

    this.patchValueMenuForm();
    if (!this.isUpdate) {
      this.addWIdthHeight(true);
    }
  }

  addWIdthHeight(parent) {
    if (parent) {
      this.d3TreeWidth = this.d3TreeWidth + 100;
      this.d3TreeHeight = this.d3TreeHeight + 150;
    } else {
      this.d3TreeWidth = this.d3TreeWidth + 50;
      this.d3TreeHeight = this.d3TreeHeight + 50;
    }
  }

  addChild(parentNode) {
    this.openDialog();
    this.subServiceShortCode = parentNode.short_code_dtmf;
    this.titleMaintainer = parentNode;
    this.isUpdate = false;
    this.showCurrentParent = "";
    this.showCurrentParent = parentNode.menu_item_text;
    this.currentParent = "";
    this.currentParent = parentNode.menu_unique;
    if (this.mainJson[0].menu_unique == parentNode.menu_unique) {
      this.sub_menu_div = "none";
      this.menu_form_div = "block";
    } else {
      this.sub_menu_div = "block";
      this.menu_form_div = "none";
      this.resetForm("subMenuForm");
      this.patchValueSubMenuForm();
    }
  }

  saveSubMenuForm() {
    this.closeDialog();
    let counter = 0;

    for (let x of this.titleMaintainer.press_options) {
      counter = counter + x.menu_item_text.length;
    }

    counter = counter + this.subMenuForm.value.sub_title.length;
    if (this.isUpdate) {
      counter = counter - this.currentParentObject.menu_item_text.length;
    }

    if (counter > environment.characterLimit) {
      this.alert.danger(
        "Maximum character limit of " + environment.characterLimit + " reached"
      );

      return false;
    }

    if (!this.isUpdate) {
      this.obj = {
        menu_press_options: this.subMenuForm.value.sub_press_option,
        is_input: this.subMenuForm.value.sub_is_input,
        input_level: this.subMenuForm.value.sub_input_level,
        menu_unique:
          this.subMenuForm.value.sub_title +
          this.subMenuForm.value.sub_press_option.toString() +
          +Math.random(),
        is_package_code: this.subMenuForm.value.sub_is_package_code,
        package_code_text: this.subMenuForm.value.sub_package_code_text,
        is_3p_num: this.subMenuForm.value.sub_is_3p_num,
        take_user_input: this.subMenuForm.value.sub_take_user_input,
        is_root: this.subMenuForm.value.sub_is_root,
        is_consent: this.subMenuForm.value.sub_is_consent,
        consent_text: this.subMenuForm.value.sub_consent_text,
        user_input: this.subMenuForm.value.sub_take_user_input
          ? this.subMenuForm.value.sub_user_input
          : " ",
        menu_item_text: this.subMenuForm.value.sub_title,
        short_code_dtmf: this.subMenuForm.value.sub_press_option.toString(),
        has_menu: this.subMenuForm.value.sub_has_menu,
        action_id: this.subMenuForm.value.sub_action_id,
        sms_text: this.subMenuForm.value.sub_sms_text,
        optional_sms: this.subMenuForm.value.sub_sms_text
          ? this.subMenuForm.value.sub_optional_sms
          : "",
        is_chargeable: this.subMenuForm.value.sub_is_chargeable,
        amount: this.subMenuForm.value.sub_is_chargeable
          ? this.subMenuForm.value.sub_amount
          : 0,
        charge_type: this.subMenuForm.value.sub_is_chargeable
          ? this.subMenuForm.value.sub_charge_type
          : 0,
        is_transferable: this.subMenuForm.value.sub_is_transferable,
        transfer_ussdString: this.subMenuForm.value.sub_transfer_ussdString,
        esme_protocol: this.subMenuForm.value.sub_esme_protocol,
        service_code_flow: this.subMenuForm.value.sub_service_code_flow,
        sms_number: this.subMenuForm.value.sub_sms_number,
        sms_number_text: this.subMenuForm.value.sub_sms_number_text,
        is_sensitive: this.subMenuForm.value.sub_is_sensitive,
        parent_id: 0,
        press_options: [],
        input_message: this.subMenuForm.value.sub_is_input
          ? this.inputMessageArrayInsert(false)
          : [null, null, null, null, null],
        slice_intervals: [],
      };
    }

    if (this.isUpdate) {
      this.obj = {
        menu_press_options: this.subMenuForm.value.sub_press_option,
        is_input: this.subMenuForm.value.sub_is_input,
        input_level: this.subMenuForm.value.sub_input_level,
        menu_unique:
          this.subMenuForm.value.sub_title +
          this.subMenuForm.value.sub_press_option.toString() +
          Math.random(),
        take_user_input: this.subMenuForm.value.sub_take_user_input,
        user_input: this.subMenuForm.value.sub_take_user_input
          ? this.subMenuForm.value.sub_user_input
          : " ",
        is_package_code: this.subMenuForm.value.sub_is_package_code,
        package_code_text: this.subMenuForm.value.sub_package_code_text,
        is_3p_num: this.subMenuForm.value.sub_is_3p_num,
        menu_item_text: this.subMenuForm.value.sub_title,
        is_consent: this.subMenuForm.value.sub_is_consent,
        is_root: this.subMenuForm.value.sub_is_root,
        consent_text: this.subMenuForm.value.sub_consent_text,
        short_code_dtmf: this.subMenuForm.value.sub_press_option.toString(),
        has_menu: this.subMenuForm.value.sub_has_menu,
        action_id: this.subMenuForm.value.sub_has_menu
          ? 0
          : this.subMenuForm.value.sub_action_id,
        sms_text: this.subMenuForm.value.sub_sms_text,
        optional_sms: this.subMenuForm.value.sub_sms_text
          ? this.subMenuForm.value.sub_optional_sms
          : "",
        is_chargeable: this.subMenuForm.value.sub_is_chargeable,
        amount: this.subMenuForm.value.sub_is_chargeable
          ? this.subMenuForm.value.sub_amount
          : 0,
        charge_type: this.subMenuForm.value.sub_is_chargeable
          ? this.subMenuForm.value.sub_charge_type
          : 0,
        is_transferable: this.subMenuForm.value.sub_is_transferable,
        transfer_ussdString: this.subMenuForm.value.sub_transfer_ussdString,
        service_code_flow: this.subMenuForm.value.sub_service_code_flow,
        esme_protocol: this.subMenuForm.value.sub_esme_protocol,
        sms_number: this.subMenuForm.value.sub_sms_number,
        sms_number_text: this.subMenuForm.value.sub_sms_number_text,
        is_sensitive: this.subMenuForm.value.sub_is_sensitive,
        parent_id: 0,
        press_options: [],

        input_message: this.subMenuForm.value.sub_is_input
          ? this.inputMessageArrayInsert(false)
          : [null, null, null, null, null],
        slice_intervals: [],
      };

      if (this.checkPressoptions()) {
        this.updateChildToTree(
          this.currentParent,
          this.mainJson[0].press_options
        );
      }
      this.resetForm("subMenuForm");
      console.log(this.mainJson);
      this.outputJson.emit(this.mainJson);
      this.patchValueSubMenuForm();
      this.patchValueMenuForm();
      this.isUpdate = false;
      this.sub_menu_div = "none";
      this.menu_form_div = "block";

      return;
    }
    this.addChildToTree(this.currentParent, this.mainJson[0].press_options);
    this.patchValueSubMenuForm();
    this.patchValueMenuForm();
    this.sub_menu_div = "none";
    this.menu_form_div = "block";

    if (!this.isUpdate) {
      this.addWIdthHeight(false);
    }
  }

  checkValues(checker, parentNode) {
    for (let childChecker of checker.press_options) {
      if (childChecker.menu_unique == parentNode) {
        this.currentUpdateParent = checker;

        break;
      } else {
        if (childChecker.press_options.length != 0) {
          this.checkValues(childChecker, parentNode);
        }
      }
    }
  }

  checkPressoptions() {
    let verified: boolean = true;
    let verifyPressOptions: boolean = true;

    if (
      this.history_short_code_dtmf ==
      this.subMenuForm.value.sub_press_option.toString()
    ) {
      verifyPressOptions = false;
    }

    if (verifyPressOptions) {
      for (let checker of this.mainJson[0].press_options) {
        if (checker.press_options.length != 0) {
          for (let childChecker of checker.press_options) {
            if (childChecker.menu_unique == this.currentParent) {
              this.currentUpdateParent = checker;
              break;
            } else {
              if (childChecker.press_options.length != 0) {
                this.checkValues(childChecker, this.currentParent);
              }
            }
          }
        }
      }
      for (let verify of this.currentUpdateParent.press_options) {
        if (
          verify.short_code_dtmf ==
          this.subMenuForm.value.sub_press_option.toString()
        ) {
          verified = false;
        }
      }
    }

    return verified;
  }

  updateChildToTree(parentNode, arr) {
    let nodes = arr;

    nodes.forEach((child, index) => {
      if (child.menu_unique == parentNode) {
        if (!this.obj.has_menu) {
          this.obj.press_options = [];
        }
        this.obj.press_options = child.press_options;
        nodes[index] = this.obj;
        nodes = nodes.sort((a, b) => {
          return a.menu_press_options - b.menu_press_options;
        });
        return;
      } else {
        this.updateChildToTree(parentNode, child.press_options);
      }
      this.updateChildToTree(parentNode, child.press_options);
    });
  }

  addChildToTree(parentNode, arr) {
    let nodes = arr;
    nodes.forEach((child) => {
      if (child.menu_unique == parentNode) {
        // if (child.press_options.length < 9) {
        for (let i = 0; i < child.press_options.length; i++) {
          if (
            child.press_options[i].short_code_dtmf == this.obj.short_code_dtmf
          ) {
            this.subMenuForm.controls.sub_press_option.setValue("");
            // this.alert.danger(
            //   "Cannot add with same press options, please try another one"
            // );
            return false;
          }
        }

        child.press_options.push(this.obj);
        child.press_options = child.press_options.sort((a, b) => {
          return a.menu_press_options - b.menu_press_options;
        });
        console.log(this.mainJson);
        this.outputJson.emit(this.mainJson);
        // this.menu_form_div = "none";
        this.resetForm("subMenuForm");
        // } else {
        //   return false;
        // }
      } else {
        this.addChildToTree(parentNode, child.press_options);
      }
      this.addChildToTree(parentNode, child.press_options);
    });
  }

  filterTree(tree) {
    let index = 0;
    tree.forEach((child) => {
      index += 1;
      if (child.press_options.length === 0) {
        delete child["press_options"];
      } else {
        if (child.press_options) {
          this.filterTree(child.press_options);
        }
      }
    });
  }

  getServiceCodes(id, tree) {
    if (this.mainJson[0].press_options.length == 0) {
      this.alert.danger("Cannot perform specified action, as tree is empty");
      return;
    }

    this.allService.getServiceCodesList().subscribe({
      next: (res: any) => {
        if (res.success != true) {
          alert(res.message);
          return false;
        }
        let short_code = res.data.filter((value) => {
          if (value.service_id == id || value.id == id) {
            return value;
          }
        });

        this.startForm.value.serviceCode = short_code[0];

        this.JsonStructureChangeUpdate(tree);
        this.filterTree(this.mainJson[0].press_options);
        Object.assign(this.mainJson[0], {
          service_code_id: id,
          is_whitelist: this.is_whitelist_checker,
          is_normal: this.is_normal_checker,
          menuListCheck: this.menuWhiteListChecker,
          white_list_group_id: this.editWhitelistID,
        });
        for (let val of this.mainJson[0].press_options) {
          if (!val.press_options) {
            Object.assign(val, { press_options: [] });
          }
        }
        console.log("this.mainJson[0]", this.mainJson[0]);
        this.displayLoader = true;
        this.allService
          .updateMenu(this.mainJson[0], this.d3TreeWidth, this.d3TreeHeight)
          .subscribe({
            next: (res: any) => {
              if (!res.success) {
                this.alert.danger("Menu Cannot be Added Sucessfully");
                this.displayLoader = false;
                return false;
              }
              this.alert.success("Menu Updated Sucessfully");
              this.displayLoader = false;
              this.router.navigateByUrl("/view-menus-list");
            },
            error(e) {
              this.displayLoader = false;
              this.alert.danger("Something went wrong");
            },
          });
      },
      error(e) {},
    });
  }

  saveJsonFromView(id, tree) {
    this.getServiceCodes(id, tree);
  }

  saveJson() {
    if (this.mainJson[0].press_options.length == 0) {
      this.alert.danger("Cannot perform specified action, as tree is empty");
      return;
    }

    if (!this.jsonStructureChangeChecker) {
      this.JsonStructureChange();
    }
    this.filterTree(this.mainJson[0].press_options);
    Object.assign(this.mainJson[0], {
      service_code_id:
        this.startForm.value.serviceCode.service_id ||
        this.startForm.value.serviceCode.id ||
        this.startForm.value.serviceCode.short_code_id ||
        this.startForm.value.serviceCode.id,
      is_whitelist: this.is_whitelist_checker,
      is_normal: this.is_normal_checker,
      menuListCheck: this.menuWhiteListChecker,
      white_list_group_id: this.startForm.value.white_list_group_id,
    });
    for (let val of this.mainJson[0].press_options) {
      if (!val.press_options) {
        Object.assign(val, { press_options: [] });
      }
    }
    this.allService
      .addMenu(this.mainJson[0], this.d3TreeWidth, this.d3TreeHeight)
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.alert.danger("Menu Cannot be Added Successfully");
            this.displayLoader = false;
            return false;
          }
          this.alert.success("Menu Added Sucessfully");
          this.displayLoader = false;
          this.router.navigateByUrl("/view-menus-list");
        },
        error(e) {
          this.displayLoader = false;
          this.alert.danger("Something went wrong");
        },
      });
  }

  openDialog() {
    this.showModal = "block";
    this.shortCodeModal = " ";
  }

  openDialogFirst() {
    console.log("this.cloneChecker", this.cloneChecker);

    if (this.cloneChecker) {
      let cloneServiceID =
        this.startForm.value.filteredServiceCodeControl.service_id == undefined
          ? this.startForm.value.filteredServiceCodeControl.id
          : this.startForm.value.filteredServiceCodeControl.service_id;
      this.allService
        .cloneMenuById(
          cloneServiceID,
          this.serviceCodeId,
          this.startForm.value.selectTreeType == "WhiteList" ? true : false
        )
        .subscribe(
          (res) => {
            this.router.navigateByUrl("view-menus-list");
          },
          (error) => {
            this.alert.danger("Cloning failed due to unexpected failure");
            this.router.navigateByUrl("view-menus-list");
          }
        );
      this.showModal = "none";
      this.shortCodeModal = "none";

      return;
    }
    this.showModal = "block";
    this.shortCodeModal = " ";
  }

  closeDialog(onClose?: Boolean) {
    this.showModal = " ";

    if (onClose) {
      this.isUpdate = false;
      this.menuForm.reset();
      this.subMenuForm.reset();
      this.patchValueMenuForm();
      this.patchValueSubMenuForm();
      this.sub_menu_div = "none";
      this.menu_form_div = "block";
    }
  }

  opendltMenuDialog(node: any) {
    this.nodeForDlt = {};
    this.nodeForDlt = node;
    this.showDltModal = "block";
  }

  closedltMenuDialog() {
    this.showDltModal = " ";
  }

  showShorCodeModal() {
    this.shortCodeModal = "block";
  }

  closeShortCodeModal() {
    this.shortCodeModal = " ";
    this.router.navigate(["/view-menus-list"]);
  }

  setInputFields(boolean) {
    if (
      this.menuForm.value.menu_input_level > 5 ||
      this.subMenuForm.value.sub_input_level > 5
    ) {
      return;
    }
    this.enableInputValidity = false;

    if (boolean) {
      this.totalFields = this.menuForm.value.menu_input_level;
      return;
    }
    this.totalFields = this.subMenuForm.value.sub_input_level;
  }

  enableInputValidityChecker(id, boolean) {
    if (boolean) {
      for (let i = 0; i < this.menuForm.value.menu_input_level; i++) {
        if ((<HTMLInputElement>document.getElementById(id + i)).value == "") {
          this.enableInputValidity = false;
          return;
        } else {
          this.enableInputValidity = true;
        }
      }
    } else {
      for (let i = 0; i < this.subMenuForm.value.sub_input_level; i++) {
        if ((<HTMLInputElement>document.getElementById(id + i)).value == "") {
          this.enableInputValidity = false;
          return;
        } else {
          this.enableInputValidity = true;
        }
      }
    }
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  patchValueMenuForm() {
    this.menuForm.patchValue({
      menu_has_menu: false,
      menu_take_user_input: false,
      menu_user_input: " ",
      menu_action_id: 0,
      menu_sms_text: false,
      menu_optional_sms: " ",
      menu_is_chargeable: false,
      menu_amount: 0,
      menu_charge_type: 0,
      menu_is_transferable: false,
      menu_service_code_flow: 0,
      menu_transfer_ussdString: "null",
      menu_esme_protocol: 0,
      menu_is_package_code: false,
      menu_package_code_text: " ",
      menu_is_3p_num: false,
      menu_is_consent: false,
      menu_consent_text: " ",
      menu_is_root: false,
      menu_is_input: false,
      menu_input_level: 0,
      menu_sms_number: " ",
      menu_sms_number_text: " ",
      menu_is_sensitive: false,
    });
    this.showEsmeDropDown = false;
    this.totalFields = 0;
    this.enableInputValidity = true;
  }

  patchValueSubMenuForm() {
    this.subMenuForm.patchValue({
      sub_has_menu: false,
      sub_take_user_input: false,
      sub_user_input: " ",
      sub_action_id: 0,
      sub_sms_text: false,
      sub_optional_sms: " ",
      sub_is_chargeable: false,
      sub_amount: 0,
      sub_charge_type: 0,
      sub_is_transferable: false,
      sub_service_code_flow: 0,
      sub_transfer_ussdString: "null",
      sub_esme_protocol: 0,
      sub_is_package_code: false,
      sub_package_code_text: " ",
      sub_is_3p_num: false,
      sub_is_consent: false,
      sub_consent_text: " ",
      sub_is_root: false,
      sub_is_input: false,
      sub_input_level: 0,
      sub_sms_number: " ",
      sub_sms_number_text: " ",
      sub_is_sensitive: false,
    });
    this.showEsmeDropDown = false;
    this.totalFields = 0;
    this.enableInputValidity = true;
  }

  JsonStructureChangeUpdate(tree) {
    let savedJson = [];
    let Json = this.mainJson[0];

    if (Json.press_options.length > 0) {
      for (let updater of Json.press_options) {
        if (tree == "true") {
          updater = {
            ...updater,
            short_code_dtmf:
              "wl-" +
              this.startForm.value.serviceCode.short_code +
              "+" +
              updater.short_code_dtmf,
          };
        } else {
          updater = {
            ...updater,
            short_code_dtmf:
              this.startForm.value.serviceCode.short_code +
              "+" +
              updater.short_code_dtmf,
          };
        }

        if (updater.press_options.length > 0) {
          updater.press_options = this.updateChildNode(updater);
        }

        savedJson.push(updater);
      }
    }
    Json.press_options = savedJson;
    this.jsonStructureChangeChecker = true;
  }

  JsonStructureChange() {
    let savedJson = [];
    let Json = this.mainJson[0];

    if (Json.press_options.length > 0) {
      for (let updater of Json.press_options) {
        if (
          this.is_whitelist_checker &&
          this.startForm.value.serviceCode.is_whitelist == 0
        ) {
          updater = {
            ...updater,
            short_code_dtmf:
              "wl-" +
              this.startForm.value.serviceCode.short_code +
              "+" +
              updater.short_code_dtmf,
          };
        } else {
          updater = {
            ...updater,
            short_code_dtmf:
              this.startForm.value.serviceCode.short_code +
              "+" +
              updater.short_code_dtmf,
          };
        }

        if (updater.press_options.length > 0) {
          updater.press_options = this.updateChildNode(updater);
        }

        savedJson.push(updater);
      }
    }
    Json.press_options = savedJson;
    this.jsonStructureChangeChecker = true;
  }

  updateChildNode(child) {
    let savedJson = [];
    for (let updater of child.press_options) {
      updater = {
        ...updater,
        short_code_dtmf: child.short_code_dtmf + "+" + updater.short_code_dtmf,
      };

      if (updater.press_options.length > 0) {
        updater.press_options = this.updateChildNode(updater);
      }
      savedJson.push(updater);
    }
    return savedJson;
  }

  convertToJson(data: any) {
    let press_options = [];
    for (let menudata of data) {
      if (menudata.parent_id == "shortcode") {
        press_options.push({
          menu_press_options:
            menudata.menu_press_options == undefined
              ? null
              : menudata.menu_press_options,

          menu_unique: menudata.menu_unique,
          is_input: menudata.is_input,
          input_level: menudata.input_level,
          input_message: [
            menudata.input_1,
            menudata.input_2,
            menudata.input_3,
            menudata.input_4,
            menudata.input_5,
          ],
          is_package_code: menudata.is_package_code,
          package_code_text: menudata.package_code_text,
          is_3p_num: menudata.is_3p_num,
          menu_item_text: menudata.menu_item_text,
          is_consent: menudata.is_consent,
          is_root: menudata.is_root,
          consent_text: menudata.consent_text,
          take_user_input: menudata.take_user_input,
          user_input: menudata.user_input,
          short_code_dtmf: menudata.short_code_dtmf,
          has_menu: menudata.has_menu,
          service_code_id: menudata.service_code_id,
          action_id: menudata.action_id,
          created_by: menudata.created_by,
          created_dt: menudata.created_dt,
          redis_flag: menudata.redis_flag,
          id: menudata.id,
          parent_id: menudata.parent_id,
          charge_type: menudata.charge_type,
          is_chargeable: menudata.is_chargeable,
          optional_sms: menudata.optional_sms,
          sms_text: menudata.sms_text,
          amount: menudata.amount,
          wl_menu_item_text: menudata.wl_menu_item_text,
          transfer_ussdString:
            menudata.transfer_ussdString == null
              ? "null"
              : menudata.transfer_ussdString,
          is_transferable: menudata.is_transferable,
          esme_protocol: menudata.esme_protocol,
          service_code_flow: menudata.service_code_flow,
          sms_number: menudata.sms_number,
          sms_number_text: menudata.sms_number_text,
          is_sensitive: menudata.is_sensitive,
          press_options:
            this.recursiveConverttoJson(menudata, data) == undefined
              ? []
              : this.recursiveConverttoJson(menudata, data),
        });
      }
    }
    this.mainJson[0].press_options = press_options;

    this.convertTosingledtmf();

    console.log(this.mainJson);
    this.outputJson.emit(this.mainJson);
  }

  recursiveConverttoJson(menuData: any, data: any) {
    let press_options = [];
    for (let menudata of data) {
      if (menudata.parent_id == menuData.id) {
        press_options.push({
          menu_press_options:
            menudata.menu_press_options == undefined
              ? null
              : menudata.menu_press_options,
          menu_unique: menudata.menu_unique,
          is_input: menudata.is_input,
          input_level: menudata.input_level,
          input_message: [
            menudata.input_1,
            menudata.input_2,
            menudata.input_3,
            menudata.input_4,
            menudata.input_5,
          ],
          is_package_code: menudata.is_package_code,
          package_code_text: menudata.package_code_text,
          is_root: menudata.is_root,
          is_consent: menudata.is_consent,
          consent_text: menudata.consent_text,
          is_3p_num: menudata.is_3p_num,
          menu_item_text: menudata.menu_item_text,
          take_user_input: menudata.take_user_input,
          user_input: menudata.user_input,
          short_code_dtmf: menudata.short_code_dtmf,
          has_menu: menudata.has_menu,
          service_code_id: menudata.service_code_id,
          wl_menu_item_text: menudata.wl_menu_item_text,
          action_id: menudata.action_id,
          created_by: menudata.created_by,
          created_dt: menudata.created_dt,
          redis_flag: menudata.redis_flag,
          id: menudata.id,
          parent_id: menudata.parent_id,
          charge_type: menudata.charge_type,
          is_chargeable: menudata.is_chargeable,
          optional_sms: menudata.optional_sms,
          sms_text: menudata.sms_text,
          amount: menudata.amount,
          service_code_flow: menudata.service_code_flow,
          transfer_ussdString:
            menuData.transfer_ussdString == null
              ? "null"
              : menudata.transfer_ussdString,
          is_transferable: menudata.is_transferable,
          esme_protocol: menudata.esme_protocol,
          sms_number: menudata.sms_number,
          sms_number_text: menudata.sms_number_text,
          is_sensitive: menudata.is_sensitive,
          press_options:
            this.recursiveConverttoJson(menudata, data) == undefined
              ? []
              : this.recursiveConverttoJson(menudata, data),
        });
      }
    }
    return press_options;
  }

  convertTosingledtmf() {
    let savedJson = [];
    let Json = this.mainJson[0];

    if (Json.press_options.length > 0) {
      for (let updater of Json.press_options) {
        updater = {
          ...updater,
          short_code_dtmf: updater.menu_press_options,
        };

        if (updater.press_options.length > 0) {
          updater.press_options = this.updateChildNodeFunction(updater);
        }

        savedJson.push(updater);
      }
    }
    Json.press_options = savedJson;
  }

  updateChildNodeFunction(child) {
    let savedJson = [];
    for (let updater of child.press_options) {
      updater = {
        ...updater,
        short_code_dtmf: updater.menu_press_options,
      };

      if (updater.press_options.length > 0) {
        updater.press_options = this.updateChildNode(updater);
      }
      savedJson.push(updater);
    }
    return savedJson;
  }

  getPathCounter = 0;

  getPath(object, search) {
    if (object.menu_unique === search) return [object];
    else if (object.press_options || Array.isArray(object)) {
      let children = Array.isArray(object) ? object : object.press_options;
      for (let child of children) {
        let result = this.getPath(child, search);
        if (result) {
          this.getPathCounter = this.getPathCounter + 1;
          if (object.id) result.unshift(object);
          if (this.getPathCounter == 2) {
            this.titleMaintainer = child;
          }

          return result;
        }
      }
    }
  }

  testForm() {
    console.log("this.menuForm.value", this.menuForm.value);
    console.log("this.menuForm", this.menuForm);

    console.log("this.menuForm.value", this.subMenuForm.value);
    console.log("this.menuForm", this.subMenuForm);
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
    if (
      this.menuForm.value.menu_charge_type == 3 ||
      this.subMenuForm.value.sub_charge_type == 3
    ) {
      this.addressForm = this.formBuilder.group({
        addresses: this.formBuilder.array([this.createAddress()]),
      });
      this.addAddress(1);
    } else {
      this.addressForm ? this.addressForm.valid : null;
    }
  }

  checkEditChargeableTypes(slice_intervals) {
    this.addressForm = this.formBuilder.group({
      addresses: this.formBuilder.array([this.createAddress()]),
    });
    this.slice_interval = JSON.parse(slice_intervals);
    this.addAddress(this.slice_interval.length);
    this.numOfFiles = this.slice_interval.length;
    this.addresses.setValue(this.slice_interval);
    return 3;
  }
}
