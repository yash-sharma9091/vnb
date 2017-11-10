'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let privacypolicyResolver = ['privacypolicySvr', '$stateParams', (privacypolicySvr, $stateParams) => privacypolicySvr.getPrivacyPolicyById($stateParams.id)];

	$stateProvider
	.state('privacypolicy',{
		url: '/privacypolicy',
		controller: 'privacypolicyCtrl',
		templateUrl: 'privacypolicy/views/privacypolicy.html',
		data: {pageTitle: 'Manage Privacy & Policy'},
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
                        '/assets/global/scripts/datatable.min.js'
		            ] 
		        });
		    }]
		},
		authenticate: true
	})
	.state('newprivacypolicy',{
		url: '/new-privacypolicy',
		controller: 'privacypolicyCreateCtrl',
		templateUrl: 'privacypolicy/views/new_privacypolicy.html',
		data: {pageTitle: 'New Privacy & Policy'},
		authenticate: true
	})
	.state('editprivacypolicy',{
		url: '/edit-privacypolicy/:id',
		controller: 'privacypolicyEditCtrl',
		templateUrl: 'privacypolicy/views/edit_privacypolicy.html',
		data: {pageTitle: 'Update Privacy & Policy Detail'},
		authenticate: true,
		resolve: {
		    privacypolicy: privacypolicyResolver
		}
	})
	.state('viewprivacypolicy',{
		url: '/view-privacypolicy/:id',
		controller: 'privacypolicyViewCtrl',
		templateUrl: 'privacypolicy/views/view_privacypolicy.html',
		data: {pageTitle: 'View Privacy & Policy Detail'},
		authenticate: true,
		resolve: {
		    privacypolicy: privacypolicyResolver
		}
	});
}]);
