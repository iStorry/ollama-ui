"use client";

import * as React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Chat } from "y/components/ui/chat";
import { OllamaNavbar } from "y/components/ui/navbar";
import { api } from "y/trpc/react";

export default function Home() {
  const [model, setModel] = React.useState<string | undefined>();

  return (
    <main className="bg-background text-foreground dark">
      <OllamaNavbar />
      <section className="px-40 py-8">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col items-end justify-end">
            <ModelSelect onSelect={(item) => setModel(item)} />
          </div>
          <Chat model={model} />
        </div>
      </section>
    </main>
  );
}

interface ModelSelectProps {
  onSelect: (model: string) => void;
}

export function ModelSelect({ onSelect }: ModelSelectProps) {
  const { isLoading, data: result } = api.ollama.getTags.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!result) {
    return <div>Something went wrong!</div>;
  }

  return (
    <Select className="max-w-xs" size="sm" placeholder="Select model" onChange={(value) => onSelect(value.target.value)}>
      {result.map((tag) => (
        <SelectItem key={tag.name} value={tag.name}>
          {tag.name}
        </SelectItem>
      ))}
    </Select>
  );
}
