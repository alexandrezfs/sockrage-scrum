var sockRageControllers = angular.module('ScrumControllers', ['sockRage', 'ngGrid']);

sockRageControllers.controller('dashboardController', ['$scope', '$AngularSockr',
    function ($scope, $AngularSockr) {

        $scope.globals = {
            justAdded : false,
            justDeleted : false,
            justUpdated : false,
            removeTap : 0,
            updateTimeout : 0
        };

        var ref = new SockRage(appConfig.sockrage_addr, appConfig.scrum_item_collection); //Create a reference

        var sync = $AngularSockr(ref); //create a $SockRageAngular instance

        $scope.scrumItems = sync.$asArray(); //assign sync array in a scope property

        $scope.states = ["To do", "Checkout", "Done"];
        $scope.hours = [];
        for (var i = 0; i < 501; i++) {
            $scope.hours.push(i);
        }
        $scope.cellSelectEditableTemplateState = '<select class="form-control small-select-box" ng-model="scrumItems[row.rowIndex].state" ng-change=\"updateScrumItemInline(scrumItems[row.rowIndex])\"><option ng-repeat="state in states">{{ state }}</option></select>';
        $scope.cellSelectEditableTemplateTimeEstimate = '<select class="form-control small-select-box" ng-model="scrumItems[row.rowIndex].time_estimate" ng-change=\"updateScrumItemInline(scrumItems[row.rowIndex])\"><option ng-repeat="hour in hours">{{ hour }}</option></select>';
        $scope.cellSelectEditableTemplateTimeReported = '<select class="form-control small-select-box" ng-model="scrumItems[row.rowIndex].time_reported" ng-change=\"updateScrumItemInline(scrumItems[row.rowIndex])\"><option ng-repeat="hour in hours">{{ hour }}</option></select>';
        $scope.optionsTemplate = '<div class="btn-group btn-options-container"><button ng-click="deleteScrumItem(scrumItems[row.rowIndex]._id)" class="btn btn-danger btn-xs dropdown-toggle" type="button" >Remove</button></div>';

        $scope.gridScrumItemsOptions = {
            data: 'scrumItems',
            enableColumnResize: false,
            enableColumnReordering: false,
            enableCellEditOnFocus: true,
            enableRowReordering: true,
            enableRowSelection: true,
            multiSelect: false,
            columnDefs: [
                {field: 'order_id', displayName: '#', enableCellEdit: false, sortable: false},
                {field: 'task_description', displayName: 'Task', enableCellEdit: true, sortable: false},
                {field: 'owner', displayName: 'Owner', enableCellEdit: true, sortable: false},
                {field: 'time_estimate', displayName: 'Time estimate', enableCellEdit: false, cellTemplate: $scope.cellSelectEditableTemplateTimeEstimate, sortable: false},
                {field: 'time_reported', displayName: 'Time reported', enableCellEdit: false, sortable: false, cellTemplate: $scope.cellSelectEditableTemplateTimeReported},
                {field: 'state', displayName: 'State', enableCellEdit: true, cellTemplate: $scope.cellSelectEditableTemplateState, enableCellEdit: false, sortable: false}
            ],
            plugins: [ new ngGridDraggableRow('_id'), new ngGridFlexibleHeightPlugin() ],
            selectedItems: []
        };

        $scope.scrumItem = {};
        $scope.scrumItemToUpdate = {};

        $scope.$on('ngGridEventEndCellEdit', function (evt) {

            var entity = evt.targetScope.row.entity;

            $scope.updateScrumItemInline(entity);
        });

        $scope.$on('ngGridEventData', function (evt) {

            var scrumItemsCache = angular.copy($scope.scrumItems);

            //sort by order ID
            for(var i = 0; i < scrumItemsCache.length; i++) {

                var itemCache = scrumItemsCache[i];
                $scope.scrumItems[itemCache.order_id] = itemCache;

                console.log("assign = " + itemCache.order_id + " to " + itemCache.task_description);
            }

        });

        $scope.$on('ngGridEventRows', function (evt) {

            //Just added a row, scroll down + set selected the last row.
            if($scope.globals.justAdded) {

                $scope.gridScrumItemsOptions.selectRow($scope.scrumItems.length - 1, true);
                window.scrollTo(0, document.body.scrollHeight);

                $scope.globals.justAdded = false;
            }

            if($scope.globals.justDeleted) {

                console.log("del");

                $scope.updateItemKeys();

                $scope.globals.justDeleted = false;
            }

        });

        $scope.updateItemKeys = function() {

            console.log($scope.gridScrumItemsOptions.ngGrid);

            for(var i = 0; i < $scope.gridScrumItemsOptions.ngGrid.data.length; i++) {

                var item = $scope.gridScrumItemsOptions.ngGrid.data[i];

                item = angular.copy(item);

                var id = item._id;
                delete item['_id'];
                item.order_id = i;

                console.log("update " + item.task_description + " to " + i);

                $scope.scrumItems.$update(id, item);
            }

            //console.log($scope.scrumItems);

        }

        $scope.keyupOnTable = function(e) {

            if ($scope.gridScrumItemsOptions.selectedItems[0]) {

                var selectedItem = $scope.gridScrumItemsOptions.selectedItems[0];

                if (e.keyCode == 8
                    && selectedItem.task_description.length == 0) {

                    if($scope.globals.removeTap > 0) { //We only delete an entry on double tap !
                        $scope.deleteScrumItem(selectedItem._id);
                        $scope.globals.removeTap = 0;
                    }
                    else {
                        $scope.globals.removeTap++;
                        setTimeout(function() {
                            $scope.globals.removeTap = 0;
                        }, 500);
                    }

                }
                else if(e.keyCode == 9) {
                    $scope.globals.justAdded = true;
                    $scope.addAnonymousScrumItem();
                }

            }

        }

        $scope.addAnonymousScrumItem = function() {
            $scope.scrumItems.$set({
                order_id: $scope.scrumItems.length,
                task_description: "NEW TASK",
                owner: "ANONYMOUS",
                time_estimate: 0,
                time_reported: 0,
                state: "To do"
            });
        }

        $scope.addScrumItem = function (scrumItem) {

            if ($scope.createScrumItemForm.$valid) {

                if (scrumItem.time_estimate > 500 || scrumItem.time_estimate < 1) {
                    toastr.error("Estimate time should be between 1H and 500H");
                }
                else {

                    $scope.scrumItems.$set({
                        order_id: $scope.scrumItems.length,
                        task_description: scrumItem.task_description,
                        owner: scrumItem.owner,
                        time_estimate: scrumItem.time_estimate,
                        time_reported: 0,
                        state: "To do"
                    });

                    $scope.scrumItem = {};
                }

            }
            else {
                toastr.error("Invalid form. Please check your fields");
            }

        }

        $scope.updateScrumItemInline = function (scrumItem) {

            var id = scrumItem._id;
            delete scrumItem['_id'];

            $scope.scrumItems.$update(id, scrumItem);

        }

        $scope.deleteScrumItem = function (scrumItem_id) {

            bootbox.confirm("Are you sure you want to delete this item ?", function (result) {
                $scope.globals.justDeleted = true;
                $scope.scrumItems.$delete(scrumItem_id);
            });

        }

    }]
);