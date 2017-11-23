'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let myaccountResolver = ['myaccountSvr', '$stateParams', (myaccountSvr, $stateParams) => cmsSvr.getCMSById($stateParams.slug)];

	$stateProvider
	.state('myaccount',{
		url: '/myaccount',
		controller: 'myaccountCtrl',
		templateUrl: 'myaccount/views/myaccount.html',
		data: {pageTitle: 'My Account'},
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

}]);
