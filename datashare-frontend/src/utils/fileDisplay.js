import api from "../services/api";

export function getDownloadUrl(token) {
  return `${api.defaults.baseURL}/files/download/${token}`;
}

export function getExpirationStatus(expiresAt) {
  if (!expiresAt) {
    return { isExpired: false, statusText: "Sans date d'expiration" };
  }

  const expires = new Date(expiresAt);
  const now = new Date();

  if (expires <= now) {
    return { isExpired: true, statusText: "Expiré" };
  }

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfExpiry = new Date(
    expires.getFullYear(),
    expires.getMonth(),
    expires.getDate(),
  );
  const diffDays = Math.round(
    (startOfExpiry - startOfToday) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return { isExpired: false, statusText: "Expire aujourd'hui" };
  }

  if (diffDays === 1) {
    return { isExpired: false, statusText: "Expire demain" };
  }

  return {
    isExpired: false,
    statusText: `Expire dans ${diffDays} jours`,
  };
}

export function getFileType(mimeType, fileName) {
  if (mimeType?.startsWith("image/")) {
    return "image";
  }

  if (mimeType?.startsWith("audio/")) {
    return "audio";
  }

  if (mimeType?.startsWith("video/")) {
    return "video";
  }

  const extension = fileName?.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
    return "image";
  }

  if (["mp3", "wav", "ogg", "m4a", "aac"].includes(extension)) {
    return "audio";
  }

  if (["mp4", "webm", "mov", "avi", "mkv"].includes(extension)) {
    return "video";
  }

  return "image";
}

export function filterFilesByTab(files, activeFilter) {
  if (activeFilter === "tous") {
    return files;
  }

  return files.filter((file) => {
    const { isExpired } = getExpirationStatus(file.expires_at);

    if (activeFilter === "actifs") {
      return !isExpired;
    }

    if (activeFilter === "expire") {
      return isExpired;
    }

    return true;
  });
}
