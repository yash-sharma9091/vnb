'use strict';
mimicTrading.controller('homepageEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','Upload','homepage',
	($scope, $state, RestSvr, $rootScope, appSvr, Upload, homepage) => {
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});

		$scope.homepage = homepage.record;
		$scope.homepage.banner_img=$scope.homepage.banner_img.path;
		
	   	$scope.update_homepage = (isValid,data) => {
			if( !isValid ){
				App.scrollTop();
				return;
			}
			$scope.isLoading = true;
		    let req = '';
			let urlId=angular.copy(data.video_url, req);
			data.video_url_id=YouTubeGetID(urlId);
			Upload.upload({
				url: baseUrl('homepage/edit'),
				data: data
			})
			.then(function (response) {
				return Upload.resize(data.banner_img, {width:60,height:60})
				.then(function(resizedFile){
					return resizedFile;
				});
				
			}).then(function(response){
				if(Upload.isFile(data.banner_img)){
					Upload.upload({
						url: baseUrl('homepage/bannerthumb'),
						data: {_id:data._id,resize_image: response}
					}).then(function(result){
						$state.go('viewhomepage');
					}).catch(function(errors){
						console.log("err1--"+errors);
					    App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
					})
				}
			})
		/*	.catch(function (errors) {
				console.log("err2--"+errors);
				App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
			})*/
			.finally(function () {
				$scope.isLoading = false;
			});
		};


		function YouTubeGetID(url){
		  var ID = '';
		  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		  if(url[2] !== undefined) {
		    ID = url[2].split(/[^0-9a-z_\-]/i);
		    ID = ID[0];
		  }
		  else {
		    ID = url;
		  }
		    return ID;
		}
	}
]);
