'use strict';

/* Services */
angular.module('elasticSearchAngularApp.services', ['ngResource'])
    .value('version', '1.0')
    .directive('fileModel', ['$parse', function ($parse) {
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
}]).factory('Data', function () {
    return { Id: '' };
})
    // elasticsearch.angular.js creates an elasticsearch
    // module, which provides an esFactory
     .service('es', ['esFactory', function (esFactory) {
        return esFactory({
            hosts: [
                'localhost:9200'
            ],
            log: 'trace'
        });
    }])
    .factory('searchService', ['es', function (es) {
        return {
            'fullTextSearch': function (from, size, text) {
                return es.search({
                    index: 'searchtest2',
                    type: 'rfp',
                    body: {
    'from': from,
    'size': size,
    "fields": [
        "filename","author"
    ],
    'query': {
        "bool": {
            "must": [
                {
                    "nested": {
                        "path": "couple",
                        "query": {
                            "bool": {
                                "should": [
                                    {
                                        "multi_match": {
                                            "fields":["couple.question","couple.response"] ,
                                                "query": text,
                                                "slop": 50,
                                                "type": "phrase"
                                            }
                                        }
                                    
                                ],
                                "must": [
{
                                        "multi_match": {
                                            "fields":["couple.question","couple.response"] ,
                                                "query": text,
                                                  "minimum_should_match": "50%"
                                            }
                                        }
                                ]
                            }
                        },
                        "inner_hits": {    "highlight": {
                              "pre_tags" : ["<strong>"],
        "post_tags" : ["</strong>"],

"fields": {

"response" : {"fragment_size" :70 },"question" : {"fragment_size" :70 }

}

}}
                    }
                }
            ]
        }
    },
    'facets': {
        "tagslist": {
            "terms": {
                "field": "tags"
            }
        },
"authorlist": {
            "terms": {
                "field": "author"
            }
        }

    }
    
}






                });
            },

            'autocomplete': function (text) {
                return es.search({
                    index: 'searchtest2',
                    type: 'rfp',
                    body: {
                        'fields': [
                            'tags'
                            
                           
                        ],
                        'query': {"prefix" : { "tags" : text }},
                        'highlight': {
                            'number_of_fragments': 0,
                            'pre_tags': [
                                ''
                            ],
                            'post_tags': [
                                ''
                            ],
                            'fields': {
                                'tags': {}
                            }
                        }
                    }
                });
            },'index': function (rfp) {
                return es.create({
  index: 'searchtest2',
  type: 'rfp',
  body: {
    file: rfp.file,
    filename:rfp.filename,
    filedate:rfp.filedate,
    author:rfp.author,
    couple:rfp.couple,
    tags:rfp.tags,
    sheets:rfp.sheets,
    complete:rfp.complete
  }});
},
  'checkexist': function (text,date) {
                return es.search({
                    index: 'searchtest2',
                    type: 'rfp',
                    body: {
    'fields': [
        'filename'
    ],
    'query': {
        'filtered': {
            'filter': {"bool" : {
                    "must" : [
                {'term': {
                    'filename': text
                }},{'term': {
                    'filedate': date}}]}
            }
        }
    }
}   }); },
                'getfilesheet':function(idd){
                    return es.get({ index: 'searchtest2',
  type: 'rfp',
  id: idd
});






                },
                'update':function(idd,paire,feuille){
                    return es.update({ index: 'searchtest2',
  type: 'rfp',
  id: idd,
  body: {
   script: 'if (ctx._source.sheets.size()==1){ctx._source.complete=complete}else ctx._source.complete=uncomplete; ctx._source.couple += coupl ;ctx._source.sheets=sheet',
    params: {
        coupl: paire,sheet:feuille,complete:true,uncomplete:false
    }
  }
});

                },
                  'uncompletefiles': function () {
                return es.search({
                    index: 'searchtest2',
                    type: 'rfp',
                    body: {
    'fields': [
        'filename'
    ],
    'query': {
        'filtered': {
            'filter': {"bool" : {
                    "must" : [
                {'term': {
                    'complete': false
                }}]}
            }
        }
    }
}   }); },

 'gettags':function()
{
return es.search({
                    index: 'searchtest',
                    
                    body: {

    "fields": ["tags"]
}});





}
        };
    }])

    .value('userLanguage', {
        getFirstLanguageRange: function (acceptLang) {
            if (acceptLang === undefined) {
                return undefined;
            }
            var languages = acceptLang.split(',');
            var firstLangRangeMaybeQuota = languages[0];
            var firstLangRange = firstLangRangeMaybeQuota.split(';');
            if (firstLangRange) {
                return firstLangRange[0];
            }
            return firstLangRangeMaybeQuota;
        },
        getLanguage: function (languageRange) {
            var extractPartsReg = /^([\w\*]*)(-(\w*))?.*$/i;

            var match = languageRange.trim().match(extractPartsReg);

            if (!match) {
                return undefined;
            }
            // parse language
            var parseLangReg = /^([a-z]{2}|\*)$/i;
            var lang = match[1];
            if (lang) {
                var langMatch = lang.match(parseLangReg);
                if (langMatch) {
                    return langMatch[0].toLowerCase();
                }
            }
            return undefined;
        }
    }).service('translation', ['$resource', function ($resource) {
        this.getTranslation = function ($scope, language) {
            var languageFilePath = 'i18n/app-locale_' + language + '.json';
            $resource(languageFilePath).get(function (data) {
                $scope.translation = data;
            });
        };
    }]).service('fileUpload', ['$http','$q','$rootScope' ,function ($http,$q,$rootScope) {
    this.uploadFileToUrl = function(file,name, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('name',name);

        var d = $q.defer();
        $http.defaults.headers.put = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        };
        $http.defaults.useXDomain = true;
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(
        function(response) {d.resolve(response);
            $rootScope.jsonSheet=response.rows;
            console.log($rootScope.jsonSheet);
            })
        .error(function(){
        });return d.promise;
    }}]).service('getSheets', ['$http','$q','$rootScope' ,function ($http,$q,$rootScope) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        var d = $q.defer();
        $http.defaults.headers.put = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        };
        $http.defaults.useXDomain = true;
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(
        function(response) {d.resolve(response);
            $rootScope.optionss=response;
            console.log($rootScope.optionss);
            })
        .error(function(){
        });return d.promise;
    }}]);

