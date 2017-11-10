'use strict';
mimicTrading.controller('faqViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','faq',
	($scope, $state, RestSvr, $rootScope, appSvr, faq) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.faq = faq.record;
		$scope.goToEdit = () => $state.go('editFaq',{id: $scope.faq._id});
	}
]);
