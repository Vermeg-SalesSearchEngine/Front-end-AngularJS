'use strict';

/**
 * @ngdoc function
 * @name elasticSearchAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the elasticSearchAngularApp
 */
 angular.module('elasticSearchAngularApp')
 .controller('AboutCtrl', ['$scope','fileUpload','$rootScope','usSpinnerService','searchService','dialogs','getSheets','SweetAlert','Data','$window','$routeParams', function($scope,fileUpload,$rootScope,usSpinnerService,searchService,dialogs,getSheets,SweetAlert,Data,$window,$routeParams){
$scope.showz=true;
$scope.Data=Data;
$scope.Data.Id=$routeParams.id;
$scope.isSuccess = false;

// appel à partir d'une autre vue
if(typeof $scope.Data.Id != "undefined")
{$scope.showz=false;
  searchService.getfilesheet($scope.Data.Id).then(function (res) {
$scope.base64=res._source.file;
$scope.options=res._source.sheets;
        });
          
          
        }
/*if (Data.Id=='')
{alert('aaa');

}  */

/*searchService.gettags().then(
                function (resp) {
                    $scope.alltags = resp;
                   console.log($scope.alltags.hits.hits.fields);
                }
                );*/






$scope.uploadFile = function(){

 
  var file = $scope.myFile;
  var name=$scope.myselect;

       // console.log('file is ' + $scope.filebase.base64);
       var uploadUrl = "http://localhost:7000/convert/toJson/";
       var uploadUrl2 = "http://localhost:7000/convert/estoJson/";
       if (typeof name === "undefined")
       {
        return;}

        
        $scope.startSpin();
        if($scope.showz==false)
        {
           fileUpload.uploadFileToUrl($scope.base64,name,uploadUrl2).then(function(dataSheet) {
          $scope.sheet=dataSheet.rows;
          $scope.nbrcolumns=dataSheet.rows[0].length;
          $scope.show=true;
          $scope.stopSpin();
          
        });


        }
        else {
        fileUpload.uploadFileToUrl(file,name,uploadUrl).then(function(dataSheet) {
          $scope.sheet=dataSheet.rows;
          $scope.nbrcolumns=dataSheet.rows[0].length;
          $scope.show=true;
          $scope.stopSpin();
          
        });}
        $scope.sheet=[];
        //alert("hedhahow"+$rootScope.jsonSheet);
        $scope.showpreview=true;
        $scope.headers=[];
        
      }
      $scope.getSheet = function(){

        
        var file = $scope.myFile;
        searchService.checkexist(file.name,file.lastModifiedDate).then(function (res) {
          if (res.hits.total >0)
            {console.log('exist');
          SweetAlert.swal("Error", "File already exists :)", "error");
          return;
        }
        $scope.startSpin();
        var uploadUrl = "http://localhost:7000/convert/getSheets/";
        getSheets.uploadFileToUrl(file, uploadUrl).then(function(dataSheet) {
          $scope.options=dataSheet;
          $scope.show=true;
          $scope.stopSpin();
          
        })})};

        
        

        
        $scope.startSpin = function(){
          usSpinnerService.spin('spinner-1');
        }
        $scope.stopSpin = function(){
          usSpinnerService.stop('spinner-1');
        }
        $scope.onSelection= function(row, col, row2, col2){

    /*var meta = this.getCellMeta(row2, col2);
    console.log(meta);
      this.setCellMeta(row2, col2,'renderer',"text");
      this.render();
      */


      console.log($scope.questions);

      if (col==col2 && (row2-row)>3)
      {
        if($scope.selectresponse==true)
        //deselect response column
      {
        if (col==$scope.columnresponse)
        { 
          $scope.responses=[];
          while(row <= row2)
          {
            this.setCellMeta(row,col,'renderer',"text");
            this.render();
            row=row+1;
            $scope.selectresponse=false;
          }
        }
      }
      //select question column
      if($scope.selectquestion==false)
        {var parent=this;
          var dlg = dialogs.confirm('Please Confirm','Select this column as Question s column?');
          dlg.result.then(function(btn){
           
            
            $scope.startSpin();
            setTimeout(function(){ $scope.stopSpin(); }, 1000);
            for (var i =0; i < $scope.nbrcolumns; i++) {
              $scope.headers[i]='-';
            }
            $scope.headers[col]='Questions';   
            parent.updateSettings({
              colHeaders: $scope.headers
            });
            $scope.columnquestion=col;
            $scope.selectquestion=true;
            console.log('selectquestion');
            while(row<=row2)
            {
              parent.setCellMeta(row,col,'renderer',"questionRenderer");
              parent.render();
              $scope.questions.push(parent.getDataAtCell(row,col));

              row=row+1;
              
            }
          },function(btn){

          });

        }
        else 
        //deselect question column
      {
        if (col==$scope.columnquestion)
        {
          $scope.questions=[];
          while(row <= row2)
          {
            this.setCellMeta(row,col,'renderer',"text");
            this.render();
            row=row+1;
            $scope.selectquestion=false;
          }
        }
        //select resqponse column
        if($scope.selectresponse==false)
          {var parent = this;
            var dlg = dialogs.confirm('Please Confirm','Select this column as Response s column?');
            dlg.result.then(function(btn){
             
              $scope.startSpin();
              setTimeout(function(){ $scope.stopSpin(); }, 1000);
              $scope.headers[col]='Responses';   
              parent.updateSettings({
                colHeaders: $scope.headers
              });
              $scope.columnresponse=col;
              while(row<=row2)
                {parent.setCellMeta(row,col,'renderer',"responseRenderer");
              parent.setCellMeta(row,$scope.columnquestion,'renderer',"questionRenderer");
              parent.render();

              $scope.responses.push(parent.getDataAtCell(row,col));
              row=row+1;
              $scope.selectresponse=true;
            }
          },function(btn){

          });


          }
          
        }
      }
      console.log($scope.questions);
      console.log($scope.responses);
    }
    $scope.cells = function  (row, col, prop) {
      if (row === 0 && col === 0) {
   // this.renderer='questionRenderer';
 }
}

//$scope.sheet=[["Date","Tache","Duree estimee","Commentaires"],["Mon Feb 09 00:00:00 GMT+01:00 2015","MongoDB ,openclassTuto","1h","TutoOpenclass:create,remove,use,find"],["","Installer ElasticSearch et faire demo","2h","Tutozenk:clusternode,Headplugin, mapping du livre cookbook"],["","Faire demo primeFaces mobile et web","2h,5","Rien"],["","Documentation ElasticSearch indexation","1h","Livre Cookbook"],["Tue Feb 10 00:00:00 GMT+01:00 2015","Faire demo primeFaces mobile et web","2h,5","Exemple de la saisie autocomplete"],["","Installer ElasticSearch et faire demo","45min"],["","Integerer Mongo et Elastic :exemple","2h","Rien"],["","Réunion encadrandte","35 min","Travail à faire : use case et modèle de données"],["Wed Feb 11 00:00:00 GMT+01:00 2015","Integerer Mongo et Elastic :exemple","3h","http://satishgandham.com/2012/09/a-complete-guide-to-integrating-mongodb-with-elastic-search/"],["","Chercher outil pour modeliser architecture et ecrire les cas d'utilisation","2h"],["","Initiation à Spring Data avec les technologies existantes","2h"],[""]];
$scope.tags = [
{ text: 'java' },
{ text: 'elasticsearch' },
{ text: 'Rest' },
{ text: 'angular' }
];
$scope.file="";
$scope.questions=[];
$scope.responses=[];
$scope.selectquestion=false;
$scope.selectresponse=false;
$scope.columnquestion=0;
$scope.columnresponse=0;
$scope.show=false;

  //$scope.items= 
  //[["Date","Tache","Duree estimee","Commentaires"],["Mon Feb 09 00:00:00 GMT+01:00 2015","MongoDB ,openclassTuto","1h","TutoOpenclass:create,remove,use,find"],["","Installer ElasticSearch et faire demo","2h","Tutozenk:clusternode,Headplugin, mapping du livre cookbook"],["","Faire demo primeFaces mobile et web","2h,5","Rien"],["","Documentation ElasticSearch indexation","1h","Livre Cookbook"],["Tue Feb 10 00:00:00 GMT+01:00 2015","Faire demo primeFaces mobile et web","2h,5","Exemple de la saisie autocomplete"],["","Installer ElasticSearch et faire demo","45min"],["","Integerer Mongo et Elastic :exemple","2h","Rien"],["","Réunion encadrandte","35 min","Travail à faire : use case et modèle de données"],["Wed Feb 11 00:00:00 GMT+01:00 2015","Integerer Mongo et Elastic :exemple","3h","http://satishgandham.com/2012/09/a-complete-guide-to-integrating-mongodb-with-elastic-search/"],["","Chercher outil pour modeliser architecture et ecrire les cas d'utilisation","2h"],["","Initiation à Spring Data avec les technologies existantes","2h"],[""]];
  //more items go here
//console.log($scope.items);
$scope.setParams=function()
{ $scope.document={};
  $scope.document.couple=[];
  if($scope.showz==false)
  {
  for (var i =0; i < $scope.questions.length; i++) {
    var paire={};
    paire.question=$scope.questions[i];
    paire.response=$scope.responses[i];
    $scope.document.couple.push(paire);}
    console.log($scope.document.couple);
      var index = $scope.options.indexOf($scope.myselect);
  $scope.options.splice(index, 1);
searchService.update($scope.Data.Id,$scope.document.couple,$scope.options).then(function (res) {
  $scope.isSuccess = true;
  if ($scope.options.length==0)
  {
SweetAlert.swal("Good job", "RFP idexed successfully !", "success");
$window.location='/#/import';
Data.Id='';
}
else
{SweetAlert.swal("Good job", "Please complete indexing other sheets", "success");
  $window.location='/#/importrfp';
}

});
}
  else
  {
  
  $scope.document.file=$scope.filebase.base64;
  $scope.document.filename=$scope.myFile.name;
  $scope.document.filedate=$scope.myFile.lastModifiedDate;
  $scope.document.tags=[];
  $scope.document.author=$scope.author;
  //$scope.document.questions=$scope.questions;
  //$scope.document.responses=$scope.responses;
  for (var i =0; i < $scope.tags.length; i++) {
   $scope.document.tags.push($scope.tags[i].text);}
   
   for (var i =0; i < $scope.questions.length; i++) {
    var paire={};
    paire.question=$scope.questions[i];
    paire.response=$scope.responses[i];
    $scope.document.couple.push(paire);}
    console.log(JSON.stringify($scope.document));
    var index = $scope.options.indexOf($scope.myselect);
  $scope.options.splice(index, 1);
  $scope.document.sheets=$scope.options;
    if($scope.options.length==0)
    {
$scope.document.complete=true;
    }
    else
      {$scope.document.complete=false;}
    searchService.index($scope.document).then(function (res) {
      $scope.isSuccess = true;
  if ($scope.options.length==0)
  {
SweetAlert.swal("Good job", "RFP idexed successfully !", "success");
//
Data.Id='';
$window.location='/#/import';
}
else
{  Data.Id=res._id;
  console.log(Data.Id);
  //$window.location.reload();
  SweetAlert.swal("Good job", "Please complete indexing other sheets", "success");
  //
 
}

});

  }}
}]);
