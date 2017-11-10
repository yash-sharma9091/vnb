'use strict';
mimicTrading.controller('privacypolicyViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','privacypolicy',
	($scope, $state, RestSvr, $rootScope, appSvr, privacypolicy) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
		$scope.privacypolicy = privacypolicy.record;
		$scope.goToEdit = () => $state.go('editprivacypolicy',{id: $state.params.id});
	}
]);