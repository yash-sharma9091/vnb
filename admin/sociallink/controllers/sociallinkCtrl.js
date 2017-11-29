'use strict';
mimicTrading.controller('sociallinkCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr',
	($scope, $state, RestSvr, $rootScope, appSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();			

		    TableAjax.init({
		    	url: 'sociallink/list/',
		    	columns: [
	               // { "data": "id", "orderable": false },
                    { "data": "title" },
                    { "data": "url" },
                    { "data": "status" },
                    { "data": "updated_date" },
                    { "data": "action", "orderable": false }
	            ]
		    });
		});
	}
]);
