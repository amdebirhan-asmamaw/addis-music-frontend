import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { ModalOverlay, ModalContent, Button } from "./ui/Shared";
import type { Song } from "../types/song";

interface DeleteConfirmModalProps {
  songToDelete: Song;
  setIsDeleteModalOpen: (open: boolean) => void;
  setSongToDelete: (song: Song | null) => void;
  handleDelete: () => void;
  deleting?: boolean;
  deleteError?: string | null;
}

export default function DeleteConfirmModal({
  songToDelete,
  setIsDeleteModalOpen,
  setSongToDelete,
  handleDelete,
  deleting = false,
  deleteError = null,
}: DeleteConfirmModalProps) {
  return (
    <ModalOverlay>
      <ModalContent maxWidth="400px">
        <div style={{ padding: "24px", textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#fef2f2",
              color: "#ef4444",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <AlertCircle size={32} />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#0f172a",
              marginBottom: "8px",
              margin: 0,
            }}
          >
            Delete Track?
          </h2>
          <p
            style={{
              color: "#64748b",
              marginBottom: "24px",
              fontSize: "14px",
            }}
          >
            Are you sure you want to delete{" "}
            <span style={{ fontWeight: 600, color: "#334155" }}>
              "{songToDelete.title}"
            </span>
            ?
          </p>
          {deleteError && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                fontSize: "12px",
                border: "1px solid #fecaca",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              {deleteError}
            </div>
          )}
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSongToDelete(null);
              }}
              disabled={deleting}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleting}
              style={{ flex: 1 }}
            >
              {deleting ? (
                <>
                  <Loader2 size={16} className="spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 size={16} /> Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
