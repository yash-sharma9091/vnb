'use strict';

mimicTrading.factory('privacypolicySvr', ['RestSvr', (RestSvr) => {
    return {
        getPrivacyPolicyById: (id) => RestSvr.get(`privacypolicy/view/${id}`),
        getTermsConditionsTypes: () => ['about_us','privacy_policy','terms_conditions']
    };
}]);