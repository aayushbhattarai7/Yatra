// src/utils/generateUniqueId.ts
export function generateUniqueId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
