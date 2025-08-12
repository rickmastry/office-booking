import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body.toString("utf8");
    await whook.verify(payload, headers);

    const { data, type } = JSON.parse(payload);

    if (!data || !data.id) {
      console.error("Invalid webhook payload: missing user id", data);
      return res.status(400).json({ success: false, message: "Missing user id" });
    }

    const email = data.email_addresses && data.email_addresses.length > 0
      ? data.email_addresses[0].email_address
      : "";

    const username = ((data.first_name || "") + " " + (data.last_name || "")).trim() || "NoName";

    const userData = {
      clerkId: data.id,
      email,
      username,
      image: data.image_url || "",
    };

    switch (type) {
      case "user.created":
      case "user.updated":
        await User.findOneAndUpdate(
          { clerkId: userData.clerkId },
          userData,
          { upsert: true, new: true }
        );
        break;
      case "user.deleted":
        await User.findOneAndDelete({ clerkId: userData.clerkId });
        break;
      default:
        console.log(`Unhandled event type: ${type}`);
    }

    res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebHooks;
