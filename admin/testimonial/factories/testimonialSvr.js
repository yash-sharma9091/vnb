'use strict';

mimicTrading.factory('testimonialSvr', ['RestSvr', (RestSvr) => {
    return {
        getTestimonialById: (id) => RestSvr.get(`testimonial/view/${id}`)
    };
}]);