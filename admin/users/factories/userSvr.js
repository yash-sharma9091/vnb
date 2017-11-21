'use strict';

mimicTrading.factory('userSvr', ['RestSvr', (RestSvr) => {
    return {
        getUserById: (id) => RestSvr.get(`user/view/${id}`),
        approveReject:(data) => RestSvr.post('approverejectsingle',data)
    };
}]);