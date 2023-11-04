import { loginSchema, registerSchema } from './auth.dto';
import {
  approveSubscriptionSchema,
  getAllSubscriptionByCreatorIdSchema,
} from './subscription.dto';
import { getEpisodeByIdSchema, createEpisodeSchema, updateEpisodeSchema } from './episode.dto';

export {
  loginSchema,
  registerSchema,

  getEpisodeByIdSchema,
  createEpisodeSchema,
  updateEpisodeSchema,
  
  approveSubscriptionSchema,
  getAllSubscriptionByCreatorIdSchema,
};
