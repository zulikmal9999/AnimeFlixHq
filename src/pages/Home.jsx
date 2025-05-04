import React, { useEffect, useState, useCallback } from "react";
import Search from "../Component/Search";
import MoiveCard from "../Component/MoiveCard";
import { fetchAnime } from "../api's/animeApi";
import { useDebounce } from "react-use";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchMovies = useCallback(async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await fetchAnime(query);
      setMovieList(data);
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch movies");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useDebounce(() => {
    if (searchTerm) {
      fetchMovies(searchTerm, 1);
    }
  }, 500, [searchTerm]);

  useEffect(() => {
    fetchMovies('', 1);
  }, [fetchMovies]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = movieList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(movieList.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchMovies(searchTerm, pageNumber); // Fetch new page data
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <main>
      <div className="pattern">
        <h1 className="text-3xl font-bold underline">Welcome to the AnimeFlixHQ</h1>
      </div>
      <div className="wrapper">
        <header>
          <img src="./bakugou.png" alt="Hero Banner" />
          <h1>Find<span className="text-gradient"> Movies</span> You will enjoy</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map((movie) => (
                  <MoiveCard key={movie.mal_id} movie={movie} />
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="pagination mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled+ disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-4 py-2 rounded ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Home;
