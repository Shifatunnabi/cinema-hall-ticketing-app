import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";
import type { Booking } from "@/lib/models";
import { executeBkashPayment, getBkashToken, generateTicketNumber } from "@/lib/bkash";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const bookingId = url.searchParams.get("bookingId");
    const paymentID = url.searchParams.get("paymentID");
    const status = url.searchParams.get("status");

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const bookings = await getCollection<Booking>("bookings");
    const booking = await bookings.findOne({ _id: new ObjectId(bookingId) } as any);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // If user cancelled or failed at gateway, mark failed and redirect to get-ticket with error
    if (status && status.toLowerCase() !== "success") {
      await bookings.updateOne({ _id: new ObjectId(bookingId) } as any, { $set: { status: "failed", updatedAt: new Date() } });
      const redirect = `${process.env.APP_BASE_URL || url.origin}/get-ticket?error=payment_failed`;
      return NextResponse.redirect(redirect);
    }

    const pid = paymentID || booking?.bkash?.paymentID;
    if (!pid) {
      await bookings.updateOne({ _id: new ObjectId(bookingId) } as any, { $set: { status: "failed", updatedAt: new Date() } });
      return NextResponse.json({ error: "Missing paymentID" }, { status: 400 });
    }

    // Execute payment
    const token = await getBkashToken();
    const execRes = await executeBkashPayment(pid, token);

    // Success path: execRes.transactionStatus === 'Completed'
    const success = execRes?.transactionStatus?.toLowerCase?.() === "completed" || execRes?.statusCode === "0000";

    if (success) {
      const ticket = generateTicketNumber("AC");
      await bookings.updateOne(
        { _id: new ObjectId(bookingId) } as any,
        { $set: { status: "paid", bkash: { ...(booking.bkash || {}), rawExecuteResponse: execRes, trxID: execRes?.trxID }, ticketNumber: ticket, updatedAt: new Date() } }
      );
      const redirect = `${process.env.APP_BASE_URL || url.origin}/booking-confirmation?bookingId=${bookingId}`;
      return NextResponse.redirect(redirect);
    }

    await bookings.updateOne({ _id: new ObjectId(bookingId) } as any, { $set: { status: "failed", bkash: { ...(booking.bkash || {}), rawExecuteResponse: execRes }, updatedAt: new Date() } });
    const redirect = `${process.env.APP_BASE_URL || url.origin}/get-ticket?error=payment_execute_failed`;
    return NextResponse.redirect(redirect);
  } catch (e: any) {
    console.error("bkash callback error", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
