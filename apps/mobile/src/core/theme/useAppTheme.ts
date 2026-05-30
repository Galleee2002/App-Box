import { getThemeTokens, resolveSemanticColor, type SemanticColorToken } from "@/src/core/theme";
import { useThemeStore } from "@/src/core/theme/store";

export const useAppTheme = () => {
  const mode = useThemeStore((state) => state.mode);
  const tokens = getThemeTokens(mode);

  return {
    mode,
    tokens,
    color: (token: SemanticColorToken) => resolveSemanticColor(mode, token),
  };
};
