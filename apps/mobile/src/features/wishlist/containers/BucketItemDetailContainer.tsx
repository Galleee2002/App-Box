import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button } from "@/src/presentation/ui/Button";
import { SuccessFeedbackOverlay } from "@/src/presentation/ui/SuccessFeedbackOverlay";
import { getDatabaseBootstrapStatus, initializeDatabase } from "@/src/core/database";
import { BucketItemDetail } from "../components/BucketItemDetail";
import type { BucketItem } from "../domain/bucketItem";
import { getBucketCategoryLabel } from "../domain/bucketItem";
import { sqliteBucketItemRepository } from "../data/sqliteBucketItemRepository";

export function BucketItemDetailContainer() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<BucketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const load = useCallback(async () => {
    if (!id || typeof id !== "string") {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      if (getDatabaseBootstrapStatus() !== "ready") {
        await initializeDatabase();
      }
      const result = await sqliteBucketItemRepository.getById(id);
      if (!result) {
        setNotFound(true);
        setItem(null);
      } else {
        setItem(result);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo cargar el plan.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (item) {
      navigation.setOptions({ title: item.title });
    }
  }, [item, navigation]);

  const handleMarkComplete = async () => {
    if (!item || !id || typeof id !== "string") {
      return;
    }

    setCompleting(true);
    try {
      const wasPending = item.status === "pending";
      const updated = await sqliteBucketItemRepository.markCompleted(id);
      if (updated) {
        setItem(updated);
        if (wasPending && updated.status === "completed") {
          setShowCelebration(true);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo completar el plan.";
      setError(message);
    } finally {
      setCompleting(false);
    }
  };

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && !item) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-background-dark">
        <Text className="text-center text-base text-danger dark:text-danger-dark">{error}</Text>
        <View className="mt-4 w-full max-w-xs">
          <Button label="Reintentar" onPress={() => void load()} />
        </View>
      </View>
    );
  }

  if (notFound || !item) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-background-dark">
        <Text className="text-center text-base text-text-secondary dark:text-text-secondary-dark">
          No encontramos este plan.
        </Text>
      </View>
    );
  }

  return (
    <>
      <BucketItemDetail
        title={item.title}
        description={item.description}
        categoryLabel={getBucketCategoryLabel(item.category)}
        isCompleted={item.status === "completed"}
        completedAt={item.completedAt}
        onMarkComplete={() => void handleMarkComplete()}
        completing={completing}
      />
      <SuccessFeedbackOverlay
        visible={showCelebration}
        title="¡Plan completado!"
        message="Un hito más en vuestro bucket."
        onComplete={handleCelebrationComplete}
      />
    </>
  );
}
