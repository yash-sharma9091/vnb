'use strict';
mimicTrading.controller('cmsCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr',
	($scope, $state, RestSvr, $rootScope, appSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();			

		    TableAjax.init({
		    	url: 'cms/list/',
		    	columns: [
	               // { "data": "id", "orderable": false },
                    { "data": "title" },
                    //{ "data": "description"},
                    { "data": "slug" },
                    { "data": "updated_date" },
                    { "data": "status" },
                    { "data": "action", "orderable": false }
	            ]
		    });
		});
	}
]);
