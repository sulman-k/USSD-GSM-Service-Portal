"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ViewMenusComponent = void 0;
var core_1 = require("@angular/core");
var table_1 = require("@angular/material/table");
var animations_1 = require("@app/animations");
var draft_modal_component_1 = require("@app/shared/draft-modal/draft-modal.component");
var ViewMenusComponent = /** @class */ (function () {
    function ViewMenusComponent(router, allService, alertService, dialog) {
        this.router = router;
        this.allService = allService;
        this.alertService = alertService;
        this.dialog = dialog;
        this.sidenavOpened = true;
        this.displayedColumns = ["short_code", "code_title", "action"];
        this.dataSource = new table_1.MatTableDataSource();
        this.displayLoader = false;
    }
    ViewMenusComponent.prototype.ngOnInit = function () {
        this.getMenuList();
    };
    ViewMenusComponent.prototype.updateSidebar = function (e) {
        this.sidenavOpened = e;
    };
    ViewMenusComponent.prototype.getMenuList = function () {
        var _this = this;
        this.allService.getMenuList().subscribe({
            next: function (res) {
                if (!res.success) {
                    return false;
                }
                res.data = res.data.filter(function (el) { return el.short_code !== null; });
                _this.dataSource.data = [];
                _this.dataSource.data = res.data.reverse();
                _this.dataSource.paginator = _this.MatPaginator;
                _this.dataSource.sort = _this.sorter1;
            },
            error: function (e) {
                this.alert.danger(e.message);
                console.log("Error==============>", e);
            }
        });
    };
    ViewMenusComponent.prototype.viewMenu = function (element, name) {
        this.router.navigate(["/view-menu"], {
            state: { data: element, name: name }
        });
    };
    ViewMenusComponent.prototype.applyFilter = function (event) {
        var filterValue = event.target.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };
    ViewMenusComponent.prototype.addMenu = function () {
        this.router.navigate(["/menu-add"]);
    };
    ViewMenusComponent.prototype.deleteMenu = function (element) {
        var _this = this;
        var data = {
            service_code_id: element.service_code_id,
            is_whitelist: element.is_whitelist
        };
        var dialogRef = this.dialog.open(draft_modal_component_1.DraftModalComponent, {
            data: {
                name: "deleteMenu",
                heading: "Are you sure you want to delete this Menu?",
                data: data
            }
        });
        this.dialog.afterAllClosed.subscribe(function () { return _this.getMenuList(); });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.displayLoader = true;
        });
        dialogRef.componentInstance.onSave.subscribe(function (result) {
            _this.displayLoader = false;
        });
    };
    __decorate([
        core_1.ViewChild("sorter1")
    ], ViewMenusComponent.prototype, "sorter1");
    __decorate([
        core_1.ViewChild("MatPaginator")
    ], ViewMenusComponent.prototype, "MatPaginator");
    ViewMenusComponent = __decorate([
        core_1.Component({
            selector: "app-view-menus",
            templateUrl: "./view-menus.component.html",
            styleUrls: ["./view-menus.component.css"],
            animations: [animations_1.fadeInGrow]
        })
    ], ViewMenusComponent);
    return ViewMenusComponent;
}());
exports.ViewMenusComponent = ViewMenusComponent;
