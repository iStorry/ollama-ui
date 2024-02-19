import { env } from "y/env";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";

type OlammaModelDetails = {
  family: string;
  parameter_size: string;
};

type OllamaModel = {
  name: string;
  size: number;
  digest: string;
  modified_at: Date;
  details: OlammaModelDetails;
};

type OllamaTagResponse = {
  models: OllamaModel[];
};

export const ollamaRouter = createTRPCRouter({
  getTags: publicProcedure.query(async ({ ctx }) => {
    const response = (await fetch(`${env.OLLAMA_HOST}/tags`).then((res) =>
      res.json(),
    )) as OllamaTagResponse;
    return response.models;
  }),
});
