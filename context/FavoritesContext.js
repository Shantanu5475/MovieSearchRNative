import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favoriteMovies";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from AsyncStorage when the app starts
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
        setFavorites(jsonValue ? JSON.parse(jsonValue) : []);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };
    loadFavorites();
  }, []);

  // Function to add a favorite movie
  const addFavorite = async (movie) => {
    try {
      const newFavorites = [...favorites, movie];
      setFavorites(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  // Function to remove a favorite movie
  const removeFavorite = async (movieId) => {
    try {
      const newFavorites = favorites.filter(
        (movie) => movie.imdbID !== movieId
      );
      setFavorites(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use favorites
export const useFavorites = () => useContext(FavoritesContext);
