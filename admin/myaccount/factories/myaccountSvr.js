'use strict';

mimicTrading.factory('myaccountSvr', ['RestSvr', (RestSvr) => {
    return {
        getCMSById: (slug) => RestSvr.get(`cms/view/${slug}`),

    };
}]);