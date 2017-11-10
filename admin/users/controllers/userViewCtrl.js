'use strict';
mimicTrading.controller('userViewCtrl', ['$scope', '$state','user','appSvr',
	($scope, $state, user, appSvr) => {
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});

		/**
		 * Request would only sent if state params has id
		 * @param  {integer} $state.params.id [user id]
		 * @return {Object}                  [user data]
		 */
		 
        $scope.userinfo = user.record;

		/**
		 * it would take you to the edit page
		 * 
		 */
		$scope.goToEdit = () => {
			$state.go('editUser', {id: $state.params.id});
		};

		$scope.goBack = () => {
			$state.go('users');
			// var queryString = $location.search();
			// $state.go((queryString) ? ((queryString.back === 'strategies') ? 'strategies':'users'):'users');
		};
	}
]);
