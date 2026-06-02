import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Button } from "@/src/presentation/ui/Button";
import {
  getDatabaseBootstrapError,
  getDatabaseBootstrapStatus,
  initializeDatabase,
} from "@/src/core/database";
import { getThemeTokens } from "@/src/core/theme";
import { useThemeStore } from "@/src/core/theme/store";
import { BucketEmptyState } from "../components/BucketEmptyState";
import { BucketListItem } from "../components/BucketListItem";
import type { BucketItem } from "../domain/bucketItem";
import { getBucketCategoryLabel, isBucketItemCompleted } from "../domain/bucketItem";
import { useBucketStore } from "../store/bucketStore";

export function BucketBoardContainer() {
  const router = useRouter();
  const mode = useThemeStore((state) => state.mode);
  const theme = getThemeTokens(mode);
  const items = useBucketStore((state) => state.items);
  const loading = useBucketStore((state) => state.loading);
  const error = useBucketStore((state) => state.error);
  const loadItems = useBucketStore((state) => state.loadItems);
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
    await loadItems();
  }, [loadItems]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleCreatePress = () => {
    router.push("/wishlist/create");
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
        <BucketEmptyState accentColor={theme.colors.accent} onCreatePress={handleCreatePress} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlatList<BucketItem>
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 px-4 py-4 pb-24"
        ListHeaderComponent={
          <View className="mb-2">
            <Button label="Nuevo plan" onPress={handleCreatePress} />
          </View>
        }
        renderItem={({ item }) => (
          <BucketListItem
            title={item.title}
            categoryLabel={getBucketCategoryLabel(item.category)}
            isCompleted={isBucketItemCompleted(item)}
            completedAt={item.completedAt}
            onPress={() => router.push(`/wishlist/${item.id}`)}
          />
        )}
      />
    </View>
  );
}
