'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let blogResolver = ['blogSvr', '$stateParams', (blogSvr, $stateParams) => blogSvr.getBlogById($stateParams.id)];

	$stateProvider
	.state('blogs',{
		url: '/blogs',
		controller: 'blogCtrl',
		templateUrl: 'blog/views/blog.html',
		data: {pageTitle: 'Manage Blog'},
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
	.state('newBlog',{
		url: '/new-blog',
		controller: 'blogCreateCtrl',
		templateUrl: 'blog/views/new_blog.html',
		data: {pageTitle: 'New Blog'},
		authenticate: true
	})
	.state('editBlog',{
		url: '/edit-blog/:id',
		controller: 'blogEditCtrl',
		templateUrl: 'blog/views/edit_blog.html',
		data: {pageTitle: 'Update Blog Detail'},
		authenticate: true,
		resolve: {
		    blog: blogResolver
		}
	})
	.state('viewBlog',{
		url: '/view-blog/:id',
		controller: 'blogViewCtrl',
		templateUrl: 'blog/views/view_blog.html',
		data: {pageTitle: 'View Blog Detail'},
		authenticate: true,
		resolve: {
		    blog: blogResolver
		}
	});
}]);
