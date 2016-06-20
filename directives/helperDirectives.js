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
        template: '<button addjsonform id="buildForm">Reload Form</button>'
    }
});
helperApiApp.directive('addjsonform', function($compile){
    return function(scope, element, attrs){
        setTimeout(function(){
            getHtmlBuilt(scope, element, attrs, $compile);
        }, 500);
        element.bind('click',function(){
            getHtmlBuilt(scope, element, attrs, $compile);
        })
    }
});

var getHtmlBuilt = function(scope, element, attrs, compile){
    if(scope.jsonMetaData == null || scope.jsonMetaData == undefined ||scope.jsonMetaData == {}){
                scope.errorMsg = "No Metadata present. Please load the metadata and try";
            }
    else{
        if(scope.baseValue == undefined){
            scope.errorMsg = "Please input base option name";
        }else{
            scope.errorMsg = '';
            jq('#htmlForm').empty();
            var metadata = JSON.parse(scope.jsonMetaData);
            var mainConfig = getConfig(scope.baseValue, metadata);
            var dom = getHtmlElements(scope.baseValue, mainConfig, metadata, scope.mappedCodeData, -1, scope);
            scope.isHtmlFormLoaded = true;
            angular.element(jq('#htmlForm')).append(compile(dom)(scope));
        }
    }
}

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


helperApiApp.directive('addarrayelements', function($compile){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            element.bind('click',function(){
                var metadata = JSON.parse(scope.jsonMetaData);
                var config = getConfig(attrs.arrayitem, metadata);
                var parentDiv = jq(element).parent();
                var counter = 0;
                if(parentDiv.children() != undefined && parentDiv.children().length > 0){
                    counter = parentDiv.children().length - 1;
                }
                var item = getHtmlElements(attrs.arrayitem, config, metadata, scope.mappedCodeData, counter, scope);
                angular.element(parentDiv).append($compile(item)(scope));
            })
        }
    } 
});