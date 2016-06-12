helperApiApp.controller("JSONValidatorController", function($scope){
    $scope.aceOptions = {useWrapMode : true,
                         //showGutter: false,
                         theme:'twilight',
                         mode: 'json'
                        };
    $scope.errorMsg = '';
    $scope.successMsg = '';
    $scope.validateJSON = function(){
        try{
            $scope.errorMsg = '';
            $scope.jsonData = vkbeautify.json($scope.jsonData);
            jq.parseJSON($scope.jsonData);
            $scope.successMsg = 'Valid JSON';
        }
         catch(e){
            $scope.errorMsg = e.message;
            $scope.successMsg = '';
         }
    }
    $scope.clear = function(){
        $scope.jsonData = '';
        $scope.successMsg = '';
        $scope.errorMsg = '';
    }
})