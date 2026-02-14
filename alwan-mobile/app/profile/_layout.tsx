import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit" />
      <Stack.Screen name="security" />
      <Stack.Screen name="change-pin" />
      <Stack.Screen name="fingerprint" />
      <Stack.Screen name="terms" />
    </Stack>
  );
}
