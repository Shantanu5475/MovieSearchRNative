import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { fetchMovies } from "../utils/api";
import MovieCard from "../components/MovieCard";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={resetHomeScreen}>
          <Text style={styles.headerTitle}>MovieZone</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#1e272e",
      },
      headerLeft: () => <View style={{ marginLeft: 15 }} />,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
          <FontAwesome
            name="heart"
            size={24}
            color="#ff4757"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const resetHomeScreen = () => {
    setSearchQuery("");
    setMovies([]);
    setSearchActive(false);
  };

  const searchMovies = async (query, pageNumber = 1) => {
    if (!query) return;
    setLoading(true);
    const results = await fetchMovies(query, pageNumber);

    // Ensure we only append 5 movies at a time
    const limitedResults = results.slice(0, 3);

    setMovies(
      pageNumber === 1 ? limitedResults : [...movies, ...limitedResults]
    );
    setPage(pageNumber);
    setLoading(false);
    setSearchActive(true);
  };

  const loadMoreMovies = () => {
    searchMovies(searchQuery, page + 1);
  };

  return (
    <View style={styles.container}>
      {/* Centered Search Bar and Catchphrase */}
      {!searchActive && (
        <View style={styles.centerContainer}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search for a movie..."
              placeholderTextColor="#888"
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              onSubmitEditing={() => searchMovies(searchQuery)}
            />
            <TouchableOpacity
              style={styles.searchIcon}
              onPress={() => searchMovies(searchQuery)}
            >
              <FontAwesome name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.catchphrase}>
            🎬 Your next favorite movie awaits! 🍿
          </Text>
        </View>
      )}

      {/* Movie List Appears Below the Search Bar */}
      {searchActive && (
        <>
          {/* Search Bar Fixed at the Top */}
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search for a movie..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => searchMovies(searchQuery)}
            />
            <TouchableOpacity
              style={styles.searchIcon}
              onPress={() => searchMovies(searchQuery)}
            >
              <FontAwesome name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            contentContainerStyle={styles.listContainer}
            data={movies}
            keyExtractor={(item) => item.imdbID}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                onPress={() =>
                  navigation.navigate("MovieDetails", { movieId: item.imdbID })
                }
              />
            )}
            ListFooterComponent={
              <View style={styles.footer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#ff4757" />
                ) : (
                  <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={loadMoreMovies}
                  >
                    <Text style={styles.loadMoreText}>Load More</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e272e",
    alignItems: "center",
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4757",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#485460",
    borderRadius: 25,
    paddingHorizontal: 15,
    width: "90%",
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  searchBar: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    padding: 10,
  },
  catchphrase: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#f5f6fa",
    marginTop: 20,
    letterSpacing: 1,
  },
  listContainer: {
    width: "100%",
    paddingBottom: 20,
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  loadMoreButton: {
    backgroundColor: "#ff4757",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
