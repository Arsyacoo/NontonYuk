export interface Episode {
    episode_number: number;
    title: string;
    id: string; // e.g. s1e1
}

export type MoodId = "all" | "adrenaline" | "chill" | "mindblown" | "emotional" | "spooky" | "fantasy";

export interface MoodItem {
    id: MoodId;
    emoji: string;
    labelKey: string;
    descKey: string;
    color: string;
    gradient: string;
    bgGlow: string;
}

export const MOOD_DEFINITIONS: MoodItem[] = [
    {
        id: "all",
        emoji: "✨",
        labelKey: "mood.all",
        descKey: "mood.all_desc",
        color: "text-purple-400",
        gradient: "from-purple-600 to-indigo-600",
        bgGlow: "shadow-purple-600/30 border-purple-500/40",
    },
    {
        id: "adrenaline",
        emoji: "🔥",
        labelKey: "mood.adrenaline",
        descKey: "mood.adrenaline_desc",
        color: "text-amber-400",
        gradient: "from-amber-600 to-rose-600",
        bgGlow: "shadow-rose-600/30 border-rose-500/40",
    },
    {
        id: "chill",
        emoji: "🍿",
        labelKey: "mood.chill",
        descKey: "mood.chill_desc",
        color: "text-emerald-400",
        gradient: "from-emerald-500 to-teal-600",
        bgGlow: "shadow-emerald-600/30 border-emerald-500/40",
    },
    {
        id: "mindblown",
        emoji: "🧠",
        labelKey: "mood.mindblown",
        descKey: "mood.mindblown_desc",
        color: "text-cyan-400",
        gradient: "from-cyan-500 to-blue-600",
        bgGlow: "shadow-cyan-600/30 border-cyan-500/40",
    },
    {
        id: "emotional",
        emoji: "😭",
        labelKey: "mood.emotional",
        descKey: "mood.emotional_desc",
        color: "text-rose-400",
        gradient: "from-rose-500 to-pink-600",
        bgGlow: "shadow-pink-600/30 border-pink-500/40",
    },
    {
        id: "spooky",
        emoji: "👻",
        labelKey: "mood.spooky",
        descKey: "mood.spooky_desc",
        color: "text-violet-400",
        gradient: "from-violet-600 to-purple-800",
        bgGlow: "shadow-violet-600/30 border-violet-500/40",
    },
    {
        id: "fantasy",
        emoji: "🌸",
        labelKey: "mood.fantasy",
        descKey: "mood.fantasy_desc",
        color: "text-fuchsia-400",
        gradient: "from-pink-500 to-purple-600",
        bgGlow: "shadow-fuchsia-600/30 border-fuchsia-500/40",
    },
];

export interface Movie {
    _id: string;
    title: string;
    poster: string;
    year: string;
    vote?: number;
    genre?: string[];
    mood?: MoodId[];
    type?: 'movie' | 'series';
    episodes?: Episode[];
    trailer?: string; // YouTube video ID
}

// Comprehensive Movie Database with Trailer IDs and Mood Tags
export const MOCK_MOVIES: Movie[] = [
    // Trending / New Releases
    { _id: "533535", title: "Deadpool & Wolverine", year: "2024", vote: 8.0, poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", genre: ["action", "trending", "comedy", "sci-fi", "adventure"], mood: ["adrenaline", "chill"], type: 'movie', trailer: "73_1biulkYk" },
    { _id: "1022789", title: "Inside Out 2", year: "2024", vote: 7.9, poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", genre: ["animation", "anime", "trending", "family", "comedy", "fantasy"], mood: ["chill", "emotional", "fantasy"], type: 'movie', trailer: "LEjhYCCgOUM" },
    { _id: "693134", title: "Dune: Part Two", year: "2024", vote: 8.9, poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", genre: ["sci-fi", "trending", "action", "adventure", "drama"], mood: ["mindblown", "adrenaline", "fantasy"], type: 'movie', trailer: "Way9Dexny3w" },
    { _id: "823464", title: "Godzilla x Kong: The New Empire", year: "2024", vote: 7.2, poster: "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg", genre: ["action", "sci-fi", "trending", "adventure", "fantasy"], mood: ["adrenaline", "fantasy"], type: 'movie', trailer: "lV1OOKoDc04" },
    { _id: "1011985", title: "Kung Fu Panda 4", year: "2024", vote: 7.1, poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg", genre: ["animation", "anime", "action", "trending", "comedy", "family"], mood: ["chill", "adrenaline", "fantasy"], type: 'movie', trailer: "_inKs4eeHiI" },
    { _id: "573435", title: "Bad Boys: Ride or Die", year: "2024", vote: 7.5, poster: "https://image.tmdb.org/t/p/w500/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg", genre: ["action", "comedy", "trending", "crime"], mood: ["adrenaline", "chill"], type: 'movie', trailer: "hAC0OY0HgB4" },
    { _id: "653346", title: "Kingdom of the Planet of the Apes", year: "2024", vote: 7.1, poster: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg", genre: ["sci-fi", "action", "adventure", "trending"], mood: ["mindblown", "adrenaline"], type: 'movie', trailer: "XtFI7SNtVpY" },
    { _id: "786892", title: "Furiosa: A Mad Max Saga", year: "2024", vote: 7.6, poster: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg", genre: ["action", "sci-fi", "adventure", "trending", "thriller"], mood: ["adrenaline", "mindblown"], type: 'movie', trailer: "XJMuhw1570c" },
    { _id: "746036", title: "The Fall Guy", year: "2024", vote: 7.3, poster: "https://image.tmdb.org/t/p/w500/tSz1qsmSJon0rqjHBxXZmrotuse.jpg", genre: ["action", "comedy", "trending", "romance"], mood: ["chill", "adrenaline", "emotional"], type: 'movie', trailer: "j7jPnyYy-Og" },
    { _id: "929590", title: "Civil War", year: "2024", vote: 7.0, poster: "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg", genre: ["action", "drama", "trending", "thriller", "war"], mood: ["adrenaline", "mindblown", "emotional"], type: 'movie', trailer: "aDyQxtg0V2w" },

    // Drama / Hits
    { _id: "872585", title: "Oppenheimer", year: "2023", vote: 8.5, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", genre: ["drama", "trending", "history", "biography"], mood: ["mindblown", "emotional"], type: 'movie', trailer: "uYPbbksJxIg" },
    { _id: "157336", title: "Interstellar", year: "2014", vote: 8.7, poster: "https://image.tmdb.org/t/p/w500/gEU2QniL6C8z8PJXVh5PvJ9DMk0.jpg", genre: ["sci-fi", "drama", "trending", "adventure"], mood: ["mindblown", "emotional"], type: 'movie', trailer: "zSWdZATo3cA" },
    { _id: "27205", title: "Inception", year: "2010", vote: 8.3, poster: "https://image.tmdb.org/t/p/w500/9gk7admal4ZLvd9Zr5yQQeDCqIn.jpg", genre: ["sci-fi", "action", "trending", "adventure", "thriller"], mood: ["mindblown", "adrenaline"], type: 'movie', trailer: "YoHD9XEInc0" },
    { _id: "155", title: "The Dark Knight", year: "2008", vote: 8.5, poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", genre: ["action", "drama", "trending", "crime", "thriller"], mood: ["adrenaline", "mindblown", "spooky"], type: 'movie', trailer: "LDG9bisJEaI" },

    // Anime
    { _id: "372058", title: "Your Name.", year: "2016", vote: 8.5, poster: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg", genre: ["anime", "romance", "trending", "animation", "drama"], mood: ["emotional", "fantasy"], type: 'movie', trailer: "hRfHcp2tQLM" },
    { _id: "916224", title: "Suzume", year: "2022", vote: 7.9, poster: "https://image.tmdb.org/t/p/w500/y6LzZ9Cg0Q2fgMglEUyCmrtoFbb.jpg", genre: ["anime", "adventure", "trending", "animation", "fantasy"], mood: ["emotional", "fantasy"], type: 'movie', trailer: "F7nQ0VUAOXg" },
    { _id: "129", title: "Spirited Away", year: "2001", vote: 8.5, poster: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUKGudW53yY2.jpg", genre: ["anime", "fantasy", "trending", "animation", "adventure"], mood: ["fantasy", "emotional", "chill"], type: 'movie', trailer: "ByXuk9QqQkk" },
    { _id: "1241982", title: "Moana 2", year: "2024", vote: 7.0, poster: "https://image.tmdb.org/t/p/w500/4YZpsxpD8hoTxLWNrqqyn1tZk6X.jpg", genre: ["animation", "anime", "coming-soon", "adventure", "trending", "family"], mood: ["chill", "fantasy"], type: 'movie', trailer: "hJQH-75bVkw" },

    // Action Classics
    { _id: "335984", title: "Blade Runner 2049", year: "2017", vote: 8.0, poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", genre: ["sci-fi", "action", "drama", "thriller"], mood: ["mindblown", "spooky"], type: 'movie', trailer: "gCcx85zVzQA" },
    { _id: "414906", title: "The Batman", year: "2022", vote: 7.7, poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", genre: ["action", "drama", "trending", "crime"], mood: ["spooky", "adrenaline", "mindblown"], type: 'movie', trailer: "mqqft239cHc" },
    { _id: "299534", title: "Avengers: Endgame", year: "2019", vote: 8.4, poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", genre: ["action", "trending", "sci-fi", "adventure", "fantasy"], mood: ["adrenaline", "emotional", "fantasy"], type: 'movie', trailer: "TcMBFSGVi1c" },
    { _id: "569094", title: "Spider-Man: Across the Spider-Verse", year: "2023", vote: 8.4, poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", genre: ["animation", "anime", "action", "sci-fi", "trending", "adventure"], mood: ["mindblown", "adrenaline", "fantasy"], type: 'movie', trailer: "cqGjhVJWtEg" },
    { _id: "76600", title: "Avatar: The Way of Water", year: "2022", vote: 7.6, poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", genre: ["sci-fi", "action", "adventure", "trending", "fantasy"], mood: ["fantasy", "adrenaline", "emotional"], type: 'movie', trailer: "d9MyW72ELq0" },
    { _id: "361743", title: "Top Gun: Maverick", year: "2022", vote: 8.2, poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17dbH.jpg", genre: ["action", "trending", "drama"], mood: ["adrenaline", "emotional"], type: 'movie', trailer: "giXcoYDB0GD" },
    { _id: "545611", title: "Everything Everywhere All At Once", year: "2022", vote: 7.9, poster: "https://image.tmdb.org/t/p/w500/rKvCys0f9X1oER2O82b4rh5g5J0.jpg", genre: ["sci-fi", "comedy", "action", "trending", "adventure", "fantasy"], mood: ["mindblown", "chill", "emotional", "fantasy"], type: 'movie', trailer: "wxN1T1uxQ2g" },
    { _id: "180299", title: "The Raid", year: "2011", vote: 7.4, poster: "https://image.tmdb.org/t/p/w500/a2uXoWf2Q0F65Q8VfM6Q3z6x51F.jpg", genre: ["action", "indo-dub", "trending", "crime", "thriller"], mood: ["adrenaline"], type: 'movie', trailer: "m6Q7KnUNhTI" },

    // Series
    {
        _id: "95479",
        title: "Jujutsu Kaisen",
        year: "2020",
        vote: 8.5,
        poster: "https://image.tmdb.org/t/p/w500/fjwEgnyY29b9m8B9eDqfOa7WqF6.jpg",
        genre: ["anime", "action", "trending", "series"],
        mood: ["fantasy", "adrenaline", "spooky"],
        type: "series",
        trailer: "P2S_T4G2f_8",
        episodes: [
            { episode_number: 1, title: "Ryomen Sukuna", id: "s1e1" },
            { episode_number: 2, title: "For Myself", id: "s1e2" },
            { episode_number: 3, title: "Girl of Steel", id: "s1e3" },
            { episode_number: 4, title: "Cursed Womb Must Die", id: "s1e4" },
            { episode_number: 5, title: "Cursed Womb Must Die -II-", id: "s1e5" }
        ]
    },
    {
        _id: "66732",
        title: "Stranger Things",
        year: "2016",
        vote: 8.6,
        poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
        genre: ["drama", "sci-fi", "trending", "series", "mystery"],
        mood: ["spooky", "mindblown", "fantasy"],
        type: "series",
        trailer: "b9EkMc79ZSU",
        episodes: [
            { episode_number: 1, title: "Chapter One: The Vanishing of Will Byers", id: "s1e1" },
            { episode_number: 2, title: "Chapter Two: The Weirdo on Maple Street", id: "s1e2" },
            { episode_number: 3, title: "Chapter Three: Holly, Jolly", id: "s1e3" },
            { episode_number: 4, title: "Chapter Four: The Body", id: "s1e4" },
            { episode_number: 5, title: "Chapter Five: The Flea and the Acrobat", id: "s1e5" }
        ]
    },
    {
        _id: "37854",
        title: "One Piece",
        year: "1999",
        vote: 8.9,
        poster: "https://image.tmdb.org/t/p/w500/cMD9Ygz11yjUhFs0wkuHeI1tqyN.jpg",
        genre: ["anime", "action", "trending", "series", "adventure"],
        mood: ["fantasy", "chill", "adrenaline"],
        type: "series",
        trailer: "A7eSSwLz3P8",
        episodes: [
            { episode_number: 1, title: "I'm Luffy! The Man Who's Gonna Be King of the Pirates!", id: "s1e1" },
            { episode_number: 2, title: "Enter the Great Swordsman! Pirate Hunter Roronoa Zoro!", id: "s1e2" },
            { episode_number: 3, title: "Morgan versus Luffy! Who's the Mysterious Pretty Girl?", id: "s1e3" },
            { episode_number: 4, title: "Luffy's Past! The Red-Haired Shanks appears!", id: "s1e4" },
            { episode_number: 5, title: "Fear, Mysterious Power! Pirate Clown Captain Buggy!", id: "s1e5" }
        ]
    }
];

export async function getAllMovies(): Promise<Movie[]> {
    return MOCK_MOVIES;
}

export async function searchMovies(query: string): Promise<Movie[]> {
    const lowerQuery = query.toLowerCase();
    return MOCK_MOVIES.filter(movie =>
        movie.title.toLowerCase().includes(lowerQuery)
    );
}

export async function getMoviesByMood(mood: MoodId): Promise<Movie[]> {
    if (mood === "all") return MOCK_MOVIES;
    return MOCK_MOVIES.filter(movie => movie.mood?.includes(mood));
}

export async function getMoviesByGenre(slug: string): Promise<Movie[]> {
    const targetGenre = slug.toLowerCase();

    const local = MOCK_MOVIES.filter(movie => {
        if (targetGenre === 'anime') {
            return movie.genre?.some(g => {
                const lower = g.toLowerCase();
                return lower.includes('anime') || lower.includes('animation');
            });
        }
        return movie.genre?.some(g => g.toLowerCase().includes(targetGenre)) ||
            (targetGenre === 'trending' && movie.vote && movie.vote > 7.5);
    });

    return local;
}
