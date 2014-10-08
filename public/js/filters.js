angular.module('ScrumFilters', []).
    filter('domain',  function () {
        return function ( input ) {
            var matches,
                output = "",
                urls = /\w+:\/\/([\w|\.]+)/;

            matches = urls.exec( input );

            if ( matches !== null ) output = matches[1];

            return output;
        };
    })
    .filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });
