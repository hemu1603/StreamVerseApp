import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import MoviesScreen from "./MoviesScreen";
import ProfileScreen from "./ProfileScreen";
import VideoPlayerScreen from "./VideoPlayerScreen";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import SearchMoviesScreen from "./SearchMoviesScreen";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "https://ott-admin-app-new.vercel.app/api/graphql",
  cache: new InMemoryCache(),
});

export type RootStackParamList = {
  Home: undefined;
  StreamVerse: undefined;
  Profile: undefined;
  Player: { videoUrl: string };
  Search: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Videos() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="StreamVerse" component={MoviesScreen} />
      <Stack.Screen name="Player" component={VideoPlayerScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home"; // Home icon
              } else if (route.name === "Videos") {
                iconName = "film"; // Movie icon
              } else if (route.name === "Profile") {
                iconName = "person"; // Profile icon
              } else if (route.name === "Search") {
                iconName = "search"; // Profile icon
              }

              // You can return any component that you like here!
              return (
                <Ionicons
                  name={iconName as keyof typeof Ionicons.glyphMap}
                  size={size}
                  color={color}
                />
              );
            },
            tabBarActiveTintColor: "tomato", // Active tab color
            tabBarInactiveTintColor: "gray", // Inactive tab color
          })}
        >
          {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
          <Tab.Screen
            name="Videos"
            component={Videos}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Search" component={SearchMoviesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
