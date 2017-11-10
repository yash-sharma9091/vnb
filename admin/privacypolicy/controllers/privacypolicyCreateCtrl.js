'use strict';
mimicTrading.controller('privacypolicyCreateCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','privacypolicySvr',
	($scope, $state, RestSvr, $rootScope, appSvr, privacypolicySvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		

		$scope.new_privacypolicy = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.post('privacypolicy/add', $scope.privacypolicy)
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
