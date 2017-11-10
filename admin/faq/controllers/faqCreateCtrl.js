'use strict';
mimicTrading.controller('faqCreateCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr',
	($scope, $state, RestSvr, $rootScope, appSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		

		$scope.new_faq = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.post('faq/add', $scope.faq)
			.then(response => {
				$state.go('faq');
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
