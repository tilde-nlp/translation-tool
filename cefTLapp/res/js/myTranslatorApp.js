
var app = angular.module("myTranslatorApp", ['ngRoute','angular.filter']);

app.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider        
        .when('/about', {
            templateUrl: 'templates/about.html',
            controller: 'myPageCtrl'
        })
          .when('/hugo', {
              templateUrl: 'templates/hugo.html',
              controller: 'myPageCtrl'
          })
          .when('/mobileApp', {
              templateUrl: 'templates/mobileApplications.html',
              controller: 'myPageCtrl'
          })
        .when('/text', {
              templateUrl: 'templates/translate-text.html',
              controller: 'TranslateCtrl'
        })
          .when('/www', {
              templateUrl: 'templates/translate-website.html',
              controller: 'websiteTranslatorCtrl'
          })
           .when('/website', {             
               templateUrl: 'templates/translate-website.html',
               controller: 'websiteTranslatorCtrl'
           })           
           .when('/document', {
               templateUrl: 'templates/translate-document.html',
               controller: 'myPageCtrl'
           })         
        .otherwise({
            redirectTo: '/text'
        });
  }
]);




