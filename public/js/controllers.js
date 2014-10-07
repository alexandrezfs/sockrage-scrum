var sockRageControllers = angular.module('ScrumControllers', ['sockRage']);

sockRageControllers.controller('dashboardController', ['$scope', '$AngularSockr',
    function ($scope, $AngularSockr) {

        var ref = new SockRage("http://localhost:3000", "scrum-data"); //Create a reference

        var sync = $AngularSockr(ref); //create a $SockRageAngular instance

        $scope.scrumItems = sync.$asArray(); //assign sync array in a scope property

        $scope.scrumItem = {};

        $scope.addScrumItem = function(scrumItem) {

            if($scope.createScrumItemForm.$valid){

                $scope.scrumItems.$set({
                    task_description : scrumItem.task_description,
                    owner : scrumItem.owner,
                    time_estimate : scrumItem.time_estimate,
                    time_reported : new Date().getTime(),
                    state : "To do"
                });

                $scope.scrumItem = {};

            }

        }

        $scope.updateScrumItem = function(scrumItem) {

            $scope.scrumItems.$update(scrumItem._id, {
                task_description : scrumItem.task_description,
                owner : scrumItem.owner,
                time_estimate : scrumItem.time_estimate,
                time_reported : scrumItem.time_reported,
                state : scrumItem.state
            });

            $scope.scrumItem = {};

        }

        $scope.deleteScrumItem = function(scrumItem_id) {

            $scope.scrumItems.$delete(scrumItem_id);

        }

    }]
);