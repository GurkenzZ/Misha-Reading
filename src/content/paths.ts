export const CONTENT_KEYS = {
  letters: "content:letters",
  bootstrapLevel: "content:levels/bootstrap"
} as const;

export function contentPath(relativePath: string): string {
  return withPublicPrefix("content", relativePath);
}

export function imageAssetPath(relativePath: string): string {
  return withPublicPrefix("assets/images", relativePath);
}

export function audioAssetPath(relativePath: string): string {
  return withPublicPrefix("assets/audio", relativePath);
}

function withPublicPrefix(basePath: string, relativePath: string): string {
  const cleanRelativePath = relativePath.replace(/^\/+/, "");

  return `/${basePath}/${cleanRelativePath}`;
}
