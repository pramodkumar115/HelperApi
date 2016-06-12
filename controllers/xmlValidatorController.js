helperApiApp.controller("XMLValidatorController", function($scope){
    $scope.aceOptions = {useWrapMode : true,
                         //showGutter: false,
                         theme:'twilight',
                         mode: 'xml'
                        };
    $scope.errorMsg = '';
    $scope.successMsg = '';
    //var jq = $.noConflict();
    $scope.validateXML = function(){
        try{
            $scope.errorMsg = '';
            $scope.xmlData = vkbeautify.xml($scope.xmlData);
            jq.parseXML($scope.xmlData);
            $scope.successMsg = 'Valid XML';
        }
         catch(e){
            $scope.errorMsg = e.message;
            $scope.successMsg = '';
         }
    }
    $scope.clear = function(){
        $scope.xmlData = '';
        $scope.successMsg = '';
        $scope.errorMsg = '';
    }
})