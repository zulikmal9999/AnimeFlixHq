import React, { useEffect, useState, useCallback } from "react";
import Search from "../Component/Search";
import AnimeCard from "../Component/AnimeCard";
import { fetchAnime } from "../api's/animeApi";
import { useDebounce } from "react-use";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import NotFound from "../pages/NotFound";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    last_visible_page: 1,
    has_next_page: false,
    current_page: 1
  });
  const itemsPerPage = 12;

  const fetchAnimes = useCallback(async (query = '', page = 1) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await fetchAnime(query, page, itemsPerPage);
      setAnimeList(result.data);
      setPagination(result.pagination);
      setCurrentPage(page);
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch animes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useDebounce(() => {
    if (searchTerm) {
      fetchAnimes(searchTerm, 1); // Reset to first page on new search
    }
  }, 250, [searchTerm]); // 250ms debounce as per requirements

  useEffect(() => {
    fetchAnimes('', 1);
  }, [fetchAnimes]);

  const paginate = (pageNumber) => {
    fetchAnimes(searchTerm, pageNumber); // Fetch new page data from server
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main>
      <div className="pattern">
        <h1 className="text-3xl font-bold underline">Welcome to the AnimeFlixHQ</h1>
      </div>
      <div className="wrapper">
        <header>
          {/* <img src="./bakugou.png" alt="Hero Banner" /> */}
          <h1>Find<span className="text-gradient"> Animes</span> You will enjoy</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-animes">
          <h2>List of Animes</h2>
          {isLoading ? (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <>
              <ul className="flex flex-wrap justify-center">
                {animeList.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </ul>
               {/* Pagination */}
              {pagination.last_visible_page > 1 && (
                <div className="pagination mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {/* Show limited page buttons for better UX */}
                  {Array.from(
                    { length: Math.min(5, pagination.last_visible_page) }, 
                    (_, i) => {
                      // Calculate the page numbers to show based on current page
                      const totalPages = pagination.last_visible_page;
                      let startPage = Math.max(1, currentPage - 2);
                      let endPage = Math.min(totalPages, startPage + 4);
                      
                      if (endPage - startPage < 4) {
                        startPage = Math.max(1, endPage - 4);
                      }
                      
                      return startPage + i;
                    }
                  )
                  .filter(page => page <= pagination.last_visible_page)
                  .map((page) => (
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
                    disabled={!pagination.has_next_page}
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