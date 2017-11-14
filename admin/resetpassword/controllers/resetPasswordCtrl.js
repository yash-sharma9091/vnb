'use strict';
mimicTrading.controller('resetPasswordCtrl', ['$scope','$state','$rootScope','$http',
	($scope,$state,$rootScope,$http) => {

	   $scope.resetpassword= (valid,formdata)=> {

           if(formdata.new_password == formdata.confirm_password){
                var pwdregex=/^[a-z0-9].{6,255}$/,inputJson={};
                    inputJson.password=formdata.new_password;
                if(pwdregex.test(formdata.new_password)){
                  $http.post('http://localhost:7000/adminapi/reset_password/'+$state.params.key,inputJson).then(function(response){
                       App.alert({type: ('success'), icon: ( 'success'), message: response.data.records.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
                       formdata={};
                       setTimeout(function(){
                        $state.go('login');
                       },1000);
                   
                  }).catch(function(response) {
                    console.log("Error"+response.status);
                  });
                
                }
                else
                {  
                   let msg=	"Password must be alpha-numeric and minimum 6 characters.";
                   App.alert({type: ('danger'), icon: ( 'danger'), message: msg, container: $rootScope.settings.errorContainer, place: 'prepend'});
                   return;
                }
            }
            else
             {
                let msg="New Password and confirm password must be same.";
                App.alert({type: ('danger'), icon: ( 'danger'), message: msg, container: $rootScope.settings.errorContainer, place: 'prepend'});
                return;
             }
	  };


	}
]);