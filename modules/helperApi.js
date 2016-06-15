var jq = jQuery.noConflict();
var helperApiApp = angular.module('HelperApi',['ngRoute','ui.ace'/*,'plupload.directive'*/]);
/*helperApiApp.config(['plUploadServiceProvider', function(plUploadServiceProvider) {

    plUploadServiceProvider.setConfig('flashPath', 'library/bower_components/plupload-angular-directive/plupload.flash.swf');
    plUploadServiceProvider.setConfig('silverLightPath', 'library/bower_components/plupload-angular-directive/plupload.silverlight.xap');
    plUploadServiceProvider.setConfig('uploadPath', 'index.html');

  }]);*/
helperApiApp.config(function($routeProvider){
    $routeProvider
    .when("/", {
        templateUrl: "views/home.html",
        controller: "HelperApiController"
    })
    .when("/xmlValidate", {
        templateUrl: "views/xmlValidator.html",
        controller: "XMLValidatorController"
    })
    .when("/jsonValidate", {
        templateUrl: "views/jsonValidator.html",
        controller: "JSONValidatorController"
    })
    .when("/convert", {
        templateUrl: "views/converter.html",
        controller: "ConverterController"
    })
    .when("/jsonBuild", {
        templateUrl: "views/jsonBuilder.html",
        controller: "JSONBuilderController"
    })    
});
helperApiApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
helperApiApp.directive('addjsonbutton', function(){
    return {
        restrict: 'E',
        template: '<button addjsonform>Build HTML Form</button>'
    }
});
helperApiApp.directive('addjsonform', function($compile){
    return function(scope, element, attrs){
        element.bind('click',function(){
            if(scope.jsonMetaData == null || scope.jsonMetaData == undefined ||scope.jsonMetaData == {}){
                scope.errorMsg = "No Metadata present. Please load the metadata and try";
            }else{
                console.log(scope.baseValue);
                if(scope.baseValue == undefined){
                    scope.errorMsg = "Please input base option name";
                }else{
                    scope.errorMsg = '';
                    jq('#htmlForm').empty();
                    var metadata = JSON.parse(scope.jsonMetaData);
                    var mainConfig = getConfig(scope.baseValue, metadata);
                    var dom = getHtmlElements(scope.baseValue, mainConfig, metadata, scope.mappedCodeData, -1);
                    scope.isHtmlFormLoaded = true;
                    angular.element(jq('#htmlForm')).append($compile(dom)(scope));
                }
            }
            
        })
    }
});

helperApiApp.directive('getConfigMainObjects', function($compile){
    return function(scope, element, attrs){
        element.bind('click',function(){
            var metadata = JSON.parse(scope.jsonMetaData);
            if(metadata!=null && metadata!=undefined){
                var baseElement = jq("#radioOptions");
                var dom = ('<select data-ng-model="baseValue"></select>');
                for(var i in metadata){
                    var opt = metadata[i];
                    dom.append('<option>'+opt.name+'</option>');
                }
                angular.element(baseElement).append($compile(dom)(scope));
            }
        })
    }
});





var getHtmlElements = function(name, config, metadata, mappedCodeData, counter){
    var divMain = jq("<div class='formDiv'></div>");
    var headerName = name;
    if(counter != -1){
        headerName = name + '_'+(counter + 1);
    }
    var collapseModelName = "collapsed_"+headerName;
    divMain.html("<div class='formHeader' ng-model='"+collapseModelName+"' ng-click='"+collapseModelName+"=!"+collapseModelName+"' >"+headerName+"<img src='resources/images/tiny-arrow-top.png' ng-show='"+collapseModelName+"'/><img src='resources/images/tiny-arrow-bottom.png' ng-show='!"+collapseModelName+"'/></div>");
    var divContent = jq("<div class='formData' ng-show='"+collapseModelName+"' > </div>");
    /*if(counter == -1){
        divContent = jq("<div class='formData' ng-show='!"+collapseModelName+"' > </div>");
    }*/
    divContent.appendTo(divMain);
    if(config.fields!=undefined){
        for(var j in config.fields){
            var subConfig = config.fields[j];
            var modelName = subConfig.name;
            if(counter != -1){
                modelName = subConfig.name + '_'+counter;
            }
            if(subConfig.name!=config.name){
                if(subConfig.dataType != undefined){
                    var type = subConfig.dataType.type;
                    if(type != undefined){
                        if(isBasicDataType(type)){
                            var basicElementLabel = jq("<span>"+subConfig.name+"</span>");
                            var basicElement = jq("<input type='text' data-ng-model='"+modelName+"'/>");
                            divContent.append(basicElementLabel);
                            divContent.append(basicElement);
                        }else if(type == "MappedCode"){
                            var mappedCodes = getMappedCodeOfType(mappedCodeData, subConfig.dataType.codeType);
                            var basicElementLabel = jq("<span>"+subConfig.name+"</span>");
                            var basicElement = jq("<select data-ng-model='"+modelName+"'></select>");
                            for(var key in mappedCodes){
                                var opt = mappedCodes[key];
                                basicElement.append('<option>'+opt.code+'</option>');
                            }
                            
                            divContent.append(basicElementLabel);
                            divContent.append(basicElement);
                        }
                        else{
                            if(subConfig.dataType.listSize != undefined && subConfig.dataType.listSize > 0){
                                for(var cntr = 0; cntr < subConfig.dataType.listSize; cntr++){
                                    var dataDiv = getHtmlElements(subConfig.name, getConfig(type, metadata), metadata, mappedCodeData, cntr);
                                    dataDiv.appendTo(divContent);
                                    var spacer = jq("<div style='height:15px'></div>");
                                    spacer.appendTo(divContent);
                                }
                            }else{
                                var dataDiv = getHtmlElements(subConfig.name, getConfig(type, metadata), metadata, mappedCodeData, counter);
                                dataDiv.appendTo(divContent);
                            }
                            
                        }
                    }
                }else{
                    // Nothing at present
                }
            }
        }
    }
    return divMain;
}
var isBasicDataType = function(type){
    var basicDataTypes = ['String', 'Integer', 'Double', 'Date'];
    for(var l in basicDataTypes){
        if(type == basicDataTypes[l]){
            return true;
        }
    }
    return false;
}
var getConfig = function(configName, metadata){
    for(var m in metadata){
        if(metadata[m].name == configName){
            return metadata[m];
        }
    }
}

var getMappedCodeOfType = function(mappedCodeData, codeType){
    var returnable = [];
    for(var i in mappedCodeData){
        if(mappedCodeData[i].codeType == codeType){
            returnable.push(mappedCodeData[i]);
        }
    }
    return returnable;
}
var getMappedCodeOf = function(mappedCodeData, codeType, code){
    for(var i in mappedCodeData){
        if(mappedCodeData[i].codeType == codeType && mappedCodeData[i].code == code){
            return mappedCodeData[i];
        }
    }
}