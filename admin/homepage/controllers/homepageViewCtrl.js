'use strict';
mimicTrading.controller('homepageViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','homepage','$uibModal','homepageSvr',
	($scope, $state, RestSvr, $rootScope, appSvr, homepage, $uibModal, homepageSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		}); 
		
		$scope.homepage = homepage.record;
		$scope.goToEdit = () => $state.go('homepage');

	}
]);
