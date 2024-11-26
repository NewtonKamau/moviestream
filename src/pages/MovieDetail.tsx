import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieVideos, getSimilarMovies } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
}

interface Video {
  key: string;
  name: string;
  type: string;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiExplanation, setAiExplanation] = useState('');

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieResponse, videosResponse, similarResponse] = await Promise.all([
          getMovieDetails(id!),
          getMovieVideos(id!),
          getSimilarMovies(id!),
        ]);

        setMovie(movieResponse.data);
        setVideos(videosResponse.data.results);
        setSimilarMovies(similarResponse.data.results.slice(0, 4));

        // Get AI explanation of the movie
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "user",
              content: `Please provide a brief, engaging explanation of the movie: ${movieResponse.data.title}. Include themes and what makes it interesting. Keep it under 100 words.`
            }],
          }),
        });

        const aiData = await response.json();
        setAiExplanation(aiData.choices[0].message.content);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  const handleWatchClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/watch/${id}`);
    }
  };

  if (loading || !movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
            <div className="flex items-center space-x-4 text-white">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>★ {movie.vote_average.toFixed(1)}</span>
              <div className="flex space-x-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-2 py-1 bg-gray-800 rounded-md text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <p className="text-gray-300 mb-8">{movie.overview}</p>

            <h2 className="text-2xl font-bold text-white mb-4">AI Insight</h2>
            <div className="bg-gray-800 p-4 rounded-lg mb-8">
              <p className="text-gray-300">{aiExplanation}</p>
            </div>

            <button
              onClick={handleWatchClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mb-8"
            >
              {user ? 'Watch Now' : 'Sign in to Watch'}
            </button>

            {videos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Trailers & Clips</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${videos[0].key}`}
                    title="Movie trailer"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Similar Movies</h2>
            <div className="space-y-4">
              {similarMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="flex items-center space-x-4 bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="w-20 h-30 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{movie.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
