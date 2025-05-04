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

// export const fetchAnime = async (query = "", limit = 20) => {
//   await throttleRequest(); // Apply delay before every call

//   try {
//     const searchParam = query.trim()
//       ? `?q=${encodeURIComponent(query)}&limit=${limit}`
//       : `?limit=${limit}`;

//     const response = await fetch(`${API_BASE_URL}${searchParam}`, API_OPTIONS);

//     if (!response.ok) {
//       const errorMsg =
//         response.status === 429
//           ? "Too many requests. Please wait a moment and try again."
//           : `Error ${response.status}: ${response.statusText}`;
//       throw new Error(errorMsg);
//     }

//     const data = await response.json();

//     if (!data || !data.data) {
//       throw new Error("Invalid data structure from API");
//     }

//     return data.data;
//   } catch (error) {
//     throw new Error(error.message || "Failed to fetch anime");
//   }
// };

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
  
      if (!data || !data.data) {
        throw new Error("Invalid data structure from API");
      }
  
      return data.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch data");
    }
  };
  

  export const fetchAnime = async (query = "", limit = 20) => {
    const searchParam = query.trim()
      ? `?q=${encodeURIComponent(query)}&limit=${limit}`
      : `?limit=${limit}`;
    return fetchFromAPI("https://api.jikan.moe/v4/anime", searchParam);
  };

export const fetchAnimeMoreInfo = async (id) => {
  if (!id) throw new Error("Anime ID is required");
  
  try {
    // Try the moreinfo endpoint
    const response = await fetch(`${API_BASE_URL}/${id}/full`, API_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the data object which should contain the 'moreinfo' field
    if (data && data.data) {
      return data.data;
    } else {
      throw new Error("Invalid data structure from API");
    }
  } catch (error) {
    console.error("Error fetching anime more info:", error);
    
    // If the moreinfo endpoint fails, we can return a placeholder
    
    return { synopsis: "No additional information available." };
  }
};