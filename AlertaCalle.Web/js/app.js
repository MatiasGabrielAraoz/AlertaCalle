/* ==========================================================================
   AlertaCalle — app.js
   Configuración del tema de Tailwind. Los VALORES de los colores viven en
   css/styles.css (variables --c-*), uno para modo claro y otro para oscuro.
   ========================================================================== */

// Nombres de los colores del proyecto. Cada uno apunta a una variable CSS
// con canales RGB, así siguen funcionando los modificadores tipo bg-primary/5.
const NOMBRES_COLORES = [
  "surface-container-lowest", "on-primary-fixed-variant", "outline", "inverse-surface",
  "on-tertiary-fixed", "on-tertiary-fixed-variant", "surface-container-high",
  "surface-container-highest", "surface-bright", "primary-container", "primary-fixed-dim",
  "on-tertiary", "on-secondary-fixed", "inverse-primary", "on-secondary-container",
  "on-primary", "on-error", "outline-variant", "on-error-container", "surface-dim",
  "on-secondary", "on-surface-variant", "on-secondary-fixed-variant", "tertiary-container",
  "surface-variant", "on-primary-container", "surface-tint", "surface-container-low",
  "background", "tertiary", "secondary-fixed-dim", "secondary-fixed", "tertiary-fixed",
  "on-surface", "secondary", "inverse-on-surface", "on-background", "secondary-container",
  "primary-fixed", "on-tertiary-container", "error", "surface-container", "on-primary-fixed",
  "tertiary-fixed-dim", "primary", "surface", "error-container"
];

const coloresTema = {};
NOMBRES_COLORES.forEach(function (n) {
  coloresTema[n] = "rgb(var(--c-" + n + ") / <alpha-value>)";
});

tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: coloresTema,
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