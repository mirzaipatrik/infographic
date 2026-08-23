import { Suspense } from "react";
import HomeClient from "@/components/HomeClient";
import { isAdmin } from "@/lib/auth";
import { getPublishedInfographic } from "@/lib/infographic";

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [initialData, admin] = await Promise.all([
    getPublishedInfographic(),
    isAdmin(),
  ]);
  return <HomeClient initialData={initialData} isAdmin={admin} />;
}
