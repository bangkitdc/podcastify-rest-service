import { z } from 'zod';

const getCategoryByIdScehma = z.object({
  body: z.object({
    category_id: z.number({
      required_error: 'Category ID is required',
    })
  })
})

export default getCategoryByIdScehma