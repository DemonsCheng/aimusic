import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
      message: "Email is required",
    })
  });
  
  export const RegisterSchema = z.object({
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
    name: z.string().min(2, {
      message: "Name is required",
    }),
  });



  export const InstrumentalFormSchema = z.object({
    description: z
      .string()
      .min(2, {
        message: "description must be at least 2 characters.",
      })
      .max(200, {
        message: "description must be at least 200 characters.",
      }),
  });


  
  export const NormalFormSchema = z.object({
    lyrics: z
      .string()
      .min(1, {
        message: "lyrics must be at least 1 characters.",
      })
      .max(2000, {
        message: "lyrics must be at least 2000 characters.",
      }),
  
    musicStyle: z
      .string()
      .min(1, {
        message: "Style must be at least 1 characters.",
      })
      .max(120, {
        message: "Style must be at least 120 characters.",
      }),
    title: z
      .string()
      .min(1, {
        message: "title must be at least 1 characters.",
      })
      .max(120, {
        message: "title must be at least 120 characters.",
      }),
  });