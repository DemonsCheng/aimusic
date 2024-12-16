"use server";

import { z } from "zod"
import {InstrumentalFormSchema, NormalFormSchema}  from "@/schemas";
import { SunoRequest } from "@/types/suno";

//   // 2. Define a submit handler.
//   export async  function onSubmitNormalForm(values: z.infer<typeof NormalFormSchema>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values);
//   }

  export async function handleInstrumentalForm(
    // values: z.infer<typeof InstrumentalFormSchema>
    values: z.infer<typeof InstrumentalFormSchema>
  ) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("Action:", values);
    const {description} = values;
    const t_id =  crypto.randomUUID();
    const callback_url = `http://openapi.aisongen.com:8090/api/gen-music-callback?t_id=${t_id}`;
    const sunoRequest: SunoRequest = {
      prompt: description,
      action: "generate",
      model: "chirp-v4",
      callback_url: callback_url,
      custom: false,
      instrumental: true
    };

    fetch("http://localhost:3000/api/gen-music", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Add other headers as needed
      },
      body: JSON.stringify(sunoRequest) // Convert data to JSON string
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
  }





  
