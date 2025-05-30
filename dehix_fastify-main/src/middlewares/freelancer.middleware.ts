// import { BaseController } from '../common/base.controller';
// import { NotFoundError } from '../common/errors';
// import { ERROR_CODES, STATUS_CODES } from '../common/constants';
// import { logger } from '../common/services/logger.service';
// import { FreelancerDAO } from '../dao/freelancer.dao';

// export class FreelancerMiddleware extends BaseController {
//   static checkExistance = async (request) => {
//     const freelancerId = request.decodedToken?.userId;
//     logger.info('FreelancerMiddleware::checkExistance for id', freelancerId);

//     const freelancerDAO = new FreelancerDAO();

//     const freelancer = await freelancerDAO.findById(freelancerDAO.model, freelancerId);

//     if (!freelancer) {
//       logger.error(`freelancer not found with id: ${request.decodedToken?.userId}`);
//       throw new NotFoundError(ERROR_CODES.FREELANCER_NOT_FOUND, `${STATUS_CODES.NOT_FOUND}`);
//     }

//     request.metadata = { freelancer };
//   };
// }
