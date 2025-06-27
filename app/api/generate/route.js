import clientPromise from "../../../lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();

    const { url, shorturl } = body;

    // Validate inputs
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return Response.json(
        { success: false, error: true, message: "Invalid or missing URL." },
        { status: 400 }
      );
    }

    if (!shorturl || typeof shorturl !== "string") {
      return Response.json(
        { success: false, error: true, message: "Missing or invalid short URL." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bitLinks");
    const collection = db.collection("url");

    // Check if short URL already exists
    const existing = await collection.findOne({ shorturl });
    if (existing) {
      return Response.json(
        { success: false, error: true, message: "Short URL already exists!" },
        { status: 409 }
      );
    }

    // Insert into DB
    await collection.insertOne({ url, shorturl });

    return Response.json(
      { success: true, error: false, message: "URL generated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { success: false, error: true, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
