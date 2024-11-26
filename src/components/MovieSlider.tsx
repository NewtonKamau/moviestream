import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { PlayIcon, ShareIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { getMovieVideos } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
}

interface Props {
  movies: Movie[];
}

const MovieSlider: React.FC<Props> = ({ movies }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movieTrailers, setMovieTrailers] = useState<{ [key: number]: string }>({});
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrailers = async () => {
      const trailerPromises = movies.map(async (movie) => {
        try {
          const response = await getMovieVideos(movie.id.toString());
          const trailer = response.data.results.find(
            (video: any) => video.type === 'Trailer'
          );
          if (trailer) {
            setMovieTrailers((prev) => ({
              ...prev,
              [movie.id]: trailer.key,
            }));
          }
        } catch (error) {
          console.error('Error fetching trailer:', error);
        }
      });

      await Promise.all(trailerPromises);
    };

    fetchTrailers();
  }, [movies]);

  const handleWatch = (movieId: number) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/watch/${movieId}`);
    }
  };

  const handleShare = async (movieId: number) => {
    try {
      const shareUrl = `${window.location.origin}/movie/${movieId}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Movie link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing movie:', error);
    }
  };

  const handleSchedule = (movieId: number) => {
    // TODO: Implement schedule watching functionality
    alert('Schedule watching coming soon!');
  };

  return (
    <Swiper
      modules={[Navigation, Autoplay, EffectFade]}
      navigation
      effect="fade"
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
      className="w-full h-[70vh]"
    >
      {movies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <div
            className="relative w-full h-full"
            onMouseEnter={() => setHoveredMovie(movie.id)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            {movieTrailers[movie.id] ? (
              <iframe
                src={`https://www.youtube.com/embed/${movieTrailers[movie.id]}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=${movieTrailers[movie.id]}`}
                title={movie.title}
                className="absolute w-full h-full object-cover"
                allow="autoplay; encrypted-media"
                frameBorder="0"
              />
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="absolute w-full h-full object-cover"
              />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-4">{movie.title}</h2>
                <p className="text-gray-200 text-lg mb-6 line-clamp-2 max-w-2xl">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleWatch(movie.id)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <PlayIcon className="w-5 h-5" />
                    <span>{user ? 'Watch Now' : 'Sign in to Watch'}</span>
                  </button>
                  <button
                    onClick={() => handleShare(movie.id)}
                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <ShareIcon className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => handleSchedule(movie.id)}
                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MovieSlider;
