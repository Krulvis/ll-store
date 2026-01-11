import {z} from "zod"

export const PostStoreMeasurementSchema = z.object({
    name: z.string(),
    forehead: z.number(),
    mouth: z.number(),
    neck: z.number(),
})