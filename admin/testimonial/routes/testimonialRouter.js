'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let testimonialResolver = ['testimonialSvr', '$stateParams', (testimonialSvr, $stateParams) => testimonialSvr.getTestimonialById($stateParams.id)];

	$stateProvider
	.state('testimonials',{
		url: '/testimonials',
		controller: 'testimonialCtrl',
		templateUrl: 'testimonial/views/testimonial.html',
		data: {pageTitle: 'Manage Testimonial'},
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
	.state('newTestimonial',{
		url: '/new-testimonial',
		controller: 'testimonialCreateCtrl',
		templateUrl: 'testimonial/views/new_testimonial.html',
		data: {pageTitle: 'New Testimonial'},
		authenticate: true
	})
	.state('editTestimonial',{
		url: '/edit-testimonial/:id',
		controller: 'testimonialEditCtrl',
		templateUrl: 'testimonial/views/edit_testimonial.html',
		data: {pageTitle: 'Update Testimonial Detail'},
		authenticate: true,
		resolve: {
		    testimonial: testimonialResolver
		}
	})
	.state('viewTestimonial',{
		url: '/view-testimonial/:id',
		controller: 'testimonialViewCtrl',
		templateUrl: 'testimonial/views/view_testimonial.html',
		data: {pageTitle: 'View Testimonial Detail'},
		authenticate: true,
		resolve: {
		    testimonial: testimonialResolver
		}
	});
}]);
