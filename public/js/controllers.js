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

            $interval(function () {

                if ($scope.scrumItems.length == 0
                    || $scope.scrumItems[$scope.scrumItems.length - 1].task_description != "") {

                    $scope.addAnonymousItemIfNotExists();
                }

            }, 500);

            $scope.setSelectedRow = function (selectedId) {
                $scope.selectedId = selectedId;
            };

            ref.on('getAll', function (data) {

                $scope.scrumItems = [];

                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    $scope.scrumItems[item.order_index] = item;
                }

                $scope.$apply();

            });

            ref.on("create", function (data) {

                $scope.scrumItems.push(data);
                $scope.$apply();

                //if the pushed data was not an anonymous data...
                if (data.task_description && data.task_description.length != ""
                    && $scope.scrumItems[$scope.scrumItems.length - 1].task_description.length > 0) {

                    $scope.addAnonymousItemIfNotExists();
                }
            });

            ref.on("update", function (data) {

                //updating the key
                $scope.scrumItems[data.data.order_index] = data.data;
                $scope.$apply();
            });

            ref.on("delete", function (data) {

                //everyone has to remove it from their index.
                $scope.scrumItems.splice(data.data.order_index, 1);
                updateOrderIndexLocal();

                //the remote arrays has to be updated with new indexes
                updateArrayRemote();
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

            $scope.sortableOptions = {
                stop: function (e, ui) {
                    /*
                     var item = ui.item.scope().item;
                     var fromIndex = ui.item.sortable.index;
                     var toIndex = ui.item.sortable.dropindex;
                     */

                    //updating new array key ==> order_index key
                    updateOrderIndexLocal();

                    //and then, when it's done, send it to the remote.
                    updateArrayRemote();
                }
            };

            $scope.updateScrumItem = function (item) {

                ref.update(item._id, item);
            }

            $scope.removeScrumItem = function (event, item) {

                if (event.keyCode == 8) {
                    ref.delete(item._id);
                }
            }

            $scope.navigateRow = function (event, index) {

                if (event.keyCode == 38) { //move up
                    index--;
                    $("#input-description-" + index).focus();
                }
                else if (event.keyCode == 40) { //move down
                    index++;
                    $("#input-description-" + index).focus();
                }

            }

            function updateOrderIndexLocal() {

                //updating new array key ==> order_index key
                for (var i = 0; i < $scope.scrumItems.length; i++) {
                    var item = $scope.scrumItems[i];
                    item.order_index = i;
                }
            }

            function updateArrayRemote() {

                for (var i = 0; i < $scope.scrumItems.length; i++) {

                    var item = $scope.scrumItems[i];

                    ref.update(item._id, item);
                }
            }

            ref.list();
        }]
);