import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function VideoPlayerScreen({ route }: any) {
  const { videoUrl } = route.params;

  return (
    <View style={{ flex: 1 }}>
      {/* Replace the URL with your movie's URL */}
      <WebView source={{ uri: videoUrl }} />
    </View>
  );
}
