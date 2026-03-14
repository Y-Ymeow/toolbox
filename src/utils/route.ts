import { useEffect, useState } from "preact/hooks";
import type { ToolKey } from "../tools/types";

export const mapHashToRoute = (hash: string): ToolKey => {
  if (!hash || hash === "#" || hash === "#/") return "home";
  if (hash.startsWith("#/calc")) return "calc";
  if (hash.startsWith("#/weather")) return "weather";
  if (hash.startsWith("#/fx")) return "fx";
  if (hash.startsWith("#/news")) return "news";
  if (hash.startsWith("#/timer")) return "timer";
  if (hash.startsWith("#/notes")) return "notes";
  if (hash.startsWith("#/rss")) return "rss";
  if (hash.startsWith("#/request")) return "request";
  return "home";
};

export function useHashRoute() {
  const [route, setRoute] = useState<ToolKey>(() => mapHashToRoute(window.location.hash));

  useEffect(() => {
    const handler = () => setRoute(mapHashToRoute(window.location.hash));
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return route;
}
