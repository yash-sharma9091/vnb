'use strict';
mimicTrading.controller('testimonialViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','testimonial',
	($scope, $state, RestSvr, $rootScope, appSvr, testimonial) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.testimonial = testimonial.record;
		$scope.goToEdit = () => $state.go('editTestimonial',{id: $scope.testimonial._id});
	}
]);
