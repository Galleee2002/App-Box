export type ThemeMode = "light" | "dark";

export type ThemeTokens = {
  colors: {
    background: string;
    surface: string;
    surfaceMuted: string;
    borderSubtle: string;
    borderStrong: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    accent: string;
    accentHover: string;
    accentActive: string;
    accentGhost: string;
    accentGhostHover: string;
    accentText: string;
    success: string;
    warning: string;
    danger: string;
    focusRing: string;
    overlay: string;
  };
  radius: {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  spacing: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
    "3xl": number;
    "4xl": number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      "2xl": number;
    };
    lineHeight: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      "2xl": number;
    };
    fontWeight: {
      regular: "400";
      medium: "500";
      semibold: "600";
      bold: "700";
    };
  };
  motion: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      standard: string;
      emphasize: string;
      decelerate: string;
    };
  };
  elevation: {
    level0: number;
    level1: number;
    level2: number;
    level3: number;
  };
  opacity: {
    disabled: number;
    muted: number;
    overlay: number;
  };
  zIndex: {
    base: number;
    dropdown: number;
    sticky: number;
    modal: number;
    toast: number;
  };
};

export const themeTokens: Record<ThemeMode, ThemeTokens> = {
  light: {
    colors: {
      background: "#FCFBF8",
      surface: "#FFFFFF",
      surfaceMuted: "#F7F4EE",
      borderSubtle: "#E8E2D9",
      borderStrong: "#D5CBBE",
      textPrimary: "#1F2937",
      textSecondary: "#4B5563",
      textTertiary: "#6B7280",
      accent: "#0EA5E9",
      accentHover: "#0284C7",
      accentActive: "#0369A1",
      accentGhost: "#E0F2FE",
      accentGhostHover: "#BAE6FD",
      accentText: "#FFFFFF",
      success: "#16A34A",
      warning: "#D97706",
      danger: "#DC2626",
      focusRing: "#38BDF8",
      overlay: "rgba(15, 23, 42, 0.32)",
    },
    radius: {
      none: 0,
      xs: 6,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      pill: 999,
    },
    spacing: {
      xxs: 2,
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      "2xl": 32,
      "3xl": 40,
      "4xl": 48,
    },
    typography: {
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
      },
      lineHeight: {
        xs: 16,
        sm: 20,
        base: 24,
        lg: 26,
        xl: 28,
        "2xl": 32,
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
    },
    motion: {
      duration: {
        fast: 120,
        normal: 200,
        slow: 320,
      },
      easing: {
        standard: "ease-in-out",
        emphasize: "ease-out",
        decelerate: "ease-in",
      },
    },
    elevation: {
      level0: 0,
      level1: 2,
      level2: 6,
      level3: 12,
    },
    opacity: {
      disabled: 0.45,
      muted: 0.72,
      overlay: 0.32,
    },
    zIndex: {
      base: 0,
      dropdown: 10,
      sticky: 20,
      modal: 40,
      toast: 50,
    },
  },
  dark: {
    colors: {
      background: "#0B1220",
      surface: "#111827",
      surfaceMuted: "#1F2937",
      borderSubtle: "#334155",
      borderStrong: "#475569",
      textPrimary: "#F8FAFC",
      textSecondary: "#CBD5E1",
      textTertiary: "#94A3B8",
      accent: "#38BDF8",
      accentHover: "#0EA5E9",
      accentActive: "#0284C7",
      accentGhost: "#0C4A6E",
      accentGhostHover: "#075985",
      accentText: "#FFFFFF",
      success: "#22C55E",
      warning: "#F59E0B",
      danger: "#F87171",
      focusRing: "#38BDF8",
      overlay: "rgba(2, 6, 23, 0.56)",
    },
    radius: {
      none: 0,
      xs: 6,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      pill: 999,
    },
    spacing: {
      xxs: 2,
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      "2xl": 32,
      "3xl": 40,
      "4xl": 48,
    },
    typography: {
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
      },
      lineHeight: {
        xs: 16,
        sm: 20,
        base: 24,
        lg: 26,
        xl: 28,
        "2xl": 32,
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
    },
    motion: {
      duration: {
        fast: 120,
        normal: 200,
        slow: 320,
      },
      easing: {
        standard: "ease-in-out",
        emphasize: "ease-out",
        decelerate: "ease-in",
      },
    },
    elevation: {
      level0: 0,
      level1: 2,
      level2: 6,
      level3: 12,
    },
    opacity: {
      disabled: 0.45,
      muted: 0.72,
      overlay: 0.56,
    },
    zIndex: {
      base: 0,
      dropdown: 10,
      sticky: 20,
      modal: 40,
      toast: 50,
    },
  },
};

export const getThemeTokens = (mode: ThemeMode) => themeTokens[mode];

export const themePrimitives = {
  spacing: themeTokens.light.spacing,
  radius: themeTokens.light.radius,
  typography: themeTokens.light.typography,
  motion: themeTokens.light.motion,
  elevation: themeTokens.light.elevation,
  opacity: themeTokens.light.opacity,
  zIndex: themeTokens.light.zIndex,
};

export type SemanticColorToken = keyof ThemeTokens["colors"];

export const resolveSemanticColor = (mode: ThemeMode, token: SemanticColorToken) =>
  themeTokens[mode].colors[token];

export const uiTheme = getThemeTokens("dark");
