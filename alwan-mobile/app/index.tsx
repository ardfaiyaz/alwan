import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  // If we have a session, go straight to tabs
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise, start the onboarding/splash flow
  return <Redirect href="/splash" />;
}
