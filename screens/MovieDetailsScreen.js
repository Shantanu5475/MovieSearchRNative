import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { fetchMovieDetails } from "../utils/api";
import { addFavorite, removeFavorite, getFavorites } from "../utils/storage";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MovieDetailsScreen({ route, navigation }) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchMovieDetails(movieId).then(setMovie);
    getFavorites().then((favs) =>
      setIsFavorite(favs.some((m) => m.imdbID === movieId))
    );
    loadReviews();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkFavoriteStatus = async () => {
        const favs = await getFavorites();
        setIsFavorite(favs.some((m) => m.imdbID === movieId));
      };
      checkFavoriteStatus();
    }, [movieId])
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.appTitle}>MovieZone</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Favorites")}
          style={{ marginRight: 15 }}
        >
          <FontAwesome name="heart" size={24} color="#ff4757" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#1e272e",
      },
      headerTintColor: "#ff4757",
    });
  }, [navigation]);

  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFavorite(movieId);
    } else {
      await addFavorite(movie);
    }
    setIsFavorite(!isFavorite);
  };

  const loadReviews = async () => {
    const storedReviews = await AsyncStorage.getItem(`reviews_${movieId}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  };

  const submitReview = async () => {
    if (!review.trim() || rating === 0) return;
    const newReview = { text: review, rating, id: Date.now().toString() };
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    setReview("");
    setRating(0);
    await AsyncStorage.setItem(
      `reviews_${movieId}`,
      JSON.stringify(updatedReviews)
    );
  };

  if (!movie)
    return (
      <ActivityIndicator size="large" color="#ff4757" style={styles.loader} />
    );

  return (
    <View style={styles.container}>
      <Image source={{ uri: movie.Poster }} style={styles.poster} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>
          {movie.Title} ({movie.Year})
        </Text>
        <Text style={styles.genre}>{movie.Genre}</Text>
        <Text style={styles.plot}>{movie.Plot}</Text>
        <Text style={styles.rating}>⭐ {movie.imdbRating || "N/A"}</Text>
      </View>

      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <FontAwesome
          name={isFavorite ? "heart" : "heart-o"}
          size={24}
          color="#fff"
        />
        <Text style={styles.favoriteText}>
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Text>
      </TouchableOpacity>

      {/* Review Section */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e272e",
    padding: 15,
    alignItems: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff4757",
  },
  poster: {
    width: "100%",
    height: 300, // Reduced height
    borderRadius: 10,
    resizeMode: "cover",
  },
  detailsContainer: {
    alignItems: "center",
    marginTop: 15, // Reduced spacing
  },
  plot: {
    fontSize: 16, // Slightly larger font
    fontStyle: "italic", // Adds a stylish italic effect
    color: "#f5f6fa", // Light color for readability
    textAlign: "center",
    marginVertical: 8, // Increased spacing
    paddingHorizontal: 15, // Adds some padding for better structure
    lineHeight: 22, // Improves text spacing
    opacity: 0.9, // Slight transparency for a subtle effect
  },

  title: {
    fontSize: 20, // Slightly smaller title
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  genre: {
    fontSize: 16,
    color: "#dcdde1",
    marginVertical: 3,
  },
  rating: {
    fontSize: 16,
    color: "#f1c40f",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4757",
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 15,
    borderRadius: 25,
    marginTop: 15, // Reduced spacing
  },
  favoriteText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "bold",
  },
  reviewContainer: {
    marginTop: 20, // Reduced margin
    width: "100%",
    paddingHorizontal: 10,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f5f6fa",
    marginBottom: 8, // Reduced margin
  },
  reviewInput: {
    backgroundColor: "#485460",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8, // Reduced padding
    fontSize: 14,
    marginBottom: 8, // Reduced margin
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 8, // Reduced margin
  },
  star: {
    marginHorizontal: 4,
  },
  submitButton: {
    backgroundColor: "#ff4757",
    paddingVertical: 8, // Reduced padding
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  reviewItem: {
    marginTop: 8, // Reduced margin
    backgroundColor: "#485460",
    padding: 8,
    borderRadius: 10,
  },
});
