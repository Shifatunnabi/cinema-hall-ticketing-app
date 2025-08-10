import crypto from "crypto";

/* bKash Sandbox Integration Helpers
   Docs: https://developer.bkash.com/

   Environment variables required:
   - BKASH_BASE_URL (e.g. https://tokenized.sandbox.bka.sh/v1.2.0-beta)
   - BKASH_USERNAME
   - BKASH_PASSWORD
   - BKASH_APP_KEY
   - BKASH_APP_SECRET
   - BKASH_MERCHANT_NUMBER (optional)
   - APP_BASE_URL (public base URL used for callback/redirect)
*/

export type BkashToken = { id_token: string; token_type: string; expires_in: string; refresh_token?: string };

async function callBkash(path: string, options: RequestInit) {
  const base = process.env.BKASH_BASE_URL!;
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
    // @ts-ignore
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`bKash API error ${res.status}: ${t}`);
  }
  return res.json();
}

export async function getBkashToken(): Promise<BkashToken> {
  const username = process.env.BKASH_USERNAME!;
  const password = process.env.BKASH_PASSWORD!;
  const app_key = process.env.BKASH_APP_KEY!;
  const app_secret = process.env.BKASH_APP_SECRET!;

  const res = await fetch(`${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username,
      password,
    },
    body: JSON.stringify({ app_key, app_secret, grant_type: "client_credentials" }),
    cache: "no-store",
    // @ts-ignore
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Failed to obtain bKash token: ${t}`);
  }
  return res.json();
}

export async function createBkashPayment(params: {
  amount: number; // BDT
  invoice: string;
  intent?: "sale" | "authorization";
  merchantAssociationInfo?: string;
  callbackURL: string;
  token: BkashToken;
}) {
  const app_key = process.env.BKASH_APP_KEY!;
  const payload = {
    mode: "0011",
    payerReference: process.env.BKASH_MERCHANT_NUMBER || "",
    callbackURL: params.callbackURL,
    amount: params.amount.toFixed(2),
    currency: "BDT",
    intent: params.intent || "sale",
    merchantInvoiceNumber: params.invoice,
    merchantAssociationInfo: params.merchantAssociationInfo || "",
  };

  return callBkash(`/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      authorization: params.token.id_token,
      "x-app-key": app_key,
    },
    body: JSON.stringify(payload),
  });
}

export async function executeBkashPayment(paymentID: string, token: BkashToken) {
  const app_key = process.env.BKASH_APP_KEY!;
  return callBkash(`/tokenized/checkout/execute`, {
    method: "POST",
    headers: {
      authorization: token.id_token,
      "x-app-key": app_key,
    },
    body: JSON.stringify({ paymentID }),
  });
}

export function generateInvoice(prefix = "INV"): string {
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  const time = Date.now().toString().slice(-6);
  return `${prefix}-${time}-${rand}`;
}

export function generateTicketNumber(prefix = "AC"): string {
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${rand}`;
}
