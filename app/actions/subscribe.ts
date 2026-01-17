'use server'

import { after } from "next/server";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { checkBotId } from "botid/server";

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeState = {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function subscribeAction(
  prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  console.log("[Subscribe Action] Request received, checking bot id...");

  const verification = await checkBotId();
  if (verification.isBot) {
    console.log("[Subscribe Action] Access denied, bot detected");
    return {
      error: "Access denied",
    };
  }

  try {
    console.log("[Subscribe Action] Bot id verified, extracting form data...");
    const email = formData.get("email");
    console.log("[Subscribe Action] Form data extracted, email:", email);

    // Validate email format
    console.log("[Subscribe Action] Validating email format...");
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      console.log("[Subscribe Action] Email validation failed:", {
        email,
        type: typeof email,
      });
      return {
        error: "Please provide a valid email address",
      };
    }
    console.log("[Subscribe Action] Email format is valid");

    const normalizedEmail = email.toLowerCase().trim();
    console.log("[Subscribe Action] Email normalized:", normalizedEmail);

    // Check if email already exists in Upstash
    console.log("[Subscribe Action] Checking Upstash for existing email...");
    const existingEmail = await redis.get(`subscriber:${normalizedEmail}`);
    console.log(
      "[Subscribe Action] Upstash check result:",
      existingEmail ? "Email exists" : "Email not found"
    );

    if (existingEmail) {
      console.log("[Subscribe Action] Duplicate email detected");
      return {
        error: "This email is already subscribed!",
      };
    }

    // Store email in Upstash with timestamp
    const timestamp = new Date().toISOString();
    console.log(
      "[Subscribe Action] Storing email in Upstash with timestamp:",
      timestamp
    );
    await redis.set(`subscriber:${normalizedEmail}`, {
      email: normalizedEmail,
      subscribedAt: timestamp,
    });
    console.log("[Subscribe Action] Email successfully stored in Upstash");

    // Send confirmation email after response is sent (non-blocking)
    after(async () => {
      console.log(
        "[Subscribe Action] Preparing to send confirmation email via Resend..."
      );
      try {
        const emailResult = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "noreply@ohmybrew.id",
          to: normalizedEmail,
          subject: "Thanks for signing up! ☕",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #AC0000; font-size: 32px; margin: 0; font-weight: bold;">Oh My Brew</h1>
                </div>
                
                <div style="background-color: #F2F0F6; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
                  <h2 style="color: #333; font-size: 24px; margin-top: 0; margin-bottom: 16px;">Thanks for signing up! ☕</h2>
                  
                  <p style="color: #333; font-size: 16px; margin-bottom: 16px;">
                    We're thrilled to have you on board! You're now on our list, and we'll be sure to let you know when we're ready to brew.
                  </p>
                  
                  <p style="color: #333; font-size: 16px; margin-bottom: 0;">
                    Good quality specialty coffee that doesn't take itself too seriously—just your brew, done right.
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #B5B0C5;">
                  <p style="color: #B5B0C5; font-size: 12px; margin: 0;">
                    BSD, Tangerang
                  </p>
                </div>
              </body>
            </html>
          `,
        });
        console.log(
          "[Subscribe Action] Confirmation email sent successfully:",
          emailResult
        );
      } catch (emailError) {
        // Log email error but don't fail the subscription
        // The email is already stored in Upstash
        console.error(
          "[Subscribe Action] Failed to send confirmation email:",
          emailError
        );
      }
    });

    console.log("[Subscribe Action] Returning success response");
    return {
      success: true,
      message: "Successfully subscribed!",
    };
  } catch (error) {
    console.error("[Subscribe Action] Subscription error:", error);
    return {
      error: "Something went wrong. Please try again later.",
    };
  }
}
