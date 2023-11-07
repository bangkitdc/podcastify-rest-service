import { loginSchema, registerSchema } from './auth.dto';
import {
  approveSubscriptionSchema,
  getAllSubscriptionBySubscriberIdSchema,
} from './subscription.dto';
import { getEpisodeByIdSchema, createEpisodeSchema, updateEpisodeSchema } from './episode.dto';

export {
  loginSchema,
  registerSchema,

  getEpisodeByIdSchema,
  createEpisodeSchema,
  updateEpisodeSchema,
  
  approveSubscriptionSchema,
  getAllSubscriptionBySubscriberIdSchema,
};
