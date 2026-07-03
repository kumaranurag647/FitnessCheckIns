"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface Checkin {
  id: number;
  name: string;
  email: string;
  age: number;
  weight: string;
  height_feet: string;
  height_inches: string;
  chest: string;
  arms: string;
  thighs: string;
  calves: string;
  waist: string;
  goal: string;
  diet_type: string;
  food_preferences: string;
  food_allergies: string;
  medical_conditions: string;
  injuries: string;
  anabolic_history: string;
  daily_routine: string;
  front_image: string;
  left_image: string;
  right_image: string;
  back_image: string;
  created_at: string;
}

export default function ClientCheckinsView() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialFinished, setInitialFinished] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [imageViewer, setImageViewer] = useState<{ src: string; alt: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState("");
  const touchZoomRef = useRef<{ startDistance: number; startZoom: number } | null>(null);
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null);

  const getDistance = (touches: React.TouchList) => {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const openImageViewer = (src: string, alt: string) => {
    setImageViewer({ src, alt });
    setZoom(1);
    touchZoomRef.current = null;
  };

  const closeImageViewer = () => {
    setImageViewer(null);
    setZoom(1);
    touchZoomRef.current = null;
  };

  const handleImageTouchStart = (event: React.TouchEvent<HTMLImageElement>) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      touchZoomRef.current = {
        startDistance: getDistance(event.touches),
        startZoom: zoom,
      };
    }
  };

  const handleImageTouchMove = (event: React.TouchEvent<HTMLImageElement>) => {
    if (event.touches.length === 2 && touchZoomRef.current) {
      event.preventDefault();
      const nextDistance = getDistance(event.touches);
      const nextZoom = touchZoomRef.current.startZoom * (nextDistance / touchZoomRef.current.startDistance);
      setZoom(Math.min(4, Math.max(1, nextZoom)));
    }
  };

  const handleImageTouchEnd = (event: React.TouchEvent<HTMLImageElement>) => {
    if (event.touches.length < 2) {
      touchZoomRef.current = null;
    }
  };

  const fetchCheckins = async (search = "") => {
    setError("");
    if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    loadingTimeout.current = setTimeout(() => setLoading(true), 200);

    try {
      const url = new URL("/api/client-checkins", window.location.origin);
      if (search) url.searchParams.set("q", search);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load check-ins");
      }

      setCheckins(data.data || []);
      setSearchTerm(search);
      setInitialFinished(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load check-ins");
    } finally {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
        loadingTimeout.current = null;
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckins();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCheckins(query);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const visibleCount = useMemo(() => checkins.length, [checkins]);

  return (
    <main className="min-h-screen bg-black text-white py-8 px-2">
      <div className="mx-auto w-full max-w-6xl bg-black rounded-[32px] p-2 md:p-4">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 pl-2">
            <h1 className="text-4xl font-semibold">Client Check-Ins</h1>
            <p className="mt-3 text-zinc-400 max-w-2xl">
              Search and review all client check-ins with images and details in an accordion view.
            </p>
          </div>

          <div className="w-full max-w-full md:max-w-md">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search client by name"
                className="w-full rounded-3xl border border-zinc-700 bg-zinc-900 py-4 pl-12 pr-4 text-white outline-none transition focus:border-white"
              />
            </label>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-4">
          <div>
            <p className="text-sm text-zinc-400">Showing</p>
            <p className="text-xl font-semibold">{visibleCount} result{visibleCount === 1 ? "" : "s"}</p>
          </div>
          <div className="text-sm text-zinc-400">Search term: <span className="text-white">{searchTerm || "All clients"}</span></div>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-500 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        ) : null}

        {loading && !initialFinished ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-300">
            Loading client check-ins...
          </div>
        ) : (
          <div className="space-y-4">
            {checkins.map((checkin) => {
              const isOpen = expandedId === checkin.id;
              return (
                <div
                  key={checkin.id}
                  className="overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : checkin.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <div>
                      <p className="text-sm text-zinc-400">{new Date(checkin.created_at).toLocaleString()}</p>
                      <h2 className="text-xl font-semibold">{checkin.name}</h2>
                      <p className="mt-1 text-zinc-500">{checkin.email}</p>
                    </div>
                    <ChevronDown
                      size={24}
                      className={`transition ${isOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>

                  {isOpen ? (
                    <div className="border-t border-zinc-800 px-6 py-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="rounded-3xl bg-zinc-900 p-5">
                            <h3 className="text-sm uppercase tracking-[0.2em] text-zinc-500">Measurements</h3>
                            <div className="mt-4 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                              <div>Age: {checkin.age}</div>
                              <div>Weight: {checkin.weight}</div>
                              <div>Height: {checkin.height_feet} ft {checkin.height_inches} in</div>
                              <div>Chest: {checkin.chest}</div>
                              <div>Arms: {checkin.arms}</div>
                              <div>Thighs: {checkin.thighs}</div>
                              <div>Calves: {checkin.calves}</div>
                              <div>Waist: {checkin.waist}</div>
                            </div>
                          </div>

                          <div className="rounded-3xl bg-zinc-900 p-5">
                            <h3 className="text-sm uppercase tracking-[0.2em] text-zinc-500">Goals & Nutrition</h3>
                            <div className="mt-4 space-y-3 text-sm text-zinc-300">
                              <div><span className="font-semibold text-white">Goal:</span> {checkin.goal}</div>
                              <div><span className="font-semibold text-white">Diet:</span> {checkin.diet_type}</div>
                              <div><span className="font-semibold text-white">Preferences:</span> {checkin.food_preferences}</div>
                              <div><span className="font-semibold text-white">Allergies:</span> {checkin.food_allergies}</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-3xl bg-zinc-900 p-5">
                            <h3 className="text-sm uppercase tracking-[0.2em] text-zinc-500">Health History</h3>
                            <div className="mt-4 space-y-3 text-sm text-zinc-300">
                              <div><span className="font-semibold text-white">Medical conditions:</span> {checkin.medical_conditions}</div>
                              <div><span className="font-semibold text-white">Injuries:</span> {checkin.injuries}</div>
                              <div><span className="font-semibold text-white">Anabolic history:</span> {checkin.anabolic_history}</div>
                              <div><span className="font-semibold text-white">Routine:</span> {checkin.daily_routine}</div>
                            </div>
                          </div>

                          <div className="rounded-3xl bg-zinc-900 p-5">
                            <h3 className="text-sm uppercase tracking-[0.2em] text-zinc-500">Check-In Photos</h3>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <img
                                src={checkin.front_image}
                                alt="Front relaxed"
                                className="aspect-square w-full rounded-3xl object-cover"
                                onClick={() => openImageViewer(checkin.front_image, "Front relaxed")}
                              />
                              <img
                                src={checkin.left_image}
                                alt="Left side"
                                className="aspect-square w-full rounded-3xl object-cover"
                                onClick={() => openImageViewer(checkin.left_image, "Left side")}
                              />
                              <img
                                src={checkin.right_image}
                                alt="Right side"
                                className="aspect-square w-full rounded-3xl object-cover"
                                onClick={() => openImageViewer(checkin.right_image, "Right side")}
                              />
                              <img
                                src={checkin.back_image}
                                alt="Back relaxed"
                                className="aspect-square w-full rounded-3xl object-cover"
                                onClick={() => openImageViewer(checkin.back_image, "Back relaxed")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {imageViewer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <button
            onClick={closeImageViewer}
            onTouchStart={closeImageViewer}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 p-3 text-white shadow-xl"
            aria-label="Close image viewer"
            type="button"
          >
            <X size={20} />
          </button>

          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl">
            <img
              src={imageViewer.src}
              alt={imageViewer.alt}
              className="max-h-full max-w-full object-contain"
              style={{ transform: `scale(${zoom})` }}
              onTouchStart={handleImageTouchStart}
              onTouchMove={handleImageTouchMove}
              onTouchEnd={handleImageTouchEnd}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
