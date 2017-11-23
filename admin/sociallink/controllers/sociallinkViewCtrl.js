'use strict';
mimicTrading.controller('sociallinkViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','sociallink',
	($scope, $state, RestSvr, $rootScope, appSvr, sociallink) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.sociallink = sociallink.record;
		$scope.goToEdit = () => $state.go('editsociallink',{_id: $state.params._id});
	}
]);
