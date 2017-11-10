'use strict';
mimicTrading.controller('blogViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','blog',
	($scope, $state, RestSvr, $rootScope, appSvr, blog) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.blog = blog.record;
		$scope.goToEdit = () => $state.go('editBlog',{id: $scope.blog.slug});
	}
]);
