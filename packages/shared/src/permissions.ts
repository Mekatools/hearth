/**
 * Permission bit flags for channels and servers.
 * These are evaluated server-side in the Worker.
 */
export const Permissions = {
  VIEW_CHANNEL:        1n << 0n,  // 1
  SEND_MESSAGES:       1n << 1n,  // 2
  EMBED_LINKS:         1n << 2n,  // 4
  ATTACH_FILES:        1n << 3n,  // 8
  ADD_REACTIONS:       1n << 4n,  // 16
  MENTION_EVERYONE:    1n << 5n,  // 32
  MANAGE_MESSAGES:     1n << 6n,  // 64 (delete/pin messages)
  MANAGE_CHANNELS:     1n << 7n,  // 128
  MANAGE_ROLES:        1n << 8n,  // 256
  KICK_MEMBERS:        1n << 9n,  // 512
  BAN_MEMBERS:         1n << 10n, // 1024
  ADMINISTRATOR:       1n << 11n, // 2048 (bypasses all checks)
} as const;

export type PermissionKey = keyof typeof Permissions;

/**
 * Check if a permission set contains a specific permission or Administrator.
 */
export function hasPermission(userPerms: bigint, required: bigint): boolean {
  if ((userPerms & Permissions.ADMINISTRATOR) === Permissions.ADMINISTRATOR) {
    return true;
  }
  return (userPerms & required) === required;
}
