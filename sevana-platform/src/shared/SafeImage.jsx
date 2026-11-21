import { useState } from "react";
import { hasImageSource } from "./imageSource";

export default function SafeImage({ src, alt = "", className = "" }) {
  const [failedSource, setFailedSource] = useState(null);
  const normalizedSource = hasImageSource(src) ? src.trim() : "";

  if (!normalizedSource || failedSource === normalizedSource) {
    return (
      <div
        className={`safe-image-placeholder ${className}`.trim()}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        style={{ backgroundColor: "var(--color-border, #e5e7eb)" }}
      />
    );
  }

  return (
    <img
      src={normalizedSource}
      alt={alt}
      className={className}
      onError={() => setFailedSource(normalizedSource)}
    />
  );
}
