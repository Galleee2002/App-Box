import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Pantalla no encontrada" }} />
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-background-dark">
        <Text className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">Ruta inexistente</Text>
        <Link href="/" className="mt-4">
          <Text className="text-base text-accent dark:text-accent-dark">Volver al inicio</Text>
        </Link>
      </View>
    </>
  );
}
