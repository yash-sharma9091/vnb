'use strict';

mimicTrading.factory('blogSvr', ['RestSvr', (RestSvr) => {
    return {
        getBlogById: (id) => RestSvr.get(`blog/view/${id}`),
        getBlogTypes: () => [{value: 'about_us', title: 'About Page'},{value:'blog',title:'Blog page'}]
    };
}]);