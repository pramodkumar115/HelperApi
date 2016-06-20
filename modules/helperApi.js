var jq = jQuery.noConflict();
var helperApiApp = angular.module('HelperApi',['ngRoute','ui.ace','ngAnimate', 'ngDialog'/*,'plupload.directive'*/]);
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


var getHtmlElements = function(name, config, metadata, mappedCodeData, counter, scope){
    var divMain = jq("<div class='formDiv'></div>");
    var headerName = name;
    if(counter != -1){
        headerName = name + '_'+(counter + 1);
    }
    var collapseModelName = "collapsed_"+headerName;
    divMain.html("<div class='formHeader' ng-model='"+collapseModelName+"' ng-click='"+collapseModelName+"=!"+collapseModelName+"' >"+headerName+"<img src='resources/images/tiny-arrow-top.png' ng-hide='"+collapseModelName+"'/><img src='resources/images/tiny-arrow-bottom.png' ng-hide='!"+collapseModelName+"'/></div>");
    var divContent = jq("<div class='formData animate-hide' ng-hide='"+collapseModelName+"'> </div>");
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
                    var type = subConfig.dataType;
                    if(type != undefined){
                        if(isBasicDataType(type)){
                            var basicElementLabel = jq("<span>"+subConfig.name+"</span>");
                            var basicElement = jq("<input type='text' data-ng-model='"+modelName+"'/>");
                            divContent.append(basicElementLabel);
                            divContent.append(basicElement);
                        }else if(type == "MappedCode"){
                            var mappedCodes = getMappedCodeOfType(mappedCodeData, subConfig.codeType);
                            var basicElementLabel = jq("<span>"+subConfig.name+"</span>");
                            var basicElement = jq("<select data-ng-model='"+modelName+"'></select>");
                            for(var key in mappedCodes){
                                var opt = mappedCodes[key];
                                basicElement.append('<option value="'+opt.code+'">'+opt.codeDescription+'</option>');
                            }
                            
                            divContent.append(basicElementLabel);
                            divContent.append(basicElement);
                        }
                        else{
                            if(subConfig.isArray != undefined && subConfig.isArray){
                                var listDiv = jq("<div></div>");
                                var addButton = jq("<button class='arrayListBtn' addarrayelements arrayitem='"+subConfig.dataType+"'>Add "+subConfig.name+"</button>");
                                addButton.appendTo(listDiv);
                                listDiv.appendTo(divContent);
                                var spacer = jq("<div style='height:15px'></div>");
                                spacer.appendTo(divContent);
                            }else{
                                var dataDiv = getHtmlElements(subConfig.name, getConfig(type, metadata), metadata, mappedCodeData, counter, scope);
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