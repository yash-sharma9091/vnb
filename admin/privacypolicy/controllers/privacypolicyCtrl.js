'use strict';
mimicTrading.controller('privacypolicyCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr',
	($scope, $state, RestSvr, $rootScope, appSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();			

		    TableAjax.init({
		    	url: 'privacypolicy/list/',
		    	columns: [
	                { "data": "id", "orderable": false },
                    { "data": "title" },
                    { "data": "description"},
                    { "data": "status" },
                    { "data": "created_date" },
                    { "data": "action", "orderable": false }
	            ]
		    });
		});
	}
]);