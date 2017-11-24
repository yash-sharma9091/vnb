'use strict';

mimicTrading.factory('whatdostepsSvr', ['RestSvr', (RestSvr) => {
    return {
        getCMSById: (slug) => RestSvr.get(`whatdosteps/view/${slug}`),
        getCMSTypes: () => ['about_us','privacy_policy','terms_conditions']
    };
}]);