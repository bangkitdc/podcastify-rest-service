import { z } from 'zod';
import { zfd } from 'zod-form-data';

const getEpisodeByIdSchema = z.object({
  params: z.object({
    episode_id: z
      .string().refine((value) => {
        const parsedValue = Number(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      }, { message: "Invalid Params Episode Id" }),
  }),
});

const getEpisodesByCreatorIdSchema = z.object({
  params: z.object({
    creator_id: z
    .string().refine((value) => {
      const parsedValue = Number(value);
      return !isNaN(parsedValue) && parsedValue > 0;
    }, { message: "Invalid Params Creator Id" }),
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
      .string().refine((value) => {
        const parsedValue = Number(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      }, { message: "Invalid Category Id" }).optional(),

    duration: z
      .string().refine((value) => {
        const parsedValue = Number(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      }, { message: "Invalid Duration" }).optional(),
  }),
});

const updateEpisodeSchema = z.object({
  params: z.object({
    episode_id: z
      .string().refine((value) => {
        const parsedValue = Number(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      }, { message: "Invalid Params Episode Id" }),
  }),

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
      .string().refine((value) => {
        const parsedValue = Number(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      }, { message: "Invalid Category Id" }).optional(),
    
    duration: z
      .string().refine((value) => {
        const parsedValue = Number(value);
        return !isNaN(parsedValue) && parsedValue > 0;
      }, { message: "Invalid Duration" }).optional(),
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

const createEpisodeCommentSchema = z.object({
  body: z.object({
    episode_id: z.number({
      required_error: 'Episode Id is required',
    })
    .min(1, {
      message: 'Episode Id is required',
    }),
    username: z.string({
      required_error: 'Username is required',
    })
    .min(1, {
      message: 'Username is required',
    }),
    comment_text: z.string({
      required_error: 'Comment text is required',
    })
    .min(1, {
      message: 'Comment text is required',
    }),
  })
});

export {
  getEpisodeByIdSchema,
  getEpisodesByCreatorIdSchema,
  createEpisodeSchema,
  updateEpisodeSchema,

  episodeLikeSchema,
  createEpisodeCommentSchema,
}