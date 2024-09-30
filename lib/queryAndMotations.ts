import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      _id
      name
      email
    }
  }
`;

export const GET_ALL_MOVIES = gql`
  query GetAllMovies($category: String) {
    getAllMovies(category: $category) {
      _id
      title
      description
      videoUrl
      thumbnail
      category
      uploadedDate
    }
  }
`;

export const GET_SEARCHED_MOVIES = gql`
  query GetSearchedMovies($searchQuery: String) {
    getSearchedMovies(searchQuery: $searchQuery) {
      _id
      title
      description
      videoUrl
      thumbnail
      category
      uploadedDate
    }
  }
`;