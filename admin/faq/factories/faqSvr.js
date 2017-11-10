'use strict';

mimicTrading.factory('faqSvr', ['RestSvr', (RestSvr) => {
    return {
        getFaqById: (id) => RestSvr.get(`faq/view/${id}`)
    };
}]);