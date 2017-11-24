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
	    $scope.homepage.video_url=`https://www.youtube.com/watch?v=${$scope.homepage.video_url}`;
		
	   	$scope.update_homepage = (isValid,data) => {
			if( !isValid ){
				App.scrollTop();
				return;
			}
			$scope.isLoading = true;
			let urlId=YouTubeGetID(data.video_url);
			data.video_url=urlId;
			Upload.upload({
				url: baseUrl('homepage/edit'),
				data: data
			})
			.then(function (response) {
				$state.go('viewhomepage');
			})
			.catch(function (errors) {
				App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
			})
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
