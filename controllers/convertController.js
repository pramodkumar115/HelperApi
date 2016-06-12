helperApiApp.controller("ConverterController", function($scope){
    $scope.aceOptions = {useWrapMode : true,
                         //showGutter: false,
                         theme:'twilight'
                        };
    $scope.validateOption = function(){
        if ($scope.typeOfData == undefined || $scope.typeOfData == null){
            $scope.errorMsg = "Please select an option from the dropdown";
            $scope.dataVal = "";
        }else{
            $scope.errorMsg = "";
        }
    }
    $scope.onChangeOption = function(){
        if($scope.typeOfData != undefined){
            $scope.aceOptions.mode = $scope.typeOfData;
            $scope.errorMsg = "";
        }
    }
    $scope.errorMsg = '';
		$scope.successMsg = '';
        var x2js = new X2JS();
		$scope.convert = function(){
			try{
				$scope.errorMsg = '';
                $scope.aceOptions.mode = $scope.typeOfData;
				if ($scope.typeOfData == "xml"){
					$scope.dataVal =vkbeautify.json(JSON.stringify(x2js.xml_str2json($scope.dataVal)));
                    jq.parseXML($scope.dataVal);
                    $scope.successMsg = 'Converted xml to json';
                    $scope.aceOptions.mode = "json";
				}
				else if($scope.typeOfData == "json"){
                    $scope.dataVal =vkbeautify.xml(x2js.json2xml_str(jq.parseJSON(($scope.dataVal))));
                    jq.parseJSON($scope.dataVal);
                    $scope.successMsg = 'Converted json to xml';
                    $scope.aceOptions.mode = "xml";
				}
				else{
					alert("Please select one of the above options");
				}
				
			}
			 catch(e){
			 	$scope.errorMsg = e.message;
			 	$scope.successMsg = '';
			 }
		}
		$scope.clear = function(){
			$scope.dataVal = '';
			$scope.successMsg = '';
			$scope.errorMsg = '';
		}
})