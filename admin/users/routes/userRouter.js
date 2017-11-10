'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){
	/**
	 * Common Resolver for two states, 
	 * it will fetch all the trader by id ,
	 * this will populate during edit and view trader,
	 * JUST Following D.R.Y (don't repeat yourself)
	 * @type {Object}
	 */
	let userResolver = {
		user: ['userSvr', '$stateParams', (userSvr, $stateParams) => userSvr.getUserById($stateParams.id)]
	};
	$stateProvider
	.state('users',{
		url: '/users',
		controller: 'userCtrl',
		templateUrl: '/users/views/userListing.html',
		data: {pageTitle: 'Customer Management'},
		resolve: {
		    deps: ['$ocLazyLoad', function($ocLazyLoad) {
		        return $ocLazyLoad.load({
		            name: 'mimicTrading',
		            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
		            files: [
		                
		                '/assets/global/plugins/datatables/datatables.min.css', 
                        '/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        '/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                        '/assets/global/plugins/datatables/datatables.all.min.js',
                        '/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '/assets/global/scripts/datatable.min.js',
		            ] 
		        });
		    }]
		},
		authenticate: true
	})
	.state('newUser',{
		url: '/new-user',
		controller: 'userCtrl',
		templateUrl: '/users/views/new_user.html',
		data: {pageTitle: 'Add New Customer'},
		authenticate: true
	})
	.state('viewUser',{
		url: '/view-user/:id',
		controller: 'userViewCtrl',
		templateUrl: '/users/views/view_user.html',
		data: {pageTitle: 'Customer Detail'},
		authenticate: true,
		resolve: userResolver
	})
	.state('editUser',{
		url: '/edit-user/:id',
		controller: 'userEditCtrl',
		templateUrl: '/users/views/edit_user.html',
		data: {pageTitle: 'Update Customer Detail'},
		authenticate: true,
		resolve: userResolver
	});
}]);