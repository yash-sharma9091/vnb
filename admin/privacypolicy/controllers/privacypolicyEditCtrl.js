'use strict';
mimicTrading.controller('privacypolicyEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','privacypolicy',
	($scope, $state, RestSvr, $rootScope, appSvr, privacypolicy) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.privacypolicy = privacypolicy.record;
		
		$scope.edit_privacypolicy = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.put('privacypolicy/edit', $scope.privacypolicy)
			.then(response => {
				$state.go('privacypolicy');
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
