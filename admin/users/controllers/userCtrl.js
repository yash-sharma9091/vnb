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
		                { "data": "sr_no" },
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

		/**
		 * Check if form is valid and send the data to server
		 * @param  {isValid} isValid [form.valid]
		 * @return {redirect to user listing on successful insertion}
		 */
		$scope.new_user = function (isValid,data) {
			if( !isValid ){
				App.scrollTop();
				return;
			}
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl('user/add'),
				data: data,
				method: 'post'
			})
			.then(function (response) {
				$state.go('users');
			})
			.catch(function (error) {
				if( error.data ) {
					angular.forEach(error.data, function (value, prop) {
						$scope.newUserForm[prop].$setValidity('unique', false);
					});
					App.scrollTop();
				}
			})
			.finally(function () {
				$scope.isLoading = false;
			});
		};

		/**
		 * this will clear the
		 * @param  input name attr
		 */
		$scope.clear = function (name, form) {
			form[name].$setValidity('unique', true);
		};
	}
]);
