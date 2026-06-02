import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { Button } from "@/src/presentation/ui/Button";
import { getDatabaseBootstrapStatus, initializeDatabase } from "@/src/core/database";
import { getThemeTokens } from "@/src/core/theme";
import { useThemeStore } from "@/src/core/theme/store";
import { syncCapsulesWithNeon } from "@/src/core/sync/capsuleSyncService";
import { ScreenDeleteButton } from "@/src/presentation/navigation/ScreenBackTitle";
import type { Capsule } from "../domain/capsule";
import { LockedCapsuleDetail } from "../components/LockedCapsuleDetail";
import { UnlockedCapsuleDetail } from "../components/UnlockedCapsuleDetail";
import { useUnlockCountdown } from "../components/useUnlockCountdown";
import { sqliteCapsuleRepository } from "../data/sqliteCapsuleRepository";

export function CapsuleDetailContainer() {
  const navigation = useNavigation();
  const router = useRouter();
  const mode = useThemeStore((state) => state.mode);
  const theme = getThemeTokens(mode);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = useCallback(() => {
    if (!id || typeof id !== "string" || deleting) {
      return;
    }

    Alert.alert("Eliminar cápsula", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          void (async () => {
            setDeleting(true);
            try {
              await sqliteCapsuleRepository.delete(id);
              void syncCapsulesWithNeon();
              router.back();
            } catch (err) {
              const message = err instanceof Error ? err.message : "No se pudo eliminar la cápsula.";
              Alert.alert("Error", message);
            } finally {
              setDeleting(false);
            }
          })();
        },
      },
    ]);
  }, [deleting, id, router]);

  useEffect(() => {
    if (capsule) {
      navigation.setOptions({
        title: capsule.title,
        headerRight: () => (
          <ScreenDeleteButton
            onDelete={handleDelete}
            tintColor={theme.colors.danger}
            disabled={deleting}
          />
        ),
      });
    }
  }, [capsule, deleting, handleDelete, navigation, theme.colors.danger]);

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

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <CapsuleDetailContent capsule={capsule} />
    </View>
  );
}

function CapsuleDetailContent({ capsule }: { capsule: Capsule }) {
  const { isLocked, countdownLabel, countdownA11y, formattedDate } = useUnlockCountdown(capsule.unlockAt, {
    dateStyle: "full",
  });

  if (isLocked) {
    return (
      <LockedCapsuleDetail
        title={capsule.title}
        countdownLabel={countdownLabel}
        countdownA11y={countdownA11y}
        formattedDate={formattedDate}
      />
    );
  }

  return <UnlockedCapsuleDetail title={capsule.title} body={capsule.body} />;
}
