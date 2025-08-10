"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, EyeOff, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin-layout";
import { Calendar } from "@/components/ui/calendar";

// Mock movie data
const mockMovies = [] as any[];

// Helpers
function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeYouTubeEmbed(url: string) {
  if (!url) return url;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    // If already embed
    if (u.pathname.startsWith("/embed/"))
      return `https://www.youtube.com${u.pathname}`;

    // youtu.be/<id>
    if (host === "youtu.be") {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    // youtube.com/watch?v=<id>
    if (host.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
  } catch {
    // ignore
  }
  return url;
}

export default function MovieManagement() {
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>(mockMovies);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    durationMinutes: "",
    poster: "",
    thumbnail: "",
    trailer: "",
    description: "",
    status: "now-showing",
    schedule: {} as any,
  });

  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  // Showtimes state
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [activeDateKey, setActiveDateKey] = useState<string | null>(null);
  const [newTime, setNewTime] = useState("");
  const [activeCategories, setActiveCategories] = useState<{
    [k: string]: { [time: string]: { name: string; price: string }[] };
  }>({});

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth");
      if (adminAuth !== "authenticated") {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/movies", { cache: "no-store" });
        const json = await res.json();
        if (res.ok) setMovies(json);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  function resetForm() {
    setFormData({
      title: "",
      genre: "",
      durationMinutes: "",
      poster: "",
      thumbnail: "",
      trailer: "",
      description: "",
      status: "now-showing",
      schedule: {},
    });
    setSelectedDates([]);
    setActiveDateKey(null);
    setNewTime("");
    setActiveCategories({});
  }

  const handlePosterFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsUploadingPoster(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "cinema/posters");
      const res = await fetch("/api/uploads/image", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setFormData((fd) => ({ ...fd, poster: json.secure_url }));
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed");
    } finally {
      setIsUploadingPoster(false);
    }
  };

  const handleThumbFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsUploadingThumb(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "cinema/thumbnails");
      const res = await fetch("/api/uploads/image", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setFormData((fd) => ({ ...fd, thumbnail: json.secure_url } as any));
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed");
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const onCalendarSelect = (dates?: Date[]) => {
    const arr = dates || [];
    setSelectedDates(arr);

    setFormData((fd) => {
      const next: Record<string, any[]> = { ...(fd.schedule as any) };
      const selectedKeys = new Set(arr.map(dateKey));
      Object.keys(next).forEach((k) => {
        if (!selectedKeys.has(k)) delete next[k];
      });
      for (const k of selectedKeys) {
        if (!next[k]) next[k] = [];
      }
      const newActive =
        activeDateKey && selectedKeys.has(activeDateKey)
          ? activeDateKey
          : arr[0]
          ? dateKey(arr[0])
          : null;
      setActiveDateKey(newActive);
      return { ...fd, schedule: next as any };
    });
  };

  const defaultCats = [
    { name: "Front", price: "80" },
    { name: "Rear", price: "100" },
  ];

  const addTimeForActiveDate = () => {
    if (!activeDateKey || !newTime) return;
    setFormData((fd) => {
      const existing = ((fd.schedule as any)[activeDateKey] as any[]) || [];
      const list = [...existing];
      const exists = list.some((st) => st.time === newTime);
      if (!exists)
        list.push({
          time: newTime,
          categories: defaultCats.map((c) => ({
            name: c.name,
            price: Number(c.price),
          })),
        });
      return {
        ...fd,
        schedule: {
          ...(fd.schedule as any),
          [activeDateKey]: list.sort((a, b) => a.time.localeCompare(b.time)),
        } as any,
      };
    });
    setActiveCategories((prev) => ({
      ...prev,
      [activeDateKey]: {
        ...(prev[activeDateKey] || {}),
        [newTime]: defaultCats.map((c) => ({ name: c.name, price: c.price })),
      },
    }));
    setNewTime("");
  };

  const updateCategoryPrice = (
    dateK: string,
    time: string,
    idx: number,
    value: string
  ) => {
    const prevTimeMap = activeCategories[dateK] || {};
    const prevCats = prevTimeMap[time] || defaultCats;
    const newCats = prevCats.map((c, i) =>
      i === idx ? { ...c, price: value } : c
    );

    setActiveCategories((prev) => ({
      ...prev,
      [dateK]: { ...(prev[dateK] || {}), [time]: newCats },
    }));

    setFormData((fd) => {
      const existing = ((fd.schedule as any)[dateK] as any[]) || [];
      const list = [...existing];
      const idxTime = list.findIndex((st) => st.time === time);
      if (idxTime > -1) {
        const catsNum = newCats.map((c) => ({
          name: c.name,
          price: Number(c.price),
        }));
        list[idxTime] = { ...list[idxTime], categories: catsNum };
      }
      return {
        ...fd,
        schedule: { ...(fd.schedule as any), [dateK]: list } as any,
      };
    });
  };

  const removeTime = (k: string, t: string) => {
    setFormData((fd) => {
      const existing = ((fd.schedule as any)[k] as any[]) || [];
      const list = [...existing];
      const filtered = list.filter((st) => st.time !== t);
      return {
        ...fd,
        schedule: { ...(fd.schedule as any), [k]: filtered } as any,
      };
    });
    setActiveCategories((prev) => {
      const copy = { ...(prev || {}) };
      if (copy[k]) {
        const timeMap = { ...copy[k] };
        delete timeMap[t];
        copy[k] = timeMap;
      }
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      title: formData.title,
      genre: formData.genre,
      durationMinutes: Number(formData.durationMinutes),
      poster: formData.poster,
      thumbnail: (formData as any).thumbnail,
      trailer: formData.trailer,
      description: formData.description,
      status: formData.status,
      schedule: formData.schedule,
    };

    try {
      if (editingMovie) {
        const res = await fetch(`/api/movies/${editingMovie._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        if (res.ok)
          setMovies((prev) =>
            prev.map((m) => (m._id === editingMovie._id ? updated : m))
          );
        setEditingMovie(null);
      } else {
        const res = await fetch("/api/movies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        if (res.ok) setMovies((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (movie: any) => {
    setEditingMovie(movie);
    const schedule = (movie.schedule || {}) as Record<
      string,
      { time: string; categories: { name: string; price: number }[] }[]
    >;
    const keys = Object.keys(schedule);
    const dates = keys.map((k) => {
      const [y, m, d] = k.split("-").map((n: string) => parseInt(n, 10));
      return new Date(y, (m || 1) - 1, d || 1);
    });

    // build activeCategories for edit
    const ac: {
      [k: string]: { [time: string]: { name: string; price: string }[] };
    } = {};
    for (const k of keys) {
      ac[k] = {};
      for (const st of schedule[k]) {
        ac[k][st.time] = st.categories.map((c) => ({
          name: c.name,
          price: String(c.price),
        }));
      }
    }

    setFormData({
      title: movie.title,
      genre: (movie.genres || []).join(", "),
      durationMinutes: String(movie.durationMinutes || ""),
      poster: movie.poster,
      trailer: movie.trailer,
      description: movie.description,
      status: movie.status,
      schedule,
      ...(movie.thumbnail ? { thumbnail: movie.thumbnail } : {}),
    } as any);
    setActiveCategories(ac);
    setSelectedDates(dates);
    setActiveDateKey(keys[0] || null);
    setNewTime("");
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    try {
      await fetch(`/api/movies/${id}`, { method: "DELETE" });
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleActive = (id: number) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, isActive: !movie.isActive } : movie
      )
    );
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2C3930] mb-2">
            Movie Management
          </h1>
          <p className="text-[#3F4F44]">
            Add, edit, or remove movies from your cinema listings.
          </p>
        </div>

        {/* Add Movie Button */}
        <div className="mb-8">
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingMovie(null);
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingMovie(null);
                  resetForm();
                }}
                className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]"
              >
                <Plus size={20} className="mr-2" />
                Add New Movie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingMovie ? "Edit Movie" : "Add New Movie"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#2C3930] font-medium mb-2">
                      Movie Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter movie title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#2C3930] font-medium mb-2">
                      Genre *
                    </label>
                    <Input
                      value={formData.genre}
                      onChange={(e) =>
                        setFormData({ ...formData, genre: e.target.value })
                      }
                      placeholder="e.g., Action, Drama"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#2C3930] font-medium mb-2">
                      Duration (minutes) *
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.durationMinutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationMinutes: e.target.value,
                        })
                      }
                      placeholder="e.g., 150"
                      required
                    />
                  </div>
                </div>

                {/* Poster - Cloudinary Upload via signed server route */}
                <div className="space-y-2">
                  <label className="block text-[#2C3930] font-medium">
                    Poster (Cloudinary upload) *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterFileChange}
                      disabled={isUploadingPoster}
                    />
                    {isUploadingPoster && (
                      <span className="text-sm text-[#3F4F44]">
                        Uploading...
                      </span>
                    )}
                    {uploadError && (
                      <span className="text-sm text-red-600">
                        {uploadError}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
                    <Input
                      value={formData.poster}
                      onChange={(e) =>
                        setFormData({ ...formData, poster: e.target.value })
                      }
                      placeholder="Poster URL (auto-filled after upload)"
                      required
                    />
                    {formData.poster ? (
                      <div className="w-24 h-32 overflow-hidden rounded border">
                        {/* next/image respects global unoptimized; still pass unoptimized for safety */}
                        <Image
                          src={formData.poster}
                          alt="Poster preview"
                          width={96}
                          height={128}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[#2C3930] font-medium">
                    Thumbnail (Cloudinary upload)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbFileChange}
                      disabled={isUploadingThumb}
                    />
                    {isUploadingThumb && (
                      <span className="text-sm text-[#3F4F44]">
                        Uploading...
                      </span>
                    )}
                    {uploadError && (
                      <span className="text-sm text-red-600">
                        {uploadError}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
                    <Input
                      value={(formData as any).thumbnail || ""}
                      onChange={(e) =>
                        setFormData(
                          (fd) =>
                            ({
                              ...(fd as any),
                              thumbnail: e.target.value,
                            } as any)
                        )
                      }
                      placeholder="Thumbnail URL (auto-filled after upload)"
                    />
                    {(formData as any).thumbnail ? (
                      <div className="w-20 h-20 overflow-hidden rounded border">
                        <Image
                          src={(formData as any).thumbnail}
                          alt="Thumb preview"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">
                    Trailer URL (YouTube) *
                  </label>
                  <Input
                    value={formData.trailer}
                    onChange={(e) =>
                      setFormData({ ...formData, trailer: e.target.value })
                    }
                    placeholder="Paste YouTube URL (we'll convert to embed)"
                    required
                  />
                </div>

                {/* Showtimes Scheduler */}
                <div className="space-y-3">
                  <label className="block text-[#2C3930] font-medium">
                    Showtimes
                  </label>
                  <p className="text-xs text-[#3F4F44]">
                    Select one or more dates and add one or more times for each
                    date.
                  </p>
                  <div className="border rounded-md p-3">
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={onCalendarSelect}
                      numberOfMonths={2}
                    />
                  </div>

                  {selectedDates.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedDates.map((d) => {
                          const k = dateKey(d);
                          const isActive = activeDateKey === k;
                          return (
                            <button
                              type="button"
                              key={k}
                              onClick={() => setActiveDateKey(k)}
                              className={`px-3 py-1 rounded-full text-xs border ${
                                isActive
                                  ? "bg-[#A2785C] text-white border-[#A2785C]"
                                  : "border-[#3F4F44]/30 text-[#2C3930]"
                              }`}
                            >
                              {k}
                            </button>
                          );
                        })}
                      </div>

                      {activeDateKey ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={newTime}
                              onChange={(e) => setNewTime(e.target.value)}
                              className="max-w-[180px]"
                            />
                            <Button
                              type="button"
                              onClick={addTimeForActiveDate}
                              className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]"
                            >
                              <Clock size={16} className="mr-1" /> Add time
                            </Button>
                          </div>
                          <div className="flex flex-col gap-3">
                            {(
                              ((formData.schedule as any)[
                                activeDateKey
                              ] as any[]) || []
                            ).map((st: any) => (
                              <div
                                key={`${activeDateKey}-${st.time}`}
                                className="border rounded p-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    {st.time}
                                  </span>
                                  <button
                                    type="button"
                                    className="ml-1 text-red-600 text-xs"
                                    onClick={() =>
                                      removeTime(activeDateKey!, st.time)
                                    }
                                    aria-label={`Remove ${st.time}`}
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {(
                                    activeCategories[activeDateKey!]?.[
                                      st.time
                                    ] || defaultCats
                                  ).map((cat, idx) => (
                                    <div
                                      key={`${activeDateKey}-${st.time}-${idx}`}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="text-xs w-16">
                                        {cat.name}
                                      </span>
                                      <Input
                                        type="number"
                                        min={0}
                                        value={cat.price}
                                        onChange={(e) =>
                                          updateCategoryPrice(
                                            activeDateKey!,
                                            st.time,
                                            idx,
                                            e.target.value
                                          )
                                        }
                                        className="h-8"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {(
                              ((formData.schedule as any)[
                                activeDateKey
                              ] as any[]) || []
                            ).length === 0 && (
                              <span className="text-xs text-[#3F4F44]">
                                No times added yet for {activeDateKey}.
                              </span>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-xs text-[#3F4F44]">No dates selected.</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter movie description"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-3 border border-[#3F4F44]/20 rounded-lg focus:border-[#A2785C] focus:outline-none"
                    required
                  >
                    <option value="now-showing">Now Showing</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
                  <Button
                    type="submit"
                    className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]"
                  >
                    {editingMovie ? "Update Movie" : "Add Movie"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : movies.length === 0 ? (
            <p>No movies yet.</p>
          ) : (
            movies.map((movie) => (
              <Card
                key={movie._id || movie.id}
                className={`bg-white shadow-lg ${
                  !movie.isActive ? "opacity-50" : ""
                }`}
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      width={300}
                      height={400}
                      className="w-full h-48 md:h-64 object-cover rounded-t-lg"
                      unoptimized
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          movie.status === "now-showing"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {movie.status === "now-showing"
                          ? "Now Showing"
                          : "Upcoming"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-bold text-[#2C3930] mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-[#3F4F44] text-sm mb-1">
                    {(movie.genres || []).join(", ")}
                  </p>
                  <p className="text-[#3F4F44] text-sm mb-3">
                    {movie.durationLabel}
                  </p>

                  {movie.trailer ? (
                    <div className="aspect-video w-full mb-3 overflow-hidden rounded">
                      <iframe
                        src={normalizeYouTubeEmbed(movie.trailer)}
                        title="Trailer"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : null}

                  {/* Optional: quick view of schedule */}
                  {movie.schedule && Object.keys(movie.schedule).length > 0 ? (
                    <div className="mb-4">
                      <p className="text-xs text-[#3F4F44] mb-1">Showtimes:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(movie.schedule).map(([k, arr]) => (
                          <span
                            key={k}
                            className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                          >
                            {k}:{" "}
                            {((arr as any[]) || [])
                              .map((st: any) => st.time)
                              .join(", ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(movie)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    {/* toggleActive is still local only; you can add PATCH API to persist later */}
                    <Button
                      size="sm"
                      onClick={async () => {
                        const res = await fetch(`/api/movies/${movie._id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ isActive: !movie.isActive }),
                        });
                        const updated = await res.json();
                        if (res.ok)
                          setMovies((prev) =>
                            prev.map((m) => (m._id === movie._id ? updated : m))
                          );
                      }}
                      variant="outline"
                      className={`text-xs ${
                        movie.isActive
                          ? "border-orange-500 text-orange-500"
                          : "border-green-500 text-green-500"
                      }`}
                    >
                      {movie.isActive ? (
                        <EyeOff size={14} className="mr-1" />
                      ) : (
                        <Eye size={14} className="mr-1" />
                      )}
                      {movie.isActive ? "Hide" : "Show"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(movie._id)}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
