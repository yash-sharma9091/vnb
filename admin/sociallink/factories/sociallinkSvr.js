'use strict';

mimicTrading.factory('sociallinkSvr', ['RestSvr', (RestSvr) => {
    return {
        getCMSById: (slug) => RestSvr.get(`sociallink/view/${slug}`),
        getCMSTypes: () => ['about_us','privacy_policy','terms_conditions']
    };
}]);