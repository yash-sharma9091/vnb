'use strict';
const path    = require('path'),
    config    = require(require(path.resolve('./config/env')).getEnv),
    _       = require('lodash');
    
/* This function will return all the paging options
* return @object
* paging = {
    'page' : page,
    'current' : count(results), // currently showing results count
    'count' : count,
    'prevPage' : (page > 1),
    'nextPage' : (count > ($page * $limit)),
    'pageCount' : pageCount,
    'limit' : limit
}
*/
function _paging(count, result, page){
    let countResult = (result) ? result.length : 0,
        pageCount = countResult !== 0 ? parseInt(_.ceil(count / config.docLimit)) : 0;
    return {
        page: page,
        current: countResult,
        count: count,
        prevPage: (page > 1),
        nextPage: (count > (page * config.docLimit)),
        pages: pageCount,
        limit: config.docLimit
    };
}

module.exports._paging = _paging;