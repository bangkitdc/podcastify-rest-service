import { z } from 'zod';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^\w{5,}$/;
const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const loginSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: "Username is required"
    })
    .min(1, {
      message: "Username is required"
    }),

    password: z.string({
      required_error: "Password is required"
    }).min(1, {
      message: "Password is required"
    }),
  })
});

const registerSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required"
    }).min(1, {
      message: "Email is required"
    }).refine(value => emailRegex.test(value), {
      message: "Invalid email format"
    }),

    username: z.string({
      required_error: "Username is required"
    }).min(1, {
      message: "Username is required"
    }).refine(value => usernameRegex.test(value), {
      message: "Username must consist of a minimum of 5 characters, can be letters, numbers, or underscores"
    }),

    first_name: z.string({
      required_error: "First Name is required"
    }).min(1, {
      message: "First Name is required"
    }).refine(value => nameRegex.test(value), {
      message: "First Name must consist of letters only"
    }),

    last_name: z.string({
      required_error: "Last Name is required"
    }).min(1, {
      message: "Last Name is required"
    }).refine(value => nameRegex.test(value), {
      message: "Last Name must consist of letters only"
    }),

    password: z.string({
      required_error: "Password is required"
    }).min(1, {
      message: "Password is required"
    }).refine(value => passwordRegex.test(value), {
      message: "Password must consist of a minimum of 8 characters, at least one letter, one number, and one special character"
    }),
  })
});

export { loginSchema, registerSchema };