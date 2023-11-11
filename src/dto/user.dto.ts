import { z } from 'zod';

const getCreatorsBySubscriberIdSchema = z.object({
  // pagination
  query: z.object({
    page: z.string().refine((value) => {
      const parsedValue = Number(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    }, { message: "Invalid page number" }).optional(),

    limit: z.string().refine((value) => {
      const parsedValue = Number(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    }, { message: "Invalid limit number" }).optional(),
  })
});

const getCreatorWithStatusSchema = z.object({
  params: z.object({
    creator_id: z.string({
      required_error: "Params Creator Id is required"
    }).min(1, {
      message: "Params Creator Id is required"
    }),
  }),
})

export { getCreatorsBySubscriberIdSchema, getCreatorWithStatusSchema }