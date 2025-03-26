import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getFavorites, removeFavorite } from "../utils/storage";
import MovieCard from "../components/MovieCard";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // Reload favorites when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchFavorites = async () => {
        const storedFavorites = await getFavorites();
        setFavorites(storedFavorites);
      };
      fetchFavorites();
    }, [])
  );

  // Remove movie from favorites
  const handleRemoveFavorite = async (movieId) => {
    await removeFavorite(movieId);
    setFavorites((prevFavorites) =>
      prevFavorites.filter((movie) => movie.imdbID !== movieId)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❤️ Favorite Movies</Text>

      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>
          No favorites yet. Start adding some!
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <View style={styles.movieContainer}>
              {/* Movie Card */}
              <MovieCard
                movie={item}
                onPress={() =>
                  navigation.navigate("MovieDetails", { movieId: item.imdbID })
                }
              />

              {/* Remove Button */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFavorite(item.imdbID)}
              >
                <FontAwesome name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e272e",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4757",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyText: {
    color: "#f5f6fa",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  movieContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2f3640",
    paddingHorizontal: 8,

    borderRadius: 8,
    marginVertical: 8,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4757",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "bold",
  },
});
