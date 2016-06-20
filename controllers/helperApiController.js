helperApiApp.controller("HelperApiController", function($scope, $location){
    // get the current path
    var location = $location.path();
    $location.path("/");
    
    $scope.home = function(){
        $scope.selectedItem = '';
        $location.path("/");
    }
})