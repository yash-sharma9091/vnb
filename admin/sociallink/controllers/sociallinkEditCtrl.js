'use strict';
mimicTrading.controller('sociallinkEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','sociallink','sociallinkSvr',
	($scope, $state, RestSvr, $rootScope, appSvr, sociallink, sociallinkSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.sociallink = sociallink.record;
		
		$scope.edit_sociallink = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.put('sociallink/edit', $scope.sociallink)
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
