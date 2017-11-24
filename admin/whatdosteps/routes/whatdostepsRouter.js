'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let whatdostepsResolver = ['whatdostepsSvr', '$stateParams', (whatdostepsSvr, $stateParams) => whatdostepsSvr.getCMSById($stateParams.slug)];


	$stateProvider
	.state('whatdosteps',{
		url: '/whatdosteps',
		controller: 'whatdostepsCtrl',
		templateUrl: 'whatdosteps/views/whatdosteps.html',
		data: {pageTitle: 'Manage What DO Steps'},
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
	.state('newwhatdosteps',{
		url: '/new-whatdosteps',
		controller: 'whatdostepsCreateCtrl',
		templateUrl: 'whatdosteps/views/new_whatdosteps.html',
		data: {pageTitle: 'New CMS'},
		authenticate: true
	})
	.state('editwhatdosteps',{
		url: '/edit-whatdosteps/:slug',
		controller: 'whatdostepsEditCtrl',
		templateUrl: 'whatdosteps/views/edit_whatdosteps.html',
		data: {pageTitle: 'Update What Do Steps Detail'},
		authenticate: true,
		resolve: {
		    whatdosteps: whatdostepsResolver
		}
	})
	.state('viewwhatdosteps',{
		url: '/view-whatdosteps/:slug',
		controller: 'whatdostepsViewCtrl',
		templateUrl: 'whatdosteps/views/view_whatdosteps.html',
		data: {pageTitle: 'View What Do Steps Detail'},
		authenticate: true,
		resolve: {
		    whatdosteps: whatdostepsResolver
		}
	});
}]);
