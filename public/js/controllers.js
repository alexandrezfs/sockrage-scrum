var scrumControllers = angular.module('ScrumControllers', []);

scrumControllers.controller('dashboardController', ['$scope', '$timeout', '$interval',
    function ($scope, $timeout, $interval) {

        var ref = new SockRage(appConfig.sockrage_addr, appConfig.scrum_item_collection); //Create a reference

        $scope.states = ["To do", "Checkout", "Done"];
        $scope.hours = [];
        for (var i = 0; i < 501; i++) {
            $scope.hours.push(i);
        }

        $scope.scrumItems = [];

        ref.on('getAll', function (data) {

            console.log(data)
            console.log("---");

            $scope.scrumItems = [];

            for(var i = 0; i < data.length; i++) {
                var item = data[i];
                $scope.scrumItems[item.order_index] = item;
            }

            $scope.$apply();

        });

        $interval(function() {

            if ($scope.scrumItems.length == 0
                || $scope.scrumItems[$scope.scrumItems.length - 1].task_description != "") {

                console.log("passed.");

                $scope.addAnonymousItemIfNotExists();
            }

        }, 500);

        ref.on("create", function(data) {

            $scope.scrumItems.push(data);
            $scope.$apply();

            //if the pushed data was not an anonymous data...

            if(data.task_description && data.task_description.length != ""
                && $scope.scrumItems[$scope.scrumItems.length - 1].task_description.length > 0) {

                console.log("add as create");

                $scope.addAnonymousItemIfNotExists();
            }
        });

        ref.on("update", function(data) {

            console.log("update");

            ref.list();

        });

        $scope.addAnonymousItemIfNotExists = function () {

            ref.set({
                task_description: "",
                owner: "",
                time_estimate: 1,
                time_reported: 1,
                state: "To do",
                order_index: $scope.scrumItems.length
            });

        }

        $scope.updateScrumItem = function(item) {

            var _id = item._id;
            delete item['_id'];

            ref.update(_id, item);
        }

        ref.list();
    }]
);