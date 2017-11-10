'use strict';
mimicTrading.controller('faqCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr',
	($scope, $state, RestSvr, $rootScope, appSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();			

		    TableAjax.init({
		    	url: 'faq/list/',
		    	columns: [
	                { "data": "id", "orderable": false },
                    { "data": "question" },
                    { "data": "order" },
                    { "data": "status" },
                    { "data": "created_date" },
                    { "data": "action", "orderable": false }
	            ]
		    });
		});
	}
]);
