var sockRageControllers = angular.module('ScrumControllers', ['sockRage', 'ngGrid']);

sockRageControllers.controller('dashboardController', ['$scope', '$AngularSockr',
    function ($scope, $AngularSockr) {

        var ref = new SockRage(appConfig.sockrage_addr, appConfig.scrum_item_collection); //Create a reference

        var sync = $AngularSockr(ref); //create a $SockRageAngular instance

        $scope.scrumItems = sync.$asArray(); //assign sync array in a scope property

        $scope.states = ["To do", "Checkout", "Done"];
        $scope.hours = [];
        for (var i = 1; i < 501; i++) {
            $scope.hours.push(i);
        }
        $scope.cellSelectEditableTemplateState = '<select class="form-control small-select-box" ng-model="scrumItems[row.rowIndex].state" ng-change=\"updateScrumItemInline(scrumItems[row.rowIndex])\"><option ng-repeat="state in states">{{ state }}</option></select>';
        $scope.cellSelectEditableTemplateTimeEstimate = '<select class="form-control small-select-box" ng-model="scrumItems[row.rowIndex].time_estimate" ng-change=\"updateScrumItemInline(scrumItems[row.rowIndex])\"><option ng-repeat="hour in hours">{{ hour }}</option></select>';
        $scope.optionsTemplate = '<div class="btn-group btn-options-container"><button ng-click="deleteScrumItem(scrumItems[row.rowIndex]._id)" class="btn btn-danger btn-xs dropdown-toggle" type="button" >Remove</button></div>';

        $scope.gridScrumItemsOptions = {
            data: 'scrumItems',
            enableColumnResize: false,
            enableColumnReordering: false,
            columnDefs: [
                {field: '_id', displayName: 'ID', enableCellEdit: false, sortable: false},
                {field: 'task_description', displayName: 'Task', enableCellEdit: true, sortable: false},
                {field: 'owner', displayName: 'Owner', enableCellEdit: true, sortable: false},
                {field: 'time_estimate', displayName: 'Time estimate', enableCellEdit: false, cellTemplate: $scope.cellSelectEditableTemplateTimeEstimate, sortable: false},
                {field: 'time_reported', displayName: 'Time reported', enableCellEdit: false, cellFilter: "date:'medium'", sortable: false},
                {field: 'state', displayName: 'State', enableCellEdit: true, cellTemplate: $scope.cellSelectEditableTemplateState, enableCellEdit: false, sortable: false},
                {displayName: 'Options', cellTemplate: $scope.optionsTemplate, sortable: false}
            ]
        };

        $scope.scrumItem = {};
        $scope.scrumItemToUpdate = {};

        $scope.$on('ngGridEventEndCellEdit', function (evt) {

            var entity = evt.targetScope.row.entity;

            $scope.updateScrumItemInline(entity);
        });

        $scope.addScrumItem = function (scrumItem) {

            if ($scope.createScrumItemForm.$valid) {

                if (scrumItem.time_estimate > 500 || scrumItem.time_estimate < 1) {
                    toastr.error("Estimate time should be between 1H and 500H");
                }
                else {

                    $scope.scrumItems.$set({
                        task_description: scrumItem.task_description,
                        owner: scrumItem.owner,
                        time_estimate: scrumItem.time_estimate,
                        time_reported: new Date().getTime(),
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

            $scope.scrumItems.$update(scrumItem._id, {
                task_description: scrumItem.task_description,
                owner: scrumItem.owner,
                time_estimate: scrumItem.time_estimate,
                time_reported: scrumItem.time_reported,
                state: scrumItem.state
            });

            toastr.success("Item " + scrumItem._id + " successfully updated !");

        }

        $scope.updateScrumItem = function (scrumItem) {

            if ($scope.updateScrumItemForm.$valid) {

                $scope.scrumItems.$update(scrumItem._id, {
                    task_description: scrumItem.task_description,
                    owner: scrumItem.owner,
                    time_estimate: scrumItem.time_estimate,
                    time_reported: scrumItem.time_reported,
                    state: scrumItem.state
                });

                $scope.scrumItemToUpdate = {};

                $('#modalUpdateScrumItem').modal('hide');

                toastr.success("Item " + scrumItem._id + " successfully updated !");
            }
            else {
                toastr.error("Invalid form. Please check your fields");
            }

        }

        $scope.openUpdateModalWindow = function (scrumItem) {

            $("#modalUpdateScrumItemLabel").html("Update task " + scrumItem._id);

            $scope.scrumItemToUpdate = angular.copy(scrumItem);
        }

        $scope.deleteScrumItem = function (scrumItem_id) {

            bootbox.confirm("Are you sure you want to delete this item ?", function (result) {
                $scope.scrumItems.$delete(scrumItem_id);
            });

        }

    }]
);