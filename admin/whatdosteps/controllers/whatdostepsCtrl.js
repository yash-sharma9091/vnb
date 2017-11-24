'use strict';
mimicTrading.controller('whatdostepsCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr',
	($scope, $state, RestSvr, $rootScope, appSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();			

		    TableAjax.init({
		    	url: 'whatdosteps/list/',
		    	columns: [
	               // { "data": "id", "orderable": false },
                    { "data": "title" },
                    { "data": "short_description" },
                    { "data": "long_description" },
                    { "data": "order" },
                   // { "data": "status" },
                    { "data": "created_date" },
                    { "data": "action", "orderable": false }
	            ]
		    });
		});
	}
]);
