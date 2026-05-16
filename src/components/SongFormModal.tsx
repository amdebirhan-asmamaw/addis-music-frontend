import { X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { ModalOverlay, ModalContent, Input, Button } from "./ui/Shared";

export default function SongFormModal({
  editingSong,
  setIsFormModalOpen,
  formData,
  setFormData,
  formErrors,
  handleSaveSong,
  GENRES,
}: any) {
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
            style={{
              color: "#94a3b8",
              background: "none",
              border: "none",
              cursor: "pointer",
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
                {formData.image ? (
                  <img
                    src={formData.image}
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
              <Input
                type="text"
                value={formData.image}
                onChange={(e: any) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="Or paste image URL here..."
              />
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Track Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <Input
                  type="text"
                  hasError={!!formErrors.title}
                  value={formData.title}
                  onChange={(e: any) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Neon Horizons"
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Artist <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    hasError={!!formErrors.artist}
                    value={formData.artist}
                    onChange={(e: any) =>
                      setFormData({ ...formData, artist: e.target.value })
                    }
                    placeholder="Primary artist"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Album
                  </label>
                  <Input
                    type="text"
                    value={formData.album}
                    onChange={(e: any) =>
                      setFormData({ ...formData, album: e.target.value })
                    }
                    placeholder="Album or EP name"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Genre
                  </label>
                  <Input
                    as="select"
                    value={formData.genre}
                    onChange={(e: any) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {GENRES.filter((g: string) => g !== "All").map((g: string) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </Input>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Release Year
                  </label>
                  <Input
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e: any) =>
                      setFormData({
                        ...formData,
                        releaseYear:
                          parseInt(e.target.value) || new Date().getFullYear(),
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Duration
                  </label>
                  <Input
                    type="text"
                    value={formData.duration}
                    onChange={(e: any) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="MM:SS"
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Audio URL
                </label>
                <Input
                  type="url"
                  hasError={!!formErrors.audioUrl}
                  value={formData.audioUrl}
                  onChange={(e: any) =>
                    setFormData({ ...formData, audioUrl: e.target.value })
                  }
                  placeholder="https://example.com/track.mp3"
                />
                {formErrors.audioUrl && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      margin: "4px 0 0",
                    }}
                  >
                    {formErrors.audioUrl}
                  </p>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Description
                </label>
                <Input
                  as="textarea"
                  value={formData.description}
                  onChange={(e: any) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Add notes..."
                  style={{ minHeight: "100px", resize: "none" }}
                />
              </div>
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
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveSong}>
            <CheckCircle2 size={16} />{" "}
            {editingSong ? "Save Changes" : "Upload Track"}
          </Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
