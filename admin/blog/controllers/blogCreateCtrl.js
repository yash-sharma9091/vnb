'use strict';
mimicTrading.controller('blogCreateCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','blogSvr','Upload',
	($scope, $state, RestSvr, $rootScope, appSvr, blogSvr, Upload) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
		$scope.blog_type = blogSvr.getBlogTypes();

		$scope.new_blog = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl('blog/add'),
				data: $scope.blog
			})
			.then(response => {
				$state.go('blogs');
			})
			.catch(errors => {
				App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
			})
			.finally( () => {
				$scope.isLoading = false;
			});
		};
	}
]);
