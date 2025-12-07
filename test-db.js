const clientPromise = require("./config/db");

(async () => {
  try {
    const client = await clientPromise;
    const db = client.db("laundry_management");

    console.log("✅ MongoDB Atlas connected successfully");
    console.log("📂 Database:", db.databaseName);

    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log("📋 Collections:", collections.map(c => c.name).join(", ") || "None (database is empty)");

    // Test ping
    await db.admin().ping();
    console.log("🏓 Ping successful - database is responsive");

    await client.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed", err);
    process.exit(1);
  }
})();

