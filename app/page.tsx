import { Suspense } from "react";
import { MovieCard } from "./components/MovieCard";
import { MovieRow } from "./components/MovieRow"; // NEW
import { SkeletonCard } from "./components/SkeletonCard";
import { getAllMovies, getMoviesByGenre, type Movie } from "./lib/movies";
import { getRebahinHome } from "./lib/rebahin";
import { Play, Info } from "lucide-react";

// Async Component for Suspense
async function MovieList() {
  // Helper to remove duplicates by _id
  const unique = (movies: Movie[]) => {
    const seen = new Set();
    return movies.filter(m => {
      if (seen.has(m._id)) return false;
      seen.add(m._id);
      return true;
    });
  };

  // Fetch distinct categories in parallel
  const [trending, newReleases, action, anime, scifi] = await Promise.all([
    getAllMovies().then(movies => unique(movies.filter(m => m.vote && m.vote > 7.5))),
    getRebahinHome().then(movies => unique(movies)),
    getMoviesByGenre('action').then(movies => unique(movies)),
    getMoviesByGenre('anime').then(movies => unique(movies)),
    getMoviesByGenre('sci-fi').then(movies => unique(movies))
  ]);

  return (
    <div className="space-y-8 pb-20">
      <MovieRow title="Trending Now" movies={trending} />
      <MovieRow title="New Releases" movies={newReleases} />
      <MovieRow title="Action Hits" movies={action} />
      <MovieRow title="Anime Collection" movies={anime} />
      <MovieRow title="Sci-Fi & Fantasy" movies={scifi} />
    </div>
  );
}

// Skeleton Loading State
function MoviesLoading() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-8 w-48 bg-zinc-800 rounded ml-12 animate-pulse" />
          <div className="flex gap-4 overflow-hidden pl-12">
            {Array.from({ length: 6 }).map((_, k) => (
              <div key={k} className="min-w-[200px] h-[300px] bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b] overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/20 to-[#09090b] z-10" />
        <div className="absolute inset-0 bg-[url('https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg')] bg-cover bg-center opacity-60 animate-in fade-in zoom-in duration-1000" />

        {/* Gradient Overlay specific for Netflix look */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

        <div className="relative z-20 flex h-full flex-col justify-center px-6 md:px-16 pt-20 max-w-4xl">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            #1 in Movies Today
          </div>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl lg:text-8xl text-white drop-shadow-2xl mb-4">
            Oppenheimer
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-lg leading-relaxed mb-8 drop-shadow-md font-medium">
            The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded bg-white text-black px-8 py-3 font-bold text-lg hover:bg-zinc-200 transition-colors">
              <Play className="fill-black" size={24} /> Play
            </button>
            <button className="flex items-center gap-2 rounded bg-zinc-600/80 text-white px-8 py-3 font-bold text-lg hover:bg-zinc-600 transition-colors backdrop-blur-sm">
              <Info size={24} /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="relative z-30 -mt-24 md:-mt-32">
        <Suspense fallback={<MoviesLoading />}>
          <MovieList />
        </Suspense>
      </div>
    </main>
  );
}
