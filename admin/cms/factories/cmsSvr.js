'use strict';

mimicTrading.factory('cmsSvr', ['RestSvr', (RestSvr) => {
    return {
        getCMSById: (slug) => RestSvr.get(`cms/view/${slug}`),
        getCMSTypes: () => ['about_us','privacy_policy','terms_conditions']
    };
}]);