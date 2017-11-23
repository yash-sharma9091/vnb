'use strict';
mimicTrading.controller('sociallinkCreateCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','sociallinkSvr',
	($scope, $state, RestSvr, $rootScope, appSvr, sociallinkSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
		$scope.sociallink_type = sociallinkSvr.getCMSTypes();

		$scope.new_sociallink = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.post('sociallink/add', $scope.sociallink)
			.then(response => {
				$state.go('sociallink');
			})
			.catch(errors => {
				App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
			})
			.then(() => {
				$scope.isLoading = false;
			});
		};
	}
]);
