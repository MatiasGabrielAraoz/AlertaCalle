/* ==========================================================================
   AlertaCalle — app.js
   Configuración del tema de Tailwind (design tokens del proyecto).
   Se ejecuta después del script de Tailwind CDN cargado en el <head>.
   ========================================================================== */

tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#ffffff",
        "on-primary-fixed-variant": "#930006",
        "outline": "#936e69",
        "inverse-surface": "#2f3131",
        "on-tertiary-fixed": "#410001",
        "on-tertiary-fixed-variant": "#930003",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "surface-bright": "#f9f9f9",
        "primary-container": "#e61919",
        "primary-fixed-dim": "#ffb4aa",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed": "#1b1b20",
        "inverse-primary": "#ffb4aa",
        "on-secondary-container": "#65636a",
        "on-primary": "#ffffff",
        "on-error": "#ffffff",
        "outline-variant": "#e8bcb6",
        "on-error-container": "#93000a",
        "surface-dim": "#dadada",
        "on-secondary": "#ffffff",
        "on-surface-variant": "#5e3f3b",
        "on-secondary-fixed-variant": "#47464c",
        "tertiary-container": "#e3221a",
        "surface-variant": "#e2e2e2",
        "on-primary-container": "#fffbff",
        "surface-tint": "#c0000b",
        "surface-container-low": "#f3f3f4",
        "background": "#f9f9f9",
        "tertiary": "#bb0006",
        "secondary-fixed-dim": "#c8c5cc",
        "secondary-fixed": "#e4e1e9",
        "tertiary-fixed": "#ffdad5",
        "on-surface": "#1a1c1c",
        "secondary": "#5f5e64",
        "inverse-on-surface": "#f0f1f1",
        "on-background": "#1a1c1c",
        "secondary-container": "#e4e1e9",
        "primary-fixed": "#ffdad5",
        "on-tertiary-container": "#fffbff",
        "error": "#ba1a1a",
        "surface-container": "#eeeeee",
        "on-primary-fixed": "#410001",
        "tertiary-fixed-dim": "#ffb4a9",
        "primary": "#bc000a",
        "surface": "#f9f9f9",
        "error-container": "#ffdad6"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px"
      },
      spacing: {
        "margin-mobile": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "gutter-sm": "1rem",
        "space-xs": "0.25rem",
        "gutter": "1.5rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "margin": "3rem"
      },
      fontFamily: {
        "label-caps": ["Plus Jakarta Sans"],
        "display-hero": ["Plus Jakarta Sans"],
        "headline-md": ["Plus Jakarta Sans"],
        "headline-lg-mobile": ["Plus Jakarta Sans"],
        "display-hero-mobile": ["Plus Jakarta Sans"],
        "body-md": ["Plus Jakarta Sans"],
        "headline-sm": ["Plus Jakarta Sans"],
        "headline-lg": ["Plus Jakarta Sans"],
        "label-code": ["JetBrains Mono"],
        "body-lg": ["Plus Jakarta Sans"],
        "body-sm": ["Plus Jakarta Sans"]
      },
      fontSize: {
        "label-caps": ["11px", { lineHeight: "14px", letterSpacing: "0.12em", fontWeight: "800" }],
        "display-hero": ["72px", { lineHeight: "76px", letterSpacing: "-0.04em", fontWeight: "800" }],
        "headline-md": ["28px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["32px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-hero-mobile": ["40px", { lineHeight: "44px", letterSpacing: "-0.03em", fontWeight: "800" }],
        "body-md": ["15px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "400" }],
        "headline-sm": ["20px", { lineHeight: "26px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg": ["48px", { lineHeight: "52px", letterSpacing: "-0.03em", fontWeight: "800" }],
        "label-code": ["12px", { lineHeight: "16px", letterSpacing: "0.06em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "body-sm": ["13px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }]
      }
    }
  }
};
