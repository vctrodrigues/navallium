import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: "#050814",
    surface: "#141a2b",
    "surface-bright": "#242a3b",
    "surface-light": "#242a3b",
    "surface-variant": "#040710",
    "on-surface-variant": "#242a3b",
    primary: "#003ad5",
    "primary-darken-1": "#001ac5",
    secondary: "#FFFFFF",
    "secondary-darken-1": "#EEEEEE",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
    },
  },
  defaults: {
    VBtn: {
      style: "text-transform: none; letter-spacing: 0;",
    },
  },
});
