import { Redirect } from 'expo-router';

export default function Index() {
  // Immediately redirect to the splash screen route
  return <Redirect href="/splash" />;
}
