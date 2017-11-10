'use strict';
mimicTrading.controller('faqEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','faq',
	($scope, $state, RestSvr, $rootScope, appSvr, faq ) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
		$scope.faq = faq.record;
		
		$scope.edit_faq = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.put('faq/edit', $scope.faq)
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
