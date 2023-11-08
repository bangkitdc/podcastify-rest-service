import { z } from 'zod';

const approveSubscriptionSchema = z.object({
  body: z.object({
    creator_id: z
      .string()
      .refine((value) => !isNaN(Number(value)), {
        message: 'Creator ID must be a number',
      })
      .transform(Number),
    subscriber_id: z
      .string()
      .refine((value) => !isNaN(Number(value)), {
        message: 'Subscriber ID must be a number',
      })
      .transform(Number),
    status: z
      .enum(['ACCEPTED', 'REJECTED'])
      .refine((value) => value !== undefined, {
        message: 'Status must be one of ACCEPTED or REJECTED',
      }),
  }),
});

const getAllSubscriptionBySubscriberIdSchema = z.object({
  params: z.object({
    subscriber_id: z
      .string()
      .refine((value) => !isNaN(Number(value)), {
        message: 'Params Subscriber ID must be a number',
      })
      .transform(Number),
  }),
  query: z.object({
    status: z
      .enum(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'])
      .refine((value) => value !== undefined, {
        message: 'Status must be one of ALL, PENDING, ACCEPTED or REJECTED',
      }),
  }),
});

export { approveSubscriptionSchema, getAllSubscriptionBySubscriberIdSchema };
