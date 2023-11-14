import { loginSchema, registerSchema } from './auth.dto';
import { approveSubscriptionSchema } from './subscription.dto';
import { getEpisodeByIdSchema, createEpisodeSchema, updateEpisodeSchema, episodeLikeSchema, createEpisodeCommentSchema, getEpisodesByCreatorIdSchema } from './episode.dto';
import { getCreatorWithStatusSchema, getCreatorsBySubscriberIdSchema } from './user.dto';

export {
  loginSchema,
  registerSchema,

  getEpisodeByIdSchema,
  createEpisodeSchema,
  updateEpisodeSchema,
  episodeLikeSchema,
  createEpisodeCommentSchema,
  getEpisodesByCreatorIdSchema,
  
  approveSubscriptionSchema,

  getCreatorWithStatusSchema, 
  getCreatorsBySubscriberIdSchema
};
