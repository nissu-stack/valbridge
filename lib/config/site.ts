const configuredSiteUrl = process.env.SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
const normalizedSiteUrl = configuredSiteUrl
  ? configuredSiteUrl.startsWith("http") ? configuredSiteUrl : `https://${configuredSiteUrl}`
  : "http://localhost:3000";

export const SITE_URL = normalizedSiteUrl.replace(/\/$/, "");
export const SITE_NAME = process.env.SITE_NAME ?? "Maison Valbridge";
export const SITE_DESCRIPTION = "In der Schweiz kuratierte frische Trüffel, Safran, Olivenöle und Feinkost für Privatkunden und Gastronomieprofis weltweit.";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
