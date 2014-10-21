var scrumControllers = angular.module('ScrumControllers', ['sockRage']);

scrumControllers.controller('dashboardController', ['$scope', '$AngularSockr',
    function ($scope, $AngularSockr) {

        var ref = new SockRage(appConfig.sockrage_addr, appConfig.scrum_item_collection); //Create a reference

        var sync = $AngularSockr(ref); //create a $SockRageAngular instance

        $scope.scrumItems = sync.$asArray(); //assign sync array in a scope property

        $scope.states = ["To do", "Checkout", "Done"];
        $scope.hours = [];
        for (var i = 0; i < 501; i++) {
            $scope.hours.push(i);
        }

    }]
);