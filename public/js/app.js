/**
 * BUILT WITH ANGULAR JS
 * SCRUM CLIENT
 */

var Scrum = angular.module('Scrum', [
    'ngRoute',
    'ScrumControllers',
    'ScrumServices',
    'ScrumFilters'
]);

Scrum.run(function ($rootScope, $location) {
    $rootScope.location = $location;
});

Scrum.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'dashboard.html',
                controller: 'dashboardController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);