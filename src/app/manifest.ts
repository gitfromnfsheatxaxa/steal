import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "STEAL",
    short_name: "STEAL",
    description: "No excuses. No hand-holding. Build something real.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    orientation: "portrait-primary",
    categories: ["fitness", "health", "lifestyle"],
    icons: [],
  };
}
