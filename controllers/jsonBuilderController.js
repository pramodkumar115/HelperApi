helperApiApp.controller("JSONBuilderController", function ($scope, $http, ngDialog) {
    $scope.errorMsg = '';
    $scope.isJsonBuilt = false;
    $scope.isHtmlFormLoaded = false;
    $scope.files = [];
    $scope.baseValue = 'FacilityRequest';
    $scope.selectedItem = 'builder';
    /*$scope.showConfig = false;*/
    var reader = new FileReader();
    reader.onload= function(){
        console.log(this.result);
    }
    $scope.aceOptions = {useWrapMode : true,
        //showGutter: false,
        theme:'twilight',
        mode: 'json'
    };
    $scope.uploaded = function(){
        console.log($scope.files);
        for(var i in $scope.files){
            var file = $scope.files[i];
        } 
    }
    hideBtn = false;
    $http.get("resources/MappedCodeConfig/MappedCodeData.json").success(function(response){
        $scope.mappedCodeData = JSON.stringify(response);
        $scope.mappedCodeData = JSON.parse($scope.mappedCodeData);
    });
    $http.get("resources/DataConfiguration/sampleConfiguration.json").success(function(response){
        $scope.jsonMetaData = JSON.stringify(response);
        $scope.jsonMetaData = vkbeautify.json($scope.jsonMetaData);
    });
    $http.get("resources/DataConfiguration/sampleData.json").success(function(response){
        $scope.jsonData = JSON.stringify(response);
        $scope.jsonData = vkbeautify.json($scope.jsonData);
        
        //showmodal('jsonpopup');
    });
    $scope.showConfig = false;
    
    $scope.loadSavedData = function(){
        var data = jq.parseJSON($scope.jsonData);
        if(data != undefined){
            loadData(data, $scope, -1);
        }
    }
    
    document.getElementById("buildForm").click();
    
    $scope.createHtmlForm = function(){
        if($scope.jsonMetaData == null || $scope.jsonMetaData == ''){
            $scope.errorMsg = "No Metadata present. Please load the metadata and try"
        }else{
            $scope.errorMsg = '';
            var metadata = JSON.parse($scope.jsonMetaData);
            var mainConfig = getConfig("FacilityRequest", metadata);
            getHtmlElements(mainConfig, metadata, jq("#htmlForm"));
        }
    }
    $scope.getBuiltJSON = function(){
        var metadata = JSON.parse($scope.jsonMetaData);
        
        var config = getConfig($scope.baseValue, metadata);
        var json ={};
        json[config.name] = getJsonElements($scope, config, metadata, -1);
        $scope.jsonData = vkbeautify.json(JSON.stringify(json));
        $scope.isJsonBuilt = true;
    }
});

var getJsonElements = function(scope, config, metadata, counter){
    var json = {};
    if(config.fields!=undefined){
            for(var j in config.fields){
                var subConfig = config.fields[j];
                var configName = subConfig.name;
                if(counter != -1){
                    configName = subConfig.name + "_" +counter;
                }
                
                var type = subConfig.dataType;
                if(type != undefined){
                    if(isBasicDataType(type)){
                        if(scope[configName]!=undefined){
                            json[subConfig.name] = scope[configName];
                        }
                        
                    }else if(type == 'MappedCode'){
                        var mappedCodeVal = getMappedCodeOf(scope.mappedCodeData,subConfig.codeType, scope[configName]);
                        if(mappedCodeVal!=undefined){
                            json[subConfig.name] = mappedCodeVal;
                        }
                        
                    }
                    else{
                        if(subConfig.isArray != undefined && subConfig.isArray){
                            json[subConfig.name] = [];
                            var cntr = 0;
                            while(true){
                            //for(var cntr = 0; cntr < subConfig.dataType.listSize; cntr++){
                                var dataConfig = getConfig(type, metadata);
                                var data = getJsonElements(scope, dataConfig, metadata, cntr);
                                // Counter is checked max for 10 as the there can be not more than 10 array elements to avoid the memory leak in case of any issue
                                if(data == undefined || Object.keys(data).length === 0|| cntr == 10){
                                    break;
                                }else{
                                    json[subConfig.name].push(data);
                                    cntr++;
                                }
                            }
                        }else{
                            var dataConfig = getConfig(type, metadata);
                            var jsonData = getJsonElements(scope, dataConfig, metadata, counter);
                            if(Object.keys(jsonData).length !== 0){
                                json[subConfig.name] = jsonData;
                            }
                        }
                    }
                }
                
            }
        }
    return json;
}

var loadData = function(data, scope, counter){
    
    if(data != null){
        for(key in data){
            var indexKey = key;
            if(counter != -1 ){
                indexKey = key + "_"+counter;
            }
            var subData = data[key];
            if(typeof(subData) == 'object'){
                if(isMappedCode(subData)){
                    scope[indexKey] = subData.code;
                }else if(Array.isArray(subData)){
                    for(i in subData){
                        loadData(subData[i], scope, i);
                    }
                    console.log(subData);
                }else{
                    loadData(subData, scope, counter);
                }
                
            }else{
                scope[indexKey] = data[key];
            }
        }
    }
}
var isMappedCode = function(data){
    if(data != null && Object.keys(data).length > 0){
        if(data.code != undefined && data.codeType != undefined && data.codeDescription != undefined){
            return true;
        }
    }
    return false;
}