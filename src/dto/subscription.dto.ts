import { z } from 'zod';

const approveSubscriptionSchema = z.object({
  body: z.object({
    creator_id: z.number({
      required_error: 'Creator ID is required',
    }),
    subscriber_id: z.number({
      required_error: 'Subscriber ID is required',
    }),
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
