'use strict';
mimicTrading.controller('blogEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','blog','blogSvr','Upload',
	($scope, $state, RestSvr, $rootScope, appSvr, blog, blogSvr, Upload) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.blog_type = blogSvr.getBlogTypes();
		$scope.blog = blog.record;
		
		$scope.edit_blog = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl('blog/add'),
				data: $scope.blog,
			})
			.then(response => {
				$state.go('blogs');
			})
			.catch(errors => {
				App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
			})
			.finally(() => {
				$scope.isLoading = false;
			});
		};
	}
]);
