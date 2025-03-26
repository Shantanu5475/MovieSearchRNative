import axios from "axios";

const API_KEY = "c9357d43"; 

// Function to fetch movies based on search query and page number
export const fetchMovies = async (searchQuery, page = 1) => {
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?s=${searchQuery}&page=${page}&apikey=${API_KEY}`
    );
    return response.data.Response === "True" ? response.data.Search : [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

// Function to fetch movie details by IMDb ID
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`
    );
    return response.data.Response === "True" ? response.data : null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};
