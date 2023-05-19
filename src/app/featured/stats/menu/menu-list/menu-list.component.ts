import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AllService } from "../../../../core/services/stats-service/all.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { MenuAddComponent } from "../menu-add/menu-add.component";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";
import * as d3 from "d3";
import { NgModuleResolver } from "@angular/compiler";
import { AlertService } from "ngx-alerts";
// import { element } from "protractor";

interface HierarchyDatum {
  name: string;
  children?: Array<any>;
}

@Component({
  selector: "app-menu-list",
  templateUrl: "./menu-list.component.html",
  styleUrls: ["./menu-list.component.scss"],
})
export class MenuListComponent implements OnInit {
  response = [];
  whiteListgroup = [];
  whiteListValue = 0;
  mainObj: any = {};
  showAddNewChild;
  mainJson = [];
  state$: Observable<object>;
  press_options = [];
  jsonTreeData = [];
  showModal: string = "";
  showTextModal: string = "";
  nodeText: string = "";
  @ViewChild("child") childComp: MenuAddComponent;
  @ViewChild("chart", { static: true }) private chartContainer: ElementRef;
  treeControl = new NestedTreeControl<any>((node) => node.press_options);
  dataSource = new MatTreeNestedDataSource<any>();
  @ViewChild("tree") _tree: any;

  //will remove
  root: any;
  tree: any;
  treeLayout: any;
  svg: any;

  treeData: any;
  yaxis = 0;
  xaxis = 0;
  height: number;
  width: number;
  margin: any = { top: 200, bottom: 90, left: 100, right: 90 };
  duration: number = 750;
  nodeWidth: number = 5;
  nodeHeight: number = 5;
  nodeRadius: number = 5;
  horizontalSeparationBetweenNodes: number = 5;
  verticalSeparationBetweenNodes: number = 5;
  nodeTextDistanceY: string = "-5px";
  nodeTextDistanceX: number = 5;

  dragStarted: boolean;
  draggingNode: any;
  nodes: any[];
  selectedNodeByDrag: any;
  displayLoader: boolean = false;
  selectedNodeByClick: any;
  previousClickedDomNode: any;
  links: any;
  treeName: string;
  //end
  isLinear = false;
  whitelistChecker = history.state.name == "true" ? true : false;
  editWhiteListID: number;

  constructor(
    private router: Router,
    private allService: AllService,
    private alert: AlertService
  ) {
    if (history.state.data === undefined) {
      router.navigate(["/view-menus-list"]);
    }
  }
  hasChild = (_: number, node: any) =>
    !!node.press_options && node.press_options;
  opentree(node) {
    this._tree.treeControl.expandAll();
  }
  setTreeValue() {
    this.dataSource.data = null;
    this.dataSource.data = this.jsonTreeData[0].press_options;
    console.log("tree data source", this.dataSource.data);
  }
  ngOnInit(): void {
    if (history.state.data == undefined || history.state.data == null) {
      this.router.navigateByUrl("/view-menus-list");
      return;
    }
    this.whiteListValue = history.state.data.white_list_group_id;

    this.onSubmit(history.state.data.service_code_id);
    console.log("history.state.data", history.state.data);
    console.log("history.state.name", history.state.name);
    if (history.state.name == "true") {
      this.getWhiteListGroups();
    }

    this.treeName =
      history.state.name == "true"
        ? history.state.data.short_code + " Whitelist Tree"
        : history.state.data.short_code + " Normal Tree";
  }

  ngAfterViewInit() {
    console.log("this.childComp", this.childComp);
    this.childComp.getTransferableMenuList(
      history.state.name == "true" ? 1 : 0,
      history.state.data.service_code_id,
      history.state.data.is_root
    );
  }

  getChildValue(data: any) {
    this.jsonTreeData[0].press_options = [];
    this.jsonTreeData[0].press_options = data[0].press_options;

    console.log(this.jsonTreeData);
    d3.select("svg").remove();
    this.renderTreeChart();
    console.log("get json from child", data);
  }

  getWhiteListGroups() {
    this.allService.getWhiteListGroups().subscribe(
      (res) => {
        if (!res.success) {
          this.alert.danger("Unable to fetch white list group");
          return false;
        }
        this.whiteListgroup = res.data;
        console.log("this.whiteListgroup", this.whiteListgroup);
      },
      (error) => {
        this.alert.danger("Unable to fetch white list group");
      }
    );
  }

  changeWhiteListGroup(event) {
    this.whiteListValue = event;
    this.childComp.editWhitelistID = event;
  }

  onSubmit(id: any) {
    this.displayLoader = true;
    this.allService.getMenuById(id, history.state.name).subscribe({
      next: (res: any) => {
        (this.width = 12500), (this.height = 12500);
        for (let val of res.data) {
          if (val.id == "shortcode") {
            this.mainJson.push(val);
            console.log(val);
            val.menu_item_text = history.state.data.short_code;
            delete val.id;
            this.childComp.startForm.patchValue({
              serviceCode: val,
            });
            this.childComp.subServiceShortCode = history.state.data.short_code;
            this.childComp.menuWhiteListChecker = val.menuListCheck;
            this.childComp.serviceCodeNumber = history.state.data.short_code;
            this.childComp.editWhitelistID =
              history.state.data.white_list_group_id;
            this.jsonTreeData.push({
              menu_item_text: history.state.data.short_code,
            });
          }
        }

        this.response = res.data;
        this.convertToJson(res.data);
        this.displayLoader = false;
      },
      error(e) {
        console.log("Error==============>", e);
        this.displayLoader = false;
      },
    });
  }

  convertToJson(data: any) {
    for (let menudata of data) {
      if (menudata.parent_id == "shortcode") {
        this.press_options.push({
          menu_press_options:
            menudata.menu_press_options == undefined
              ? null
              : menudata.menu_press_options,
          is_input: menudata.is_input,
          input_level: menudata.input_level,
          input_message: [
            menudata.input_1,
            menudata.input_2,
            menudata.input_3,
            menudata.input_4,
            menudata.input_5,
          ],
          menu_unique: menudata.menu_unique,
          is_package_code: menudata.is_package_code,
          package_code_text:
            menudata.package_code_text == null
              ? "null"
              : menudata.package_code_text,
          is_3p_num: menudata.is_3p_num,
          is_consent: menudata.is_consent,
          consent_text:
            menudata.consent_text == null ? "null" : menudata.consent_text,
          is_root: menudata.is_root,
          menu_item_text: menudata.menu_item_text,
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
          slice_intervals:
            menudata.charge_type == 3 ? menudata.slice_intervals : [],
        });
      }
    }
    this.jsonTreeData[0].press_options = this.press_options;
    this.convertTosingledtmf();
    this.renderTreeChart();
    this.setTreeValue();
    this.childComp.mainJson[0].press_options =
      this.jsonTreeData[0].press_options;
    console.log(
      "this.jsonTreeData[0].press_options",
      this.jsonTreeData[0].press_options
    );
    console.log(
      "this.childComp.mainJson[0].press_options",
      this.childComp.mainJson[0].press_options
    );
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
          package_code_text:
            menudata.package_code_text == null
              ? "null"
              : menudata.package_code_text,
          is_3p_num: menudata.is_3p_num,
          is_consent: menudata.is_consent,
          is_root: menudata.is_root,
          consent_text:
            menudata.consent_text == null ? "null" : menudata.consent_text,
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
          slice_intervals:
            menudata.charge_type == 3 ? menudata.slice_intervals : [],
        });
      }
    }
    return press_options;
  }

  convertTosingledtmf() {
    let savedJson = [];
    let Json = this.jsonTreeData[0];

    if (Json.press_options.length > 0) {
      for (let updater of Json.press_options) {
        updater = {
          ...updater,
          short_code_dtmf: updater.menu_press_options,
        };

        if (updater.press_options.length > 0) {
          updater.press_options = this.updateChildNode(updater);
        }
        console.log(updater);
        savedJson.push(updater);
      }
    }
    Json.press_options = savedJson;
    console.log("this.mainJson[0]", this.mainJson[0]);
    console.log("Json", Json);
  }

  updateChildNode(child) {
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

  openCurrentNode(node: any) {
    this.mainObj = {};
    this.mainObj = node;
    console.log("mainObj", this.mainObj);
    this.showModal = "block";
  }
  showNodeText(d) {
    this.nodeText = d.data.menu_item_text;
    this.showTextModal = "block";
  }
  deleteCurrentNode() {
    this.closeModal();
    this.childComp.opendltMenuDialog(this.mainObj);
  }

  updateNode() {
    this.closeModal();
    this.childComp.updateMenu(this.mainObj);
  }
  addNewNode() {
    this.closeModal();
    console.log("idr aaaaa", this.mainObj);
    this.childComp.addChild(this.mainObj);
  }
  viewMenusList() {
    this.router.navigateByUrl("/view-menus-list");
  }
  closeModal() {
    this.showModal = "";
    this.showTextModal = "";
  }
  renderTreeChart() {
    this.setTreeValue();
    let element: any = this.chartContainer.nativeElement;
    console.log(document.getElementById("_svg"));
    if (document.getElementById("_svg") !== null) {
    } else {
      this.svg = d3
        .select(element)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("id", "_svg")
        .append("g")
        .attr("id", "_g")
        .attr("transform", "translate(" + this.margin.left + "," + 100 + ")");
    }

    this.tree = d3
      .tree()
      .size([this.height, this.width + 120])
      .nodeSize([
        this.nodeWidth + this.horizontalSeparationBetweenNodes,
        this.nodeHeight + this.verticalSeparationBetweenNodes,
      ])
      .separation((a, b) => {
        return a.parent == b.parent ? 5 : 5;
      });

    // Assigns parent, children, height, depth
    this.root = d3.hierarchy(this.jsonTreeData[0], (d) => {
      return d.press_options;
    });
    this.root.x0 = this.height / 2;
    this.root.y0 = 10;

    console.log("this.root", this.root);
    this.updateChart(this.root);
  }

  click = (d) => {
    console.log("click");

    if (d.data.menu_item_text == history.state.data.short_code) {
      return false;
    }

    if (d.data) {
      this.openCurrentNode(d.data);
      d._children = d.data;
      d.press_options = null;
    } else {
      d.press_options = d._children;
      d._children = null;
    }
    this.updateChart(d);
  };
  mouseover = (d) => {
    this.showNodeText(d);
  };
  mouseout = (d) => {
    clearTimeout();
    this.closeModal();
  };

  updateChart(source) {
    let domElement = document.getElementById("_svg");
    let w = domElement.getAttribute("width");
    let h = domElement.getAttribute("height");
    let new_w = Number(w) + 150;
    let new_h = Number(h) + 25;
    // domElement.removeAttribute("height");
    domElement.removeAttribute("width");
    domElement.setAttribute("width", `${new_w}`);
    // domElement.setAttribute("height", `${new_h}`);
    this.width = new_w;
    this.height = new_h;

    let i = 0;
    console.log("source", source);
    this.treeData = this.tree(this.root);
    this.nodes = this.treeData.descendants();
    this.links = this.treeData.descendants().slice(1);
    this.nodes.forEach((d) => {
      d.y = d.depth * 180;
    });

    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    for (let i = 0; i < this.nodes.length; i++) {
      tmp = this.nodes[i].x;
      if (tmp < lowest) lowest = tmp;
      if (tmp > highest) highest = tmp;
    }
    console.log(highest, lowest);
    this.yaxis = Math.abs(lowest) + 250;
    console.log("this.yaxis", this.yaxis);
    let gElement = document.getElementById("_g");

    gElement.removeAttribute("transform");
    gElement.setAttribute(
      "transform",
      "translate(" + this.margin.left + "," + this.yaxis + ")"
    );

    domElement.removeAttribute("height");
    domElement.setAttribute("height", `${highest + 13000}`);

    // console.log("this.svg", this.svg._groups[0][0].attributes[0] = trans);

    let node = this.svg.selectAll("g.node").data(this.nodes, (d) => {
      return d.id || (d.id = ++i);
    });

    let nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      });

    nodeEnter
      .append("circle")
      .attr("class", "node")
      .attr("r", 1e-6)
      .on("mousedown", this.click)
      .style("fill", (d) => {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", (d) => {
        return d.press_options || d._children ? -13 : 13;
      })
      .attr("text-anchor", (d) => {
        return d.press_options || d._children ? "end" : "start";
      })
      .on("click", this.mouseover)
      .style("font", "12px sans-serif")
      .text((d) => {
        console.log("d", d);
        if (d.data.menu_item_text.length > 10) {
          return (
            (d.data.menu_press_options == undefined
              ? ""
              : d.data.menu_press_options + ":") +
            d.data.menu_item_text.substring(0, 10).concat("...")
          );
        }
        return (
          (d.data.menu_press_options == undefined
            ? ""
            : d.data.menu_press_options + ":") + d.data.menu_item_text
        );
      });

    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr("transform", (d) => {
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeUpdate
      .select("circle.node")
      .attr("r", 10)
      .style("stroke-width", "3px")
      .style("stroke", "steelblue")
      .style("fill", (d) => {
        return d._children ? "lightsteelblue" : "#fff";
      })
      .attr("cursor", "pointer");

    let nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr("transform", (d) => {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle").attr("r", 1e-6);

    nodeExit.select("text").style("fill-opacity", 1e-6);

    let link = this.svg.selectAll("path.link").data(this.links, (d) => {
      return d.id;
    });

    let linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .style("fill", "none")
      .style("stroke", "#ccc")
      .style("stroke-width", "2px")
      .attr("d", function (d) {
        let o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    let linkUpdate = linkEnter.merge(link);

    linkUpdate
      .transition()
      .duration(this.duration)
      .attr("d", (d) => {
        return diagonal(d, d.parent);
      });

    let linkExit = link
      .exit()
      .transition()
      .duration(this.duration)
      .attr("d", function (d) {
        let o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    this.nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    function diagonal(s, d) {
      let path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
      return path;
    }
  }

  saveChanges() {
    this.childComp.d3TreeWidth = this.width;
    this.childComp.d3TreeHeight = this.height;

    this.childComp.saveJsonFromView(
      history.state.data.service_code_id,
      history.state.name
    );
  }
}
