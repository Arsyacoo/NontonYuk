import { Suspense } from "react";
import { getAllMovies, getMoviesByGenre, type Movie } from "./lib/movies";
import { getRebahinHome } from "./lib/rebahin";
import { HomeClient } from "./components/HomeClient";

// Helper to remove duplicates by _id
function unique(movies: Movie[]) {
  const seen = new Set();
  return movies.filter((m) => {
    if (seen.has(m._id)) return false;
    seen.add(m._id);
    return true;
  });
}

// Skeleton Loading State
function MoviesLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] space-y-12 pt-28">
      <div className="h-[60vh] w-full bg-zinc-900 animate-pulse rounded-2xl mx-auto max-w-7xl" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-4 max-w-7xl mx-auto px-6">
          <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, k) => (
              <div key={k} className="min-w-[180px] h-[280px] bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

async function HomeDataFetcher() {
  const [allMovies, trending, newReleases, action, anime, scifi] = await Promise.all([
    getAllMovies().then((movies) => unique(movies)),
    getAllMovies().then((movies) => unique(movies.filter((m) => m.vote && m.vote > 7.5))),
    getRebahinHome().then((movies) => unique(movies)),
    getMoviesByGenre("action").then((movies) => unique(movies)),
    getMoviesByGenre("anime").then((movies) => unique(movies)),
    getMoviesByGenre("sci-fi").then((movies) => unique(movies)),
  ]);

  return (
    <HomeClient
      allMovies={allMovies}
      trending={trending}
      newReleases={newReleases}
      action={action}
      anime={anime}
      scifi={scifi}
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={<MoviesLoading />}>
      <HomeDataFetcher />
    </Suspense>
  );
}
