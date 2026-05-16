// constants/forms.ts — Form defaults and validation schema

import { z } from "zod";
import type { SongFormData } from "../types/song";

export const DEFAULT_FORM_STATE: SongFormData = {
  title: "",
  artist: "",
  album: "",
  genre: "Electronic",
  duration: "",
  releaseYear: new Date().getFullYear(),
  description: "",
  status: "DRAFT",
  imageFile: null,
  audioFile: null,
  imagePreview: "",
  audioPreview: "",
};

// Validate only the user-editable text fields. File presence is enforced
// separately in the form (required on create, optional on edit).
export const songFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters"),
  artist: z
    .string()
    .min(1, "Artist is required")
    .max(100, "Artist must be under 100 characters"),
  album: z
    .string()
    .min(1, "Album is required")
    .max(100, "Album must be under 100 characters"),
  genre: z.string().min(1, "Genre is required"),
  duration: z.string().optional().default(""),
  status: z.enum(["LIVE", "PROCESSING", "DRAFT"]),
  releaseYear: z
    .number()
    .int()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the far future"),
  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .default(""),
});

export type SongFormSchema = z.infer<typeof songFormSchema>;
