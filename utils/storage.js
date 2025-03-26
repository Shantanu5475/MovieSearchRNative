import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favoriteMovies";

export const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error fetching favorites:", e);
    return [];
  }
};

export const addFavorite = async (movie) => {
  try {
    const favorites = await getFavorites();
    const newFavorites = [...favorites, movie];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (e) {
    console.error("Error adding favorite:", e);
  }
};

export const removeFavorite = async (movieId) => {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter((movie) => movie.imdbID !== movieId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (e) {
    console.error("Error removing favorite:", e);
  }
};
