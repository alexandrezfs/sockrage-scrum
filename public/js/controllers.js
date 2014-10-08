var sockRageControllers = angular.module('ScrumControllers', ['sockRage']);

sockRageControllers.controller('dashboardController', ['$scope', '$AngularSockr',
    function ($scope, $AngularSockr) {

        var ref = new SockRage(appConfig.sockrage_addr, appConfig.scrum_item_collection); //Create a reference

        var sync = $AngularSockr(ref); //create a $SockRageAngular instance

        $scope.scrumItems = sync.$asArray(); //assign sync array in a scope property

        $scope.scrumItem = {};
        $scope.scrumItemToUpdate = {};

        $scope.addScrumItem = function (scrumItem) {

            if ($scope.createScrumItemForm.$valid) {

                $scope.scrumItems.$set({
                    task_description: scrumItem.task_description,
                    owner: scrumItem.owner,
                    time_estimate: scrumItem.time_estimate,
                    time_reported: new Date().getTime(),
                    state: "To do"
                });

                $scope.scrumItem = {};

            }
            else {
                toastr.error("Invalid form. Please check your fields");
            }

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

            bootbox.confirm("Are you sure you want to delete this item ?", function(result) {
                $scope.scrumItems.$delete(scrumItem_id);
            });

        }

    }]
);