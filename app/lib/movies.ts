export interface Episode {
    episode_number: number;
    title: string;
    id: string; // e.g. s1e1
}

export interface Movie {
    _id: string;
    title: string;
    poster: string;
    year: string;
    vote?: number;
    genre?: string[];
    type?: 'movie' | 'series';
    episodes?: Episode[];
}

// Comprehensive Movie Database
export const MOCK_MOVIES: Movie[] = [
    // Trending / New Releases
    { _id: "533535", title: "Deadpool & Wolverine", year: "2024", vote: 8.0, poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", genre: ["action", "trending", "comedy", "sci-fi", "adventure"], type: 'movie' },
    { _id: "1022789", title: "Inside Out 2", year: "2024", vote: 7.9, poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", genre: ["animation", "anime", "trending", "family", "comedy", "fantasy"], type: 'movie' },
    { _id: "693134", title: "Dune: Part Two", year: "2024", vote: 8.9, poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", genre: ["sci-fi", "trending", "action", "adventure", "drama"], type: 'movie' },
    { _id: "823464", title: "Godzilla x Kong: The New Empire", year: "2024", vote: 7.2, poster: "https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg", genre: ["action", "sci-fi", "trending", "adventure", "fantasy"], type: 'movie' },
    { _id: "1011985", title: "Kung Fu Panda 4", year: "2024", vote: 7.1, poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg", genre: ["animation", "anime", "action", "trending", "comedy", "family"], type: 'movie' },
    { _id: "573435", title: "Bad Boys: Ride or Die", year: "2024", vote: 7.5, poster: "https://image.tmdb.org/t/p/w500/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg", genre: ["action", "comedy", "trending", "crime"], type: 'movie' },
    { _id: "653346", title: "Kingdom of the Planet of the Apes", year: "2024", vote: 7.1, poster: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg", genre: ["sci-fi", "action", "adventure", "trending"], type: 'movie' },
    { _id: "786892", title: "Furiosa: A Mad Max Saga", year: "2024", vote: 7.6, poster: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg", genre: ["action", "sci-fi", "adventure", "trending", "thriller"], type: 'movie' },
    { _id: "746036", title: "The Fall Guy", year: "2024", vote: 7.3, poster: "https://image.tmdb.org/t/p/w500/tSz1qsmSJon0rqjHBxXZmrotuse.jpg", genre: ["action", "comedy", "trending", "romance"], type: 'movie' },
    { _id: "929590", title: "Civil War", year: "2024", vote: 7.0, poster: "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg", genre: ["action", "drama", "trending", "thriller", "war"], type: 'movie' },

    // Drama / Hits (Updated with working URLs)
    { _id: "872585", title: "Oppenheimer", year: "2023", vote: 8.5, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", genre: ["drama", "trending", "history", "biography"], type: 'movie' },
    { _id: "157336", title: "Interstellar", year: "2014", vote: 8.7, poster: "https://image.tmdb.org/t/p/w500/gEU2QniL6C8z8PJXVh5PvJ9DMk0.jpg", genre: ["sci-fi", "drama", "trending", "adventure"], type: 'movie' },
    { _id: "27205", title: "Inception", year: "2010", vote: 8.3, poster: "https://image.tmdb.org/t/p/w500/9gk7admal4ZLvd9Zr5yQQeDCqIn.jpg", genre: ["sci-fi", "action", "trending", "adventure", "thriller"], type: 'movie' },
    { _id: "155", title: "The Dark Knight", year: "2008", vote: 8.5, poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", genre: ["action", "drama", "trending", "crime", "thriller"], type: 'movie' },

    // Anime
    { _id: "372058", title: "Your Name.", year: "2016", vote: 8.5, poster: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg", genre: ["anime", "romance", "trending", "animation", "drama"], type: 'movie' },
    { _id: "916224", title: "Suzume", year: "2022", vote: 7.9, poster: "https://image.tmdb.org/t/p/w500/y6LzZ9Cg0Q2fgMglEUyCmrtoFbb.jpg", genre: ["anime", "adventure", "trending", "animation", "fantasy"], type: 'movie' },
    { _id: "129", title: "Spirited Away", year: "2001", vote: 8.5, poster: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUKGudW53yY2.jpg", genre: ["anime", "fantasy", "trending", "animation", "adventure"], type: 'movie' },
    { _id: "1241982", title: "Moana 2", year: "2024", vote: 7.0, poster: "https://image.tmdb.org/t/p/w500/4YZpsxpD8hoTxLWNrqqyn1tZk6X.jpg", genre: ["animation", "anime", "coming-soon", "adventure", "trending", "family"], type: 'movie' },

    // Action Classics
    { _id: "335984", title: "Blade Runner 2049", year: "2017", vote: 8.0, poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", genre: ["sci-fi", "action", "drama", "thriller"], type: 'movie' },
    { _id: "414906", title: "The Batman", year: "2022", vote: 7.7, poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", genre: ["action", "drama", "trending", "crime"], type: 'movie' },
    { _id: "299534", title: "Avengers: Endgame", year: "2019", vote: 8.4, poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", genre: ["action", "trending", "sci-fi", "adventure", "fantasy"], type: 'movie' },
    { _id: "569094", title: "Spider-Man: Across the Spider-Verse", year: "2023", vote: 8.4, poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", genre: ["animation", "anime", "action", "sci-fi", "trending", "adventure"], type: 'movie' },
    { _id: "76600", title: "Avatar: The Way of Water", year: "2022", vote: 7.6, poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", genre: ["sci-fi", "action", "adventure", "trending", "fantasy"], type: 'movie' },
    { _id: "361743", title: "Top Gun: Maverick", year: "2022", vote: 8.2, poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17dbH.jpg", genre: ["action", "trending", "drama"], type: 'movie' },
    { _id: "545611", title: "Everything Everywhere All At Once", year: "2022", vote: 7.9, poster: "https://image.tmdb.org/t/p/w500/rKvCys0f9X1oER2O82b4rh5g5J0.jpg", genre: ["sci-fi", "comedy", "action", "trending", "adventure", "fantasy"], type: 'movie' },
    { _id: "180299", title: "The Raid", year: "2011", vote: 7.4, poster: "https://image.tmdb.org/t/p/w500/a2uXoWf2Q0F65Q8VfM6Q3z6x51F.jpg", genre: ["action", "indo-dub", "trending", "crime", "thriller"], type: 'movie' },

    // Series Example
    {
        _id: "95479",
        title: "Jujutsu Kaisen",
        year: "2020",
        vote: 8.5,
        poster: "https://image.tmdb.org/t/p/w500/fjwEgnyY29b9m8B9eDqfOa7WqF6.jpg",
        genre: ["anime", "action", "trending", "series"],
        type: "series",
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
        type: "series",
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
        type: "series",
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

// Simple simulation of "genres" since our mock data doesn't really have them
// Filter movies by genre slug
export async function getMoviesByGenre(slug: string): Promise<Movie[]> {
    const targetGenre = slug.toLowerCase();

    // 1. Filter local movies that include the genre tag
    const local = MOCK_MOVIES.filter(movie => {
        // Special logic for "Anime" to include "Animation" (Western)
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
