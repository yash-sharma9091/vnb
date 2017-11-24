'use strict';

mimicTrading.factory('homepageSvr', ['RestSvr', (RestSvr) => {
    return {
        getHomepageData: () => RestSvr.get(`homepage/view`)
    };
}]);