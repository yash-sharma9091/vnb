'use strict';
mimicTrading.controller('userCtrl', ['$scope', '$state', '$rootScope', 'Upload','appSvr',
	function($scope, $state, $rootScope, Upload, appSvr){
		
		$scope.$on('$viewContentLoaded', function() {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();


		    /**
		     * only Intialize datatable if current state is users
		     * @param  {String} $state.current.name [current state name]
		     */
		    if($state.current.name === 'users'){
			    // Intialize datatable
			    TableAjax.init({
			    	url: 'user/list',
			    	columns: [
		                { "data": "id", "orderable": false },
		                { "data": "sr_no" ,"orderable": false},
		                { "data": "contact_name" },
		                { "data": "contact_telephoneno" },
                      	{ "data": "email_address" },
		                { "data": "school_name" },  
		                { "data": "school_address" },
		                //{ "data": "no_of_students" },
		                { "data": "pilot_request" },
		                { "data": "action", "orderable": false }
		            ]
			    });
			}    
		});

	}
]);
