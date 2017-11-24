'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let homepageResolver = ['homepageSvr', '$stateParams', (homepageSvr, $stateParams) => homepageSvr.getHomepageData()];

	$stateProvider
	.state('homepage',{
		url: '/edit-homepage',
		controller: 'homepageEditCtrl',
		templateUrl: 'homepage/views/edit_homepage.html',
		data: {pageTitle: 'Update Homepage Sections'},
		authenticate: true,
		resolve: {
		    homepage: homepageResolver
		}
	})

	.state('viewhomepage',{
		url: '/view-homepage',
		controller: 'homepageViewCtrl',
		templateUrl: 'homepage/views/view_homepage.html',
		data: {pageTitle: 'Manage Homepage Sections'},
		authenticate: true,
		resolve: {
		    homepage: homepageResolver
		}
	});

}]);
