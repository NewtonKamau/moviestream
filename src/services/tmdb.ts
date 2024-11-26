import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getTrendingMovies = () => {
  return tmdbApi.get('/trending/movie/week');
};

export const getMovieDetails = (movieId: string) => {
  return tmdbApi.get(`/movie/${movieId}`);
};

export const searchMovies = (query: string) => {
  return tmdbApi.get('/search/movie', {
    params: {
      query,
    },
  });
};

export const getMovieVideos = (movieId: string) => {
  return tmdbApi.get(`/movie/${movieId}/videos`);
};

export const getSimilarMovies = (movieId: string) => {
  return tmdbApi.get(`/movie/${movieId}/similar`);
};
