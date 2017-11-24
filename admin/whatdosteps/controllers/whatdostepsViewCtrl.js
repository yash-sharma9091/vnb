'use strict';
mimicTrading.controller('whatdostepsViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','whatdosteps',
	($scope, $state, RestSvr, $rootScope, appSvr, whatdosteps) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.whatdosteps = whatdosteps.record;
		$scope.goToEdit = () => $state.go('editwhatdosteps',{slug: $state.params.slug});
	}
]);
