"use client";

import {
  type DragEvent,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Paperclip, Upload, X } from "lucide-react";

/**
 * Drag-and-drop file input, with a click-to-browse fallback.
 *
 * Wraps any content: the children stay interactive, and dragging a file over
 * the region reveals an overlay. That lets a chat composer, a table, or a
 * whole page accept a drop without each product rebuilding the drag plumbing
 * and its edge cases.
 *
 * ── Why the colours are inline ─────────────────────────────────────────────
 * Same reason as Citation.tsx: this package is consumed two ways. EmissionX
 * regenerates the library's utility classes from its own theme, while AtmosIQ,
 * DataPivot and RIM ship the prebuilt `@envirobyte/ui/styles.css`. A utility
 * class that survives one path can be purged on the other. For most components
 * that risk is cosmetic; here the drag-active state *is* the affordance, so a
 * purged class means a dropzone that never looks droppable. Inline
 * `var(--role, fallback)` resolves through the consumer's own tokens and
 * nothing in a build step can drop it.
 *
 * ── The counter ────────────────────────────────────────────────────────────
 * `dragenter`/`dragleave` fire for every descendant the cursor crosses, so
 * tracking a boolean flickers the overlay as the pointer moves over child
 * elements. Depth counting is the fix: increment on enter, decrement on leave,
 * and only close at zero.
 */

export interface FileDropzoneProps {
  /** Called with the accepted files. Never called with an empty list. */
  onFiles: (files: File[]) => void;
  /**
   * Accepted types, as the `accept` attribute spells them
   * (e.g. `".xlsx,.csv"` or `"image/*"`). Dropped files are checked against
   * this too — the browser only applies it to the browse dialog.
   */
  accept?: string;
  /** Allow selecting or dropping more than one file at a time. */
  multiple?: boolean;
  /** Largest accepted file, in bytes. Rejected files are reported, not dropped silently. */
  maxSizeBytes?: number;
  /** Ignores drags and disables browsing. */
  disabled?: boolean;
  /**
   * Whether clicking the region opens the file dialog. Turn this off when the
   * children are themselves interactive — a chat input with its own paperclip
   * button — so a click on them does not open a picker.
   */
  clickToBrowse?: boolean;
  /** Shown in the overlay while a file is over the region. */
  overlayLabel?: string;
  /** Told why a file was refused, so the product can surface it its own way. */
  onReject?: (rejections: FileRejection[]) => void;
  /** The region that accepts drops. */
  children?: ReactNode;
  className?: string;
}

export interface FileRejection {
  file: File;
  reason: "type" | "size";
  message: string;
}

/**
 * Imperative handle, so a product can open the picker from its own control —
 * a paperclip in a chat composer, a link in an empty state — without keeping a
 * second hidden input beside the one this component already owns.
 */
export interface FileDropzoneHandle {
  open: () => void;
}

/** `accept` is a comma-separated list of extensions and/or MIME types, incl. `image/*`. */
function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  return accept.split(",").some((raw) => {
    const pattern = raw.trim().toLowerCase();
    if (!pattern) return false;
    if (pattern.startsWith(".")) return name.endsWith(pattern);
    if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1));
    return type === pattern;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

export const FileDropzone = forwardRef<FileDropzoneHandle, FileDropzoneProps>(function FileDropzone(
  {
    onFiles,
    accept,
    multiple = false,
    maxSizeBytes,
    disabled = false,
    clickToBrowse = false,
    overlayLabel,
    onReject,
    children,
    className,
  },
  ref
) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [dragging, setDragging] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      if (!disabled) inputRef.current?.click();
    },
  }), [disabled]);

  // A drag that ends outside the window never fires dragleave on the region,
  // which would strand the overlay open until the next interaction.
  useEffect(() => {
    if (!dragging) return;
    const clear = () => {
      depth.current = 0;
      setDragging(false);
    };
    window.addEventListener("drop", clear);
    window.addEventListener("dragend", clear);
    return () => {
      window.removeEventListener("drop", clear);
      window.removeEventListener("dragend", clear);
    };
  }, [dragging]);

  const accept_ = useCallback(
    (fileList: FileList | null) => {
      const incoming = Array.from(fileList || []);
      if (incoming.length === 0) return;

      const files = multiple ? incoming : incoming.slice(0, 1);
      const rejections: FileRejection[] = [];
      const accepted: File[] = [];

      for (const file of files) {
        if (!matchesAccept(file, accept)) {
          rejections.push({
            file,
            reason: "type",
            message: `${file.name} is not an accepted file type (expected ${accept}).`,
          });
        } else if (maxSizeBytes && file.size > maxSizeBytes) {
          rejections.push({
            file,
            reason: "size",
            message: `${file.name} is ${formatBytes(file.size)}, over the ${formatBytes(maxSizeBytes)} limit.`,
          });
        } else {
          accepted.push(file);
        }
      }

      if (rejections.length) onReject?.(rejections);
      if (accepted.length) onFiles(accepted);
    },
    [accept, maxSizeBytes, multiple, onFiles, onReject]
  );

  const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (disabled || !event.dataTransfer?.types?.includes("Files")) return;
    event.preventDefault();
    depth.current += 1;
    setDragging(true);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (disabled || !event.dataTransfer?.types?.includes("Files")) return;
    // Without preventDefault on dragover the browser refuses the drop and
    // navigates to the file instead.
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    depth.current = 0;
    setDragging(false);
    accept_(event.dataTransfer?.files ?? null);
  };

  const browse = () => {
    if (!disabled) inputRef.current?.click();
  };

  const clickable = clickToBrowse && !disabled;

  return (
    <div
      className={className}
      style={{ position: "relative", ...(clickable ? { cursor: "pointer" } : {}) }}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-dragging={dragging || undefined}
      {...(clickable
        ? {
            role: "button",
            tabIndex: 0,
            onClick: browse,
            onKeyDown: (event: React.KeyboardEvent) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                browse();
              }
            },
          }
        : {})}
    >
      {children}

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          accept_(event.target.files);
          // Reset so picking the same file twice in a row still fires change.
          event.target.value = "";
        }}
        style={{ display: "none" }}
      />

      {dragging && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            borderRadius: "0.5rem",
            border: "2px dashed var(--brand, #274c7c)",
            background: "var(--brand-subtle, #eef3f9)",
            color: "var(--brand, #274c7c)",
            fontSize: "0.875rem",
            fontWeight: 600,
            pointerEvents: "none",
          }}
        >
          <Upload style={{ width: "1rem", height: "1rem" }} />
          <span>
            {overlayLabel ??
              `Drop ${multiple ? "files" : "the file"} here${accept ? ` (${accept})` : ""}`}
          </span>
        </div>
      )}
    </div>
  );
});

export interface AttachedFileChipProps {
  /** Name shown on the chip. */
  name: string;
  /** Removes the attachment. Omit to render a chip that cannot be dismissed. */
  onRemove?: () => void;
  className?: string;
}

/**
 * The "a file is attached" chip that pairs with FileDropzone.
 *
 * Shipped alongside so every product shows an attachment the same way, rather
 * than each inventing its own truncation and remove affordance.
 */
export function AttachedFileChip({ name, onRemove, className }: AttachedFileChipProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        maxWidth: "16rem",
        padding: "0.25rem 0.5rem",
        borderRadius: "0.375rem",
        background: "var(--surface-hover, #f9fafb)",
        border: "1px solid var(--border, #e5e7eb)",
        color: "var(--text-primary, #374151)",
        fontSize: "0.75rem",
        fontWeight: 500,
      }}
    >
      <Paperclip style={{ width: "0.75rem", height: "0.75rem", flexShrink: 0 }} />
      <span
        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        title={name}
      >
        {name}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          style={{
            display: "inline-flex",
            padding: "0.125rem",
            borderRadius: "9999px",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            color: "inherit",
            lineHeight: 0,
          }}
        >
          <X style={{ width: "0.75rem", height: "0.75rem" }} />
        </button>
      )}
    </span>
  );
}
