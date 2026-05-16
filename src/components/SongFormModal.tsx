// components/SongFormModal.tsx — Create / edit a song with file uploads
//
// Owns no server state. The parent supplies form data + dispatch handlers;
// this component manages local file pickers and previews, and reads the
// `submitting` flag from the songs slice to disable controls during upload.

import { useEffect, useRef } from "react";
import { X, Image as ImageIcon, CheckCircle2, Music, Loader2 } from "lucide-react";
import { ModalOverlay, ModalContent, Input, Button } from "./ui/Shared";
import type { Song, SongFormData, SongFormErrors } from "../types/song";

interface SongFormModalProps {
  editingSong: Song | null;
  setIsFormModalOpen: (open: boolean) => void;
  formData: SongFormData;
  setFormData: React.Dispatch<React.SetStateAction<SongFormData>>;
  formErrors: SongFormErrors;
  handleSaveSong: () => void;
  GENRES: readonly string[];
  submitting?: boolean;
  submitError?: string | null;
}

const STATUSES: Array<SongFormData["status"]> = ["DRAFT", "PROCESSING", "LIVE"];

export default function SongFormModal({
  editingSong,
  setIsFormModalOpen,
  formData,
  setFormData,
  formErrors,
  handleSaveSong,
  GENRES,
  submitting = false,
  submitError = null,
}: SongFormModalProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // Revoke object URLs we created when files change/unmount so blob refs
  // don't leak. We only need to revoke URLs that came from this session
  // (i.e. when there's a File attached); URLs that came from Cloudinary
  // stay untouched.
  useEffect(() => {
    return () => {
      if (formData.imageFile && formData.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      if (formData.audioFile && formData.audioPreview.startsWith("blob:")) {
        URL.revokeObjectURL(formData.audioPreview);
      }
    };
    // We intentionally only clean up on unmount. Per-change cleanup is
    // handled inside the file pickers below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPickImage = (file: File | null) => {
    if (formData.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: file ? URL.createObjectURL(file) : prev.imagePreview,
    }));
  };

  const onPickAudio = (file: File | null) => {
    if (formData.audioPreview.startsWith("blob:")) {
      URL.revokeObjectURL(formData.audioPreview);
    }
    setFormData((prev) => ({
      ...prev,
      audioFile: file,
      audioPreview: file ? URL.createObjectURL(file) : prev.audioPreview,
    }));
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: 0,
            }}
          >
            {editingSong ? "Edit Track Metadata" : "Add New Track"}
          </h2>
          <button
            onClick={() => setIsFormModalOpen(false)}
            disabled={submitting}
            style={{
              color: "#94a3b8",
              background: "none",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              padding: "8px",
              borderRadius: "50%",
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            backgroundColor: "#f8fafc",
          }}
        >
          <div style={{ display: "flex", gap: "32px", flexDirection: "row" }}>
            {/* Left column — cover artwork */}
            <div style={{ width: "33.333%", flexShrink: 0 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "6px",
                }}
              >
                Cover Artwork
              </label>
              <div
                onClick={() => imageInputRef.current?.click()}
                style={{
                  aspectRatio: "1/1",
                  backgroundColor: "white",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: "12px",
                }}
              >
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Cover Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "16px",
                    }}
                  >
                    <ImageIcon
                      size={40}
                      color="#cbd5e1"
                      style={{ marginBottom: "12px" }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#475569",
                      }}
                    >
                      Click to upload
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
              />
              {formErrors.imageFile && (
                <p style={errorTextStyle}>{formErrors.imageFile}</p>
              )}

              {/* Audio picker */}
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#334155",
                  margin: "16px 0 6px",
                }}
              >
                Audio File
              </label>
              <div
                onClick={() => audioInputRef.current?.click()}
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "12px",
                  padding: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  backgroundColor: "white",
                }}
              >
                <Music size={24} color="#475569" />
                <div style={{ overflow: "hidden", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {formData.audioFile?.name ??
                      (formData.audioPreview ? "Existing track" : "Click to upload")}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    MP3, WAV, OGG up to 50 MB
                  </div>
                </div>
              </div>
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                style={{ display: "none" }}
                onChange={(e) => onPickAudio(e.target.files?.[0] ?? null)}
              />
              {formErrors.audioFile && (
                <p style={errorTextStyle}>{formErrors.audioFile}</p>
              )}
            </div>

            {/* Right column — metadata */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div>
                <Label>
                  Track Title <RequiredMark />
                </Label>
                <Input
                  type="text"
                  hasError={!!formErrors.title}
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Neon Horizons"
                />
                {formErrors.title && <p style={errorTextStyle}>{formErrors.title}</p>}
              </div>

              <div style={twoColGrid}>
                <div>
                  <Label>
                    Artist <RequiredMark />
                  </Label>
                  <Input
                    type="text"
                    hasError={!!formErrors.artist}
                    value={formData.artist}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, artist: e.target.value })
                    }
                    placeholder="Primary artist"
                  />
                  {formErrors.artist && (
                    <p style={errorTextStyle}>{formErrors.artist}</p>
                  )}
                </div>
                <div>
                  <Label>
                    Album <RequiredMark />
                  </Label>
                  <Input
                    type="text"
                    hasError={!!formErrors.album}
                    value={formData.album}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, album: e.target.value })
                    }
                    placeholder="Album or EP name"
                  />
                  {formErrors.album && (
                    <p style={errorTextStyle}>{formErrors.album}</p>
                  )}
                </div>
              </div>

              <div style={fourColGrid}>
                <div>
                  <Label>Genre</Label>
                  <Input
                    as="select"
                    value={formData.genre}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement & HTMLInputElement>) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {GENRES.filter((g) => g !== "All").map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </Input>
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({
                        ...formData,
                        releaseYear:
                          parseInt(e.target.value) || new Date().getFullYear(),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    type="text"
                    value={formData.duration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="MM:SS"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Input
                    as="select"
                    value={formData.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement & HTMLInputElement>) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as SongFormData["status"],
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Input>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  as="textarea"
                  value={formData.description}
                  onChange={(
                    e: React.ChangeEvent<HTMLTextAreaElement & HTMLInputElement>,
                  ) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes..."
                  style={{ minHeight: "100px", resize: "none" }}
                />
              </div>

              {submitError && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "#fef2f2",
                    color: "#b91c1c",
                    fontSize: "13px",
                    border: "1px solid #fecaca",
                  }}
                >
                  {submitError}
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f1f5f9",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setIsFormModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveSong}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="spin" />
                {editingSong ? "Saving…" : "Uploading…"}
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                {editingSong ? "Save Changes" : "Upload Track"}
              </>
            )}
          </Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}

// ─── Small inline atoms ─────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  color: "#334155",
  marginBottom: "6px",
};

const errorTextStyle: React.CSSProperties = {
  color: "#ef4444",
  fontSize: "12px",
  margin: "4px 0 0",
};

const twoColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
};

const fourColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gap: "20px",
};

function Label({ children }: { children: React.ReactNode }) {
  return <label style={labelStyle}>{children}</label>;
}

function RequiredMark() {
  return <span style={{ color: "#ef4444" }}>*</span>;
}
