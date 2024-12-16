"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const instrumentalFormSchema = z.object({
  description: z
    .string()
    .min(2, {
      message: "description must be at least 2 characters.",
    })
    .max(200, {
      message: "description must be at least 200 characters.",
    }),
});

const normalFormSchema = z.object({
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

export default function MusicForm() {
  // 1. Define your form.
  const normalForm = useForm<z.infer<typeof normalFormSchema>>({
    resolver: zodResolver(normalFormSchema),
    defaultValues: {
      lyrics: "",
      musicStyle: "",
      title: "",
    },
  });

  const instrumentalForm = useForm<z.infer<typeof instrumentalFormSchema>>({
    resolver: zodResolver(instrumentalFormSchema),
    defaultValues: {
      description: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmitNormalForm(values: z.infer<typeof normalFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  function onSubmitInstrumentalForm(
    values: z.infer<typeof instrumentalFormSchema>
  ) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Tabs defaultValue="Normal">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="Normal">Normal</TabsTrigger>
        <TabsTrigger value="Instrumental">Instrumental</TabsTrigger>
      </TabsList>
      <TabsContent value="Normal">
        <Card>
          <CardContent className="space-y-2">
            <Form {...normalForm}>
              <form
                onSubmit={normalForm.handleSubmit(onSubmitNormalForm)}
                className="space-y-8"
              >
                <FormField
                  control={normalForm.control}
                  name="lyrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MusicStyle</FormLabel>
                      <FormControl>
                        <Textarea
                          id="lyrics"
                          defaultValue=""
                          placeholder="Enter your own lyrics or describe a song and click Generate Lyrics..."
                          maxLength={2000}
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={normalForm.control}
                  name="musicStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style of Music</FormLabel>
                      <FormControl>
                        <Textarea
                          id="musicStyle"
                          defaultValue=""
                          placeholder="Enter style of music"
                          maxLength={120}
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={normalForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          id="Title"
                          defaultValue=""
                          placeholder="Enter title of music"
                          maxLength={120}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Create</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Instrumental">
        <Card>
          <CardContent className="space-y-2">
            <Form {...instrumentalForm}>
              <form
                onSubmit={instrumentalForm.handleSubmit(
                  onSubmitInstrumentalForm
                )}
                className="space-y-8"
              >
                <FormField
                  control={instrumentalForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="description"
                          defaultValue=""
                          placeholder="Enter your own lyrics or describe a song and click Generate Lyrics..."
                          maxLength={200}
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Create</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
