'use strict';
mimicTrading.controller('whatdostepsCreateCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','whatdostepsSvr',
	($scope, $state, RestSvr, $rootScope, appSvr, whatdostepsSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
		$scope.whatdosteps_type = whatdostepsSvr.getCMSTypes();

		$scope.new_whatdosteps = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.post('whatdosteps/add', $scope.whatdosteps)
			.then(response => {
				$state.go('whatdosteps');
			})
			.catch(errors => {
				console.log(JSON.stringify(errors));
				App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
				$scope.isLoading = false;
			})
			.then(() => {
				$scope.isLoading = false;
			});
		};
	}
]);
