import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button } from "@/src/presentation/ui/Button";
import { getDatabaseBootstrapStatus, initializeDatabase } from "@/src/core/database";
import type { Capsule } from "../domain/capsule";
import { isCapsuleLocked } from "../domain/capsule";
import { LockedCapsuleDetail } from "../components/LockedCapsuleDetail";
import { UnlockedCapsuleDetail } from "../components/UnlockedCapsuleDetail";
import { sqliteCapsuleRepository } from "../data/sqliteCapsuleRepository";

export function CapsuleDetailContainer() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const result = await sqliteCapsuleRepository.getById(id);
      if (!result) {
        setNotFound(true);
        setCapsule(null);
      } else {
        setCapsule(result);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo cargar la cápsula.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (capsule) {
      navigation.setOptions({ title: capsule.title });
    }
  }, [capsule, navigation]);

  if (loading) {
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
          <Button label="Reintentar" onPress={() => void load()} />
        </View>
      </View>
    );
  }

  if (notFound || !capsule) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-background-dark">
        <Text className="text-center text-base text-text-secondary dark:text-text-secondary-dark">
          No encontramos esta cápsula.
        </Text>
      </View>
    );
  }

  const locked = isCapsuleLocked(capsule.unlockAt);

  if (locked) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <LockedCapsuleDetail title={capsule.title} unlockAt={capsule.unlockAt} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <UnlockedCapsuleDetail title={capsule.title} body={capsule.body} />
    </View>
  );
}
