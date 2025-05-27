import { Suspense } from "react";
import GenerateClient from "./GenerateClient";

export default function GeneratePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateClient />
    </Suspense>
  );
}
