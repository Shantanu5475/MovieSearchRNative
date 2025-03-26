import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width; // Get screen width

export default function MovieCard({ movie, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Movie Poster on the Left */}
      <Image source={{ uri: movie.Poster }} style={styles.poster} />

      {/* Movie Details on the Right */}
      <View style={styles.details}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.year}>📅 {movie.Year}</Text>
        {/* <Text style={styles.type}>🎥 {movie.Type.toUpperCase()}</Text> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#485460",
    width: SCREEN_WIDTH * 0.6,
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f5f6fa",
    marginBottom: 5,
  },
  year: {
    fontSize: 14,
    color: "#dcdde1",
    marginBottom: 3,
  },
  type: {
    fontSize: 14,
    color: "#ff4757",
    fontWeight: "bold",
  },
});
