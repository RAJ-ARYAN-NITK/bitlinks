import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";

export default async function Page({ params }) {
  // ✅ Awaiting params explicitly as per Edge Runtime needs
  const shorturl = (await params).shorturl;

  const client = await clientPromise;
  const db = client.db("bitLinks");
  const collection = db.collection("url");

  const doc = await collection.findOne({ shorturl });

  if (doc && doc.url) {
    redirect(doc.url); // Redirect to original long URL
  } else {
    redirect(process.env.NEXT_PUBLIC_HOST || "/");
  }

  return null;
}