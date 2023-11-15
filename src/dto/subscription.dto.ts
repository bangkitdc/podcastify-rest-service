import { z } from 'zod';

const approveSubscriptionSchema = z.object({
  body: z.object({
    creator_id: z
      .string()
      .refine((value) => !isNaN(Number(value)), {
        message: 'Creator ID must be a number',
      })
      .transform(Number),
    creator_name: z
      .string({
        required_error: 'Creator Name is required',
      })
      .min(1, {
        message: 'Creator Name is required',
      }),
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

export { approveSubscriptionSchema };
