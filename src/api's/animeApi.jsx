const API_BASE_URL = "https://api.jikan.moe/v4/anime";
const API_OPTIONS = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

let lastRequestTime = 0;
const THROTTLE_DELAY = 350; // ~3 requests/sec

const throttleRequest = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < THROTTLE_DELAY) {
    await new Promise((resolve) => setTimeout(resolve, THROTTLE_DELAY - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
};

const fetchFromAPI = async (url, params = "") => {
  await throttleRequest();

  try {
    const fullURL = params ? `${url}${params}` : url;
    const response = await fetch(fullURL, API_OPTIONS);

    if (!response.ok) {
      const errorMsg =
        response.status === 429
          ? "Too many requests. Please wait a moment and try again."
          : `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();

    if (!data) {
      throw new Error("Invalid data structure from API");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch data");
  }
};

export const fetchAnime = async (query = "", page = 1, limit = 9) => {
  const searchParams = new URLSearchParams();
  
  if (query.trim()) {
    searchParams.append('q', query);
  }
  
  searchParams.append('page', page);
  searchParams.append('limit', limit);
  
  const result = await fetchFromAPI(API_BASE_URL, `?${searchParams.toString()}`);
  
  return {
    data: result.data || [],
    pagination: result.pagination || {
      last_visible_page: 1,
      has_next_page: false,
      current_page: page
    }
  };
};

export const fetchAnimeMoreInfo = async (id) => {
  if (!id) throw new Error("Anime ID is required");
  
  try {
    const result = await fetchFromAPI(`${API_BASE_URL}/${id}/full`);
    return result.data;
  } catch (error) {
    console.error("Error fetching anime more info:", error);
    return { synopsis: "No additional information available." };
  }
};