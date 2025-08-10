import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";
import type { Booking, Movie } from "@/lib/models";
import { createBkashPayment, generateInvoice, getBkashToken } from "@/lib/bkash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      movieId,
      movieTitle,
      showDate,
      showTime,
      seatType,
      quantity,
      unitPrice,
      totalAmount,
      customerName,
      customerMobile,
      customerEmail,
    } = body || {};

    if (!movieId || !showDate || !showTime || !seatType || !quantity || !unitPrice || !totalAmount || !customerName || !customerMobile || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create a pending booking
    const bookings = await getCollection<Booking>("bookings");
    const invoice = generateInvoice("TKT");
    const bookingDoc: Booking = {
      status: "initiated",
      movieId: new ObjectId(movieId),
      movieTitle: movieTitle || "",
      showDate,
      showTime,
      seatType,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalAmount: Number(totalAmount),
      customerName,
      customerMobile,
      customerEmail,
      provider: "bkash",
      bkash: {
        invoice,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { insertedId } = await bookings.insertOne(bookingDoc as any);

    // Prepare bKash create payment
    const token = await getBkashToken();

    const appBase = process.env.APP_BASE_URL || req.nextUrl.origin;
    const callbackURL = `${appBase}/api/payments/bkash/callback?bookingId=${insertedId.toString()}`;

    const createRes = await createBkashPayment({
      amount: Number(totalAmount),
      invoice,
      callbackURL,
      token,
    });

    // Save create response details
    await bookings.updateOne(
      { _id: insertedId },
      { $set: { bkash: { ...(bookingDoc.bkash || {}), rawCreateResponse: createRes, paymentID: createRes.paymentID }, updatedAt: new Date() } }
    );

    // Return redirectURL to client
    if (createRes && createRes.bkashURL) {
      return NextResponse.json({ redirectURL: createRes.bkashURL });
    }

    // In some versions, redirect is returned as redirectURL
    if (createRes && createRes.redirectURL) {
      return NextResponse.json({ redirectURL: createRes.redirectURL });
    }

    return NextResponse.json({ error: "Failed to get bKash redirect URL", createRes }, { status: 500 });
  } catch (e: any) {
    console.error("bkash create error", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
