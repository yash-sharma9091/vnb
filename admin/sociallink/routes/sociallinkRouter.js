'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let sociallinkResolver = ['sociallinkSvr', '$stateParams', (sociallinkSvr, $stateParams) => sociallinkSvr.getCMSById($stateParams._id)];

	$stateProvider
	.state('sociallink',{
		url: '/sociallink',
		controller: 'sociallinkCtrl',
		templateUrl: 'sociallink/views/sociallink.html',
		data: {pageTitle: 'Manage Social Link'},
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
	.state('newsociallink',{
		url: '/new-sociallink',
		controller: 'sociallinkCreateCtrl',
		templateUrl: 'sociallink/views/new_sociallink.html',
		data: {pageTitle: 'New CMS'},
		authenticate: true
	})
	.state('editsociallink',{
		url: '/edit-sociallink/:_id',
		controller: 'sociallinkEditCtrl',
		templateUrl: 'sociallink/views/edit_sociallink.html',
		data: {pageTitle: 'Update Social Link Detail'},
		authenticate: true,
		resolve: {
		    sociallink: sociallinkResolver
		}
	})
	.state('viewsociallink',{
		url: '/view-sociallink/:_id',
		controller: 'sociallinkViewCtrl',
		templateUrl: 'sociallink/views/view_sociallink.html',
		data: {pageTitle: 'View Social Link Detail'},
		authenticate: true,
		resolve: {
		    sociallink: sociallinkResolver
		}
	});
}]);
