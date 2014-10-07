var sockRageControllers = angular.module('ScrumControllers', ['sockRage']);

sockRageControllers.controller('dashboardController', ['$scope', '$AngularSockr',
    function ($scope, $AngularSockr) {

        var ref = new SockRage("http://localhost:3000", "scrum-data"); //Create a reference

        var sync = $AngularSockr(ref); //create a $SockRageAngular instance

        $scope.scrumItems = sync.$asArray(); //assign sync array in a scope property

        //test
        $scope.scrumItems.$set({
            task_description : "blabla",
            owner : "author",
            time_estimate : 999,
            time_reported : 888,
            state : "checkout"
        });

        

        /*
        $scope.messages.$set({message : "hello world !"}); //add data to synchronized array
        $scope.messages.$delete("someID"); //delete data to synchronized array
        $scope.messages.$update("someID", {message : "I updated this data !"}); //delete data to synchronized array
        */

    }]
);