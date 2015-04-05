'use strict';

/**
 * @ngdoc overview
 * @name elasticSearchAngularApp
 * @description
 * # elasticSearchAngularApp
 *
 * Main module of the application.
 */
angular
  .module('elasticSearchAngularApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngHandsontable',
    'elasticsearch',
        'elasticSearchAngularApp.routes',
         'elasticSearchAngularApp.filters',
          'elasticSearchAngularApp.directives','oitozero.ngSweetAlert',
        'elasticSearchAngularApp.services','naif.base64', 'angularSpinner','ngTagsInput','ui.bootstrap','dialogs.main','loadingButton'
        
  ]).
  run(['$http', '$rootScope', 'userLanguage', 'translation', function ($http, $rootScope, userLanguage, translation) {
        var langRange = 'en-us';
        var language = 'en';
        var translated = false;

        var loadAngularI18n = function (langRange) {
            var angularI18nScript = '/bower_components/angular-i18n/angular-locale_' + langRange + '.js';
            $.getScript(angularI18nScript)
                .fail(function () {
                    console.warn('Could not load ' + angularI18nScript + ' for language: ' + langRange);
                    $.getScript('/bower_components/angular-locale_no.js');
                });
        };

        var loadAppI18n = function (language) {
            var supportedLanguages = ['en', 'fr'];
            if (supportedLanguages.indexOf(language) !== -1) {
                translation.getTranslation($rootScope, language);
            } else {
                console.warn('Unsupported language: ' + language + '. Using english default language.');
                translation.getTranslation($rootScope, 'en');
            }
        };

        var loadI18nResources = function () {
            console.log('Current user langRange:' + langRange + ' and language:' + language);
            loadAngularI18n(langRange);
            loadAppI18n(language);
        };

        if (sessionStorage) {
            if (sessionStorage.getItem('userLanguageRange')) {
                langRange = sessionStorage.getItem('userLanguageRange');
                language = userLanguage.getLanguage(langRange);
                loadI18nResources();
                translated = true;
            }
        }

        if (!translated) {
            translation.getTranslation($rootScope, language);
            $http.jsonp('http://ajaxhttpheaders.appspot.com?callback=JSON_CALLBACK').
                success(function (data) {
                    var acceptLang = data['Accept-Language'];
                    langRange = userLanguage.getFirstLanguageRange(acceptLang);
                    language = userLanguage.getLanguage(langRange);
                    if (sessionStorage) {
                        sessionStorage.setItem('userLanguageRange', langRange);
                    }
                }).
                finally(function () {
                    loadI18nResources();
                });
        }
    }]);
/*
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });})
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
    
  }]);
*/