"use client";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/shared/ui/button";
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
import { handleInstrumentalForm } from "@/server/actions/InstrumentalFormAction";
import { handleNormalForm } from "@/server/actions/NormalFormAction";
import { SelectMusic } from "@/lib/db/schema";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { respErr } from "@/lib/resp";

const instrumentalFormSchema = z.object({
  description: z
    .string()
    .min(2, {
      message: "description must be at least 2 characters.",
    })
    .max(200, {
      message: "description must be at least 200 characters.",
    })
    .default(""),
  title: z
    .string()
    .min(1, {
      message: "title must be at least 1 characters.",
    })
    .max(120, {
      message: "title must be at least 120 characters.",
    })
    .default(""),
  audioFile: z.instanceof(File).optional(),
});

const normalFormSchema = z.object({
  lyrics: z
    .string()
    .min(1, {
      message: "lyrics must be at least 1 characters.",
    })
    .max(2000, {
      message: "lyrics must be at least 2000 characters.",
    })
    .default(""),

  musicStyle: z
    .string()
    .min(1, {
      message: "Style must be at least 1 characters.",
    })
    .max(120, {
      message: "Style must be at least 120 characters.",
    })
    .default(""),
  title: z
    .string()
    .min(1, {
      message: "title must be at least 1 characters.",
    })
    .max(120, {
      message: "title must be at least 120 characters.",
    })
    .default(""),
  audioFile: z.instanceof(File).optional(),
});

interface MusicFormProps {
  songs: SelectMusic[];
  setSongs: Dispatch<SetStateAction<SelectMusic[]>>;
  setRefetch: Dispatch<SetStateAction<boolean>>;
}

export default function MusicForm({ setSongs, setRefetch }: MusicFormProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Progress simulation function
  const simulateProgress = () => {
    setProgress(0);
    setLoading(true);

    const duration = 60000; // 60 seconds total
    const interval = 1000; // Update every second
    const incrementPerInterval = 95 / (duration / interval); // Go up to 95% gradually

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(timer);
          return 95;
        }
        return Math.min(95, prev + incrementPerInterval);
      });
    }, interval);

    return timer;
  };

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
      title: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmitExtendNormalForm(
    values: z.infer<typeof normalFormSchema>
  ) {
    const progressTimer = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("lyrics", values.lyrics);
      formData.append("musicStyle", values.musicStyle);
      formData.append("title", values.title);
      formData.append("type", "normal");
      if (values.audioFile) {
        formData.append("audioFile", values.audioFile);
      }

      const res = await fetch("/api/music-extend", {
        method: "POST",
        body: formData,
      });
      const { code, data } = await res.json();

      if (code === 0) {
        const hasAudioUrl = data?.some(
          (song: SelectMusic) => !song.audio_url || song.audio_url.length === 0
        );

        if (hasAudioUrl) {
          setRefetch(true);
          console.log("Setting refetch to true");
        }

        data.forEach((song: SelectMusic) => {
          setSongs((prevSongs) => [song, ...prevSongs]);
        });
        // Complete the progress bar
        setProgress(100);
      }
    } catch (error) {
      toast.error("Failed to process the request");
      console.error("Error:", error);
    } finally {
      // Clear the timer and reset states after a delay
      setTimeout(() => {
        clearInterval(progressTimer);
        setLoading(false);
        setProgress(0);
      }, 1000);
    }
  }

  async function onSubmitExtendInstrumentalForm(
    values: z.infer<typeof instrumentalFormSchema>
  ) {
    const progressTimer = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("description", values.description);
      formData.append("title", values.title);
      formData.append("type", "instrumental");
      if (values.audioFile) {
        formData.append("audioFile", values.audioFile);
      }
      console.log("123requestData:", values.audioFile);
      const res = await fetch("/api/music-extend", {
        method: "POST",
        body: formData,
      });
      const { code, data } = await res.json();
      console.log("123data:", data);
      console.log("code:", code);
      if (code === 0) {
        const hasAudioUrl = data?.every(
          (song: SelectMusic) => song.audio_url && song.audio_url.length > 0
        );
        console.log("hasAudioUrl", hasAudioUrl);
        if (!hasAudioUrl) {
          setRefetch(true);
        }

        data.map((song: SelectMusic) => {
          setSongs((songs: SelectMusic[]) => [song, ...songs]);
        });
        // Complete the progress bar
        setProgress(100);
      }
    } catch (error) {
      toast.error("Failed to process the request");
      console.error("Error:", error);
      return respErr("Failed to process the request");
    } finally {
      // Clear the timer and reset states after a delay
      setTimeout(() => {
        clearInterval(progressTimer);
        setLoading(false);
        setProgress(0);
      }, 1000);
    }
  }

  function handleFileSelect(file: File | null) {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    if (normalForm.getValues("audioFile") === undefined) {
      normalForm.setValue("audioFile", file);
    } else {
      instrumentalForm.setValue("audioFile", file);
    }

    setSelectedFile(file);
    toast.success("File selected successfully");
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
                onSubmit={normalForm.handleSubmit(onSubmitExtendNormalForm)}
                className="space-y-8"
              >
                <FormField
                  control={normalForm.control}
                  name="lyrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="lyrics">Lyrics</FormLabel>
                      <FormControl>
                        <Textarea
                          id="lyrics"
                          placeholder="Enter your own lyrics or describe a song and click Generate Lyrics..."
                          maxLength={2000}
                          rows={4}
                          {...field}
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
                      <FormLabel htmlFor="musicStyle">Style of Music</FormLabel>
                      <FormControl>
                        <Textarea
                          id="musicStyle"
                          placeholder="Enter style of music"
                          maxLength={120}
                          rows={4}
                          {...field}
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
                      <FormLabel htmlFor="title">Title</FormLabel>
                      <FormControl>
                        <Input
                          id="title"
                          placeholder="Enter title of music"
                          maxLength={120}
                          {...field}
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
                  name="audioFile"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Upload Music</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={selectedFile}
                          onFileSelect={(file) => {
                            onChange(file);
                            handleFileSelect(file);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload an audio file to extend or modify
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col items-center justify-center">
                  <Button
                    className="cursor-pointer "
                    size="xl"
                    variant="primary"
                    type="submit"
                    disabled={normalForm.formState.isSubmitting}
                  >
                    {normalForm.formState.isSubmitting
                      ? "Creating..."
                      : "Create"}
                  </Button>
                </div>
                {loading && (
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full bg-primary transition-all duration-200 ease-in-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
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
                  onSubmitExtendInstrumentalForm
                )}
                className="space-y-8"
              >
                <FormField
                  control={instrumentalForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="description"
                          placeholder="Describe the instrumental music you want to create..."
                          maxLength={200}
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the instrumental music you want
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={instrumentalForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="title">Title</FormLabel>
                      <FormControl>
                        <Input
                          id="title"
                          placeholder="Enter title of music"
                          maxLength={120}
                          {...field}
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
                  control={instrumentalForm.control}
                  name="audioFile"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Upload Music</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={selectedFile}
                          onFileSelect={(file) => {
                            onChange(file);
                            handleFileSelect(file);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload an audio file to extend or modify
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col items-center justify-center space-y-4">
                  <Button
                    className="cursor-pointer"
                    size="xl"
                    variant="primary"
                    type="submit"
                    disabled={instrumentalForm.formState.isSubmitting}
                  >
                    {instrumentalForm.formState.isSubmitting
                      ? "Creating..."
                      : "Create"}
                  </Button>
                  {loading && (
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-200 ease-in-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
