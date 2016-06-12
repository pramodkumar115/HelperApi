helperApiApp.controller("JSONBuilderController", function ($scope, $http) {
    $scope.errorMsg = '';
    $scope.isJsonBuilt = false;
    $scope.isHtmlFormLoaded = false;
    $scope.aceOptions = {useWrapMode : true,
        //showGutter: false,
        theme:'twilight',
        mode: 'json'
    };
    hideBtn = false;
    $http.get("resources/MappedCodeConfig/MappedCodeData.json").success(function(response){
        $scope.mappedCodeData = JSON.stringify(response);
        $scope.mappedCodeData = JSON.parse($scope.mappedCodeData);
    });
    $http.get("resources/DataConfiguration/sampleConfiguration.json").success(function(response){
        $scope.jsonMetaData = JSON.stringify(response);
        $scope.jsonMetaData = vkbeautify.json($scope.jsonMetaData);
        jq.parseJSON($scope.jsonMetaData);
    });
    $scope.loadConfigDataFromSample = function(){
        $http.get("resources/DataConfiguration/sampleConfiguration.json").success(function(response){
            $scope.jsonMetaData = JSON.stringify(response);
            $scope.jsonMetaData = vkbeautify.json($scope.jsonMetaData);
            jq.parseJSON($scope.jsonMetaData);
        });
    }
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
                //if(subConfig.name!=config.name){
                    if(subConfig.dataType != undefined){
                        var type = subConfig.dataType.type;
                        if(type != undefined){
                            if(isBasicDataType(type)){
                                json[subConfig.name] = scope[configName];
                            }else if(type == 'MappedCode'){
                                json[subConfig.name] = getMappedCodeOf(scope.mappedCodeData,subConfig.dataType.codeType, scope[configName]);
                            }
                            else{
                                if(subConfig.dataType.isList != undefined){
                                    json[subConfig.name] = [];
                                    for(var cntr = 0; cntr < subConfig.dataType.listSize; cntr++){
                                        var dataConfig = getConfig(type, metadata);
                                        var data = getJsonElements(scope, dataConfig, metadata, cntr);
                                        json[subConfig.name].push(data);
                                    }
                                }else{
                                    var dataConfig = getConfig(type, metadata);
                                    json[subConfig.name] = getJsonElements(scope, dataConfig, metadata, counter);
                                }
                            }
                        }
                    }else{
                        // Nothing at present
                    }
                //}
            }
        }
    return json;
}