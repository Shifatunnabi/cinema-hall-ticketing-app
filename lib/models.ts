import type { ObjectId } from "mongodb";

export type Role = "admin" | "moderator";

export interface User {
  _id?: ObjectId;
  email: string;
  name?: string;
  role: Role;
  passwordHash?: string; // only set after activation
  createdAt: Date;
  updatedAt: Date;
  invitedBy?: ObjectId;
  inviteToken?: string; // hashed token for verification
  inviteTokenExpiresAt?: Date;
  isActive: boolean;
}

export type MovieStatus = "now-showing" | "upcoming";

export interface SeatCategory {
  name: string; // e.g., Front, Rear
  price: number; // in Taka
}

export interface ShowTime {
  time: string; // HH:MM
  categories: SeatCategory[]; // pricing per category
}

export interface MovieSchedule {
  [date: string]: ShowTime[]; // e.g., { "2025-08-11": [{ time: "14:30", categories: [...] }] }
}

export interface Movie {
  _id?: ObjectId;
  title: string;
  genres: string[]; // parsed from comma separated input
  durationMinutes: number; // admin inputs minutes
  durationLabel: string; // derived like "2h 30m"
  poster: string; // cloudinary URL
  thumbnail?: string; // optional small image
  trailer: string; // youtube embed URL
  description: string;
  status: MovieStatus;
  isActive: boolean;
  schedule: MovieSchedule;
  createdAt: Date;
  updatedAt: Date;
}
