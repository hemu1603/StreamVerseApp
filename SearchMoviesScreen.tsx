import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GET_SEARCHED_MOVIES } from "./lib/queryAndMotations";
import { useLazyQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "./App";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage to store recent searches

type SearchMoviesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Search"
>;

const screenWidth = Dimensions.get("window").width;

export default function SearchMoviesScreen() {
  const navigation = useNavigation<SearchMoviesScreenNavigationProp>();

  // State for search input and recent searches
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Lazy query to fetch movies based on the search query
  const [fetchMovies, { loading, error, data }] =
    useLazyQuery(GET_SEARCHED_MOVIES);

  // Fetch recent searches from AsyncStorage on component mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Save the search query to recent searches
  const saveSearchQuery = async (query: string) => {
    let updatedSearches = [query, ...recentSearches];
    updatedSearches = [...new Set(updatedSearches)]; // Remove duplicates
    updatedSearches = updatedSearches.slice(0, 10); // Keep only the 5 most recent searches

    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedSearches)
    );
  };

  // Load recent searches from AsyncStorage
  const loadRecentSearches = async () => {
    const storedSearches = await AsyncStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  };

  // Handler for the search button
  const handleSearch = (query?: string) => {
    const finalQuery = query || searchQuery;
    if (finalQuery) {
      fetchMovies({ variables: { searchQuery: finalQuery } });
      saveSearchQuery(finalQuery); // Save the search query
    }
  };

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error)
    return <Text style={styles.errorText}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      {/* Search Input and Icon Button in a row */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleSearch()}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Recent Search Suggestions */}
      {recentSearches.length > 0 && (
        <ScrollView
          style={styles.suggestionsContainer}
          horizontal
          showsHorizontalScrollIndicator={true}
        >
          {recentSearches.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleSearch(item)}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Movie List */}
      <FlatList
        data={data?.getSearchedMovies}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Player", { videoUrl: item.videoUrl })
            }
          >
            {item.thumbnail && (
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
              />
            )}
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  iconButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  suggestionsContainer: {
    marginBottom: 25,
    flexDirection: "row",
    minHeight: 50,
    maxHeight: 50,
  },
  suggestionItem: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  thumbnail: {
    width: screenWidth - 32,
    height: 200,
    resizeMode: "cover",
  },
  movieInfo: {
    padding: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
