'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let faqResolver = ['faqSvr', '$stateParams', (faqSvr, $stateParams) => faqSvr.getFaqById($stateParams.id)];

	$stateProvider
	.state('faq',{
		url: '/faq',
		controller: 'faqCtrl',
		templateUrl: 'faq/views/faq.html',
		data: {pageTitle: 'Manage FAQ'},
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
	.state('newFaq',{
		url: '/new-faq',
		controller: 'faqCreateCtrl',
		templateUrl: 'faq/views/new_faq.html',
		data: {pageTitle: 'New FAQ'},
		authenticate: true
	})
	.state('editFaq',{
		url: '/edit-faq/:id',
		controller: 'faqEditCtrl',
		templateUrl: 'faq/views/edit_faq.html',
		data: {pageTitle: 'Update FAQ Detail'},
		authenticate: true,
		resolve: {
		    faq: faqResolver
		}
	})
	.state('viewFaq',{
		url: '/view-faq/:id',
		controller: 'faqViewCtrl',
		templateUrl: 'faq/views/view_faq.html',
		data: {pageTitle: 'View FAQ Detail'},
		authenticate: true,
		resolve: {
		    faq: faqResolver
		}
	});
}]);
