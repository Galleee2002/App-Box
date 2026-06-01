import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Button } from "@/src/presentation/ui/Button";
import {
  getDatabaseBootstrapError,
  getDatabaseBootstrapStatus,
  initializeDatabase,
} from "@/src/core/database";
import { isCapsuleLocked } from "../domain/capsule";
import { CapsuleEmptyState } from "../components/CapsuleEmptyState";
import { CapsuleListItem } from "../components/CapsuleListItem";
import { useCapsuleStore } from "../store/capsuleStore";

export function CapsuleListContainer() {
  const router = useRouter();
  const items = useCapsuleStore((state) => state.items);
  const loading = useCapsuleStore((state) => state.loading);
  const error = useCapsuleStore((state) => state.error);
  const loadCapsules = useCapsuleStore((state) => state.loadCapsules);
  const [dbReady, setDbReady] = useState(getDatabaseBootstrapStatus() === "ready");
  const bootstrapStatus = dbReady ? "ready" : getDatabaseBootstrapStatus();

  const refresh = useCallback(async () => {
    if (getDatabaseBootstrapStatus() !== "ready") {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch {
        setDbReady(false);
        return;
      }
    } else {
      setDbReady(true);
    }
    await loadCapsules();
  }, [loadCapsules]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleCreatePress = () => {
    router.push("/lovebox/create");
  };

  if (bootstrapStatus === "error") {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-background-dark">
        <Text className="text-center text-base text-danger dark:text-danger-dark">
          {getDatabaseBootstrapError() ?? "Error al inicializar la base de datos."}
        </Text>
        <View className="mt-4 w-full max-w-xs">
          <Button label="Reintentar" onPress={() => void initializeDatabase().then(() => refresh())} />
        </View>
      </View>
    );
  }

  if (bootstrapStatus !== "ready" || (loading && items.length === 0)) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-background-dark">
        <Text className="text-center text-base text-danger dark:text-danger-dark">{error}</Text>
        <View className="mt-4 w-full max-w-xs">
          <Button label="Reintentar" onPress={() => void refresh()} />
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <CapsuleEmptyState onCreatePress={handleCreatePress} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 px-4 py-4 pb-24"
        ListHeaderComponent={
          <View className="mb-2">
            <Button label="Nueva cápsula" onPress={handleCreatePress} />
          </View>
        }
        renderItem={({ item }) => (
          <CapsuleListItem
            title={item.title}
            isLocked={isCapsuleLocked(item.unlockAt)}
            unlockAt={item.unlockAt}
            onPress={() => router.push(`/lovebox/${item.id}`)}
          />
        )}
      />
    </View>
  );
}
