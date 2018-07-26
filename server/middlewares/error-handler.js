'use strict';

import Response from '../helpers/response';

module.exports = (error, req, res, next) => Response.error(res, error);