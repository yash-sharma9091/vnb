'use strict';
mimicTrading.controller('testimonialEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','testimonial','testimonialSvr','Upload',
	($scope, $state, RestSvr, $rootScope, appSvr, testimonial, testimonialSvr, Upload) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.testimonial = testimonial.record;
		
		$scope.edit_testimonial = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl('testimonial/add'),
				data: $scope.testimonial,
			})
			.then(response => {
				$state.go('testimonials');
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
