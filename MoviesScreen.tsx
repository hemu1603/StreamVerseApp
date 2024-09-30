import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GET_ALL_MOVIES } from "./lib/queryAndMotations";
import { useQuery } from "@apollo/client";
import { RootStackParamList } from "./App";

type MoviesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'StreamVerse'>;

const screenWidth = Dimensions.get('window').width;

export default function MoviesScreen() {
  const navigation = useNavigation<MoviesScreenNavigationProp>();

  // State for selected genre
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // GraphQL query with genre filter
  const { loading, error, data, refetch } = useQuery(GET_ALL_MOVIES, {
    variables: selectedGenre ? { category: selectedGenre } : {}, // Pass genre to the query
  });

  // Handler to select a genre
  const handleGenreChange = (category: string | null) => {
    setSelectedGenre(category);
    refetch({ category }); // Refetch data with the new genre filter
  };

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      {/* Header with filter buttons */}
      <View style={styles.header}>
        <Pressable onPress={() => handleGenreChange(null)} style={[styles.filterButton, !selectedGenre && styles.activeFilter]}>
          <Text style={styles.filterButtonText}>All</Text>
        </Pressable>
        <Pressable onPress={() => handleGenreChange("Action")} style={[styles.filterButton, selectedGenre === 'Action' && styles.activeFilter]}>
          <Text style={styles.filterButtonText}>Action</Text>
        </Pressable>
        <Pressable onPress={() => handleGenreChange("Sci Fi")} style={[styles.filterButton, selectedGenre === 'Sci Fi' && styles.activeFilter]}>
          <Text style={styles.filterButtonText}>Sci Fi</Text>
        </Pressable>
      </View>

      {/* Movie List */}
      <FlatList
        data={data?.getAllMovies}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Player', { videoUrl: item.videoUrl })}
          >
            {item.thumbnail && (
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            )}
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              {/* <Text style={styles.movieDescription}>{item.description}</Text> */}
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
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  thumbnail: {
    width: screenWidth - 32,
    height: 200,
    resizeMode: 'cover',
  },
  movieInfo: {
    padding: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  movieDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
});
