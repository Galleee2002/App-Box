import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { Button } from "@/src/presentation/ui/Button";
import { TextField } from "@/src/presentation/ui/TextField";
import { validateCreateCapsuleInput } from "../domain/capsule";
import type { CreateCapsuleValidationErrors } from "../domain/capsule";
import { syncCapsulesWithNeon } from "@/src/core/sync/capsuleSyncService";
import { sqliteCapsuleRepository } from "../data/sqliteCapsuleRepository";

export function CreateCapsuleContainer() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [unlockAt, setUnlockAt] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1, 0, 0, 0);
    return date;
  });
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");
  const [errors, setErrors] = useState<CreateCapsuleValidationErrors>({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const validation = validateCreateCapsuleInput({ title, body, unlockAt });
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      await sqliteCapsuleRepository.create({
        title: title.trim(),
        body: body.trim(),
        unlockAt,
      });
      void syncCapsulesWithNeon();
      Alert.alert("Cápsula guardada", "Tu mensaje se guardó correctamente.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar la cápsula.";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  };

  const onPickerChange = (_event: unknown, selected?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selected) {
      setUnlockAt(selected);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="px-6 py-6"
      keyboardShouldPersistTaps="handled"
    >
      <TextField
        label="Título"
        value={title}
        onChangeText={setTitle}
        error={errors.title}
        placeholder="Un título breve"
      />
      <TextField
        label="Mensaje"
        value={body}
        onChangeText={setBody}
        error={errors.body}
        multiline
        placeholder="Escribe lo que quieras decir..."
      />

      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
          Fecha y hora de desbloqueo
        </Text>
        {Platform.OS === "android" ? (
          <Button
            label={unlockAt.toLocaleString()}
            variant="secondary"
            onPress={() => setShowPicker(true)}
          />
        ) : null}
        {showPicker ? (
          <DateTimePicker value={unlockAt} mode="datetime" onChange={onPickerChange} />
        ) : null}
        {errors.unlockAt ? (
          <Text className="mt-1 text-sm text-danger dark:text-danger-dark">{errors.unlockAt}</Text>
        ) : null}
      </View>

      <Button label={saving ? "Guardando..." : "Guardar cápsula"} onPress={handleSave} disabled={saving} />
    </ScrollView>
  );
}
