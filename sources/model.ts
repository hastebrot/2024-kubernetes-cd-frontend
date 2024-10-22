import { z } from "zod";
import { Zod } from "./helper.ts";

export type ReleaseSchema = z.output<typeof ReleaseSchema>;
export const ReleaseSchema = Zod.object("ReleaseSchema", {
  number: z.string(),
  author: z.string(),
  date: z.string(),
  message: z.string(),
});

if (import.meta.main) {
  const release = Zod.parseStrict(ReleaseSchema, {
    number: "1",
    author: "author",
    date: new Date().toISOString(),
    message: "message",
  });
  console.log(release);
}
