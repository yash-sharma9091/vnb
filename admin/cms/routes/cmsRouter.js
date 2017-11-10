'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let cmsResolver = ['cmsSvr', '$stateParams', (cmsSvr, $stateParams) => cmsSvr.getCMSById($stateParams.slug)];

	$stateProvider
	.state('cms',{
		url: '/cms',
		controller: 'cmsCtrl',
		templateUrl: 'cms/views/cms.html',
		data: {pageTitle: 'Manage CMS'},
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
	.state('newcms',{
		url: '/new-cms',
		controller: 'cmsCreateCtrl',
		templateUrl: 'cms/views/new_cms.html',
		data: {pageTitle: 'New CMS'},
		authenticate: true
	})
	.state('editcms',{
		url: '/edit-cms/:slug',
		controller: 'cmsEditCtrl',
		templateUrl: 'cms/views/edit_cms.html',
		data: {pageTitle: 'Update CMS Detail'},
		authenticate: true,
		resolve: {
		    cms: cmsResolver
		}
	})
	.state('viewcms',{
		url: '/view-cms/:slug',
		controller: 'cmsViewCtrl',
		templateUrl: 'cms/views/view_cms.html',
		data: {pageTitle: 'View CMS Detail'},
		authenticate: true,
		resolve: {
		    cms: cmsResolver
		}
	});
}]);
