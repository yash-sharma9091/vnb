'use strict';
mimicTrading.controller('whatdostepsEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','whatdosteps','whatdostepsSvr',
	($scope, $state, RestSvr, $rootScope, appSvr, whatdosteps, whatdostepsSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.whatdosteps = whatdosteps.record;
		
		$scope.edit_whatdosteps = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.put('whatdosteps/edit', $scope.whatdosteps)
			.then(response => {
				$state.go('whatdosteps');
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
