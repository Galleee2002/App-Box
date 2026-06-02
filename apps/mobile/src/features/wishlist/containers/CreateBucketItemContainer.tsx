import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Button } from "@/src/presentation/ui/Button";
import { SuccessFeedbackOverlay } from "@/src/presentation/ui/SuccessFeedbackOverlay";
import { TextField } from "@/src/presentation/ui/TextField";
import { CategoryPicker } from "../components/CategoryPicker";
import type { BucketCategory } from "../domain/bucketItem";
import { validateCreateBucketItemInput } from "../domain/bucketItem";
import type { CreateBucketItemValidationErrors } from "../domain/bucketItem";
import { sqliteBucketItemRepository } from "../data/sqliteBucketItemRepository";

export function CreateBucketItemContainer() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<BucketCategory | null>(null);
  const [errors, setErrors] = useState<CreateBucketItemValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccessComplete = useCallback(() => {
    setShowSuccess(false);
    router.back();
  }, [router]);

  const handleSave = async () => {
    const validation = validateCreateBucketItemInput({ title, description, category });
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      await sqliteBucketItemRepository.create({
        title: title.trim(),
        description: description.trim(),
        category: category!,
      });
      setShowSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar el plan.";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
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
          placeholder="¿Qué queréis hacer?"
        />
        <TextField
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          error={errors.description}
          multiline
          placeholder="Contad los detalles del plan..."
        />
        <CategoryPicker value={category} onChange={setCategory} error={errors.category} />
        <Button
          label={saving ? "Guardando..." : "Guardar plan"}
          onPress={handleSave}
          disabled={saving || showSuccess}
        />
      </ScrollView>

      <SuccessFeedbackOverlay
        visible={showSuccess}
        title="Plan guardado"
        message="Vuestro plan se añadió al bucket."
        onComplete={handleSuccessComplete}
      />
    </>
  );
}
