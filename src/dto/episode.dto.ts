import { z } from 'zod';
import { zfd } from 'zod-form-data';

const getEpisodeByIdSchema = z.object({
  params: z.object({
    episode_id: z
      .string({
        required_error: 'Params Episode Id is required',
      })
      .min(1, {
        message: 'Params Episode Id is required',
      }),
  }),
});

const getEpisodesByCreatorIdSchema = z.object({
  params: z.object({
    creator_id: z.string({
      required_error: "Params Creator Id is required"
    }).min(1, {
      message: "Params Creator Id is required"
    }),
  }),

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

const createEpisodeSchema = z.object({
  body: zfd.formData({
    title: zfd.text(
      z
        .string({
          required_error: 'Title is required',
        })
        .min(1, {
          message: 'Title is required',
        }),
    ),

    description: zfd.text(
      z
        .string({
          required_error: 'Description is required',
        })
        .min(1, {
          message: 'Description is required',
        }),
    ),

    category_id: z
      .string({
        required_error: 'Category Id is required',
      })
      .min(1, {
        message: 'Category Id is required',
      }),
  }),
});

const updateEpisodeSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .min(1, {
        message: 'Title is required',
      }),

    description: z
      .string({
        required_error: 'Description is required',
      })
      .min(1, {
        message: 'Description is required',
      }),

    category_id: z
      .string({
        required_error: 'Category Id is required',
      })
      .min(1, {
        message: 'Category Id is required',
      }),
  }),
});

const episodeLikeSchema = z.object({
  body: z.object({
    episode_id: z.number({
      required_error: 'Episode Id is required',
    })
    .min(1, {
        message: 'Episode Id is required',
      }),
  }),
});

export {
  getEpisodeByIdSchema,
  getEpisodesByCreatorIdSchema,
  createEpisodeSchema,
  updateEpisodeSchema,

  episodeLikeSchema,
}