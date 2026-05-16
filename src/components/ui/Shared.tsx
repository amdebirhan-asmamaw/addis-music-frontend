import styled from "@emotion/styled";
import css from "@styled-system/css";

export const ModalOverlay = styled.div(
  css({
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 4,
    bg: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(4px)",
  })
);

export const ModalContent = styled.div<{ maxWidth?: string }>(({ maxWidth }) =>
  css({
    bg: "white",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: maxWidth || "768px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  })
);

export const Input = styled.input<{ hasError?: boolean; as?: any }>(({ hasError }) =>
  css({
    width: "100%",
    px: 4,
    py: "10px",
    bg: "white",
    border: "1px solid",
    borderColor: hasError ? "#ef4444" : "#e2e8f0",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.2s",
    "&:focus": {
      borderColor: hasError ? "#ef4444" : "#0055FF",
      boxShadow: hasError
        ? "0 0 0 4px rgba(239, 68, 68, 0.1)"
        : "0 0 0 4px rgba(0, 85, 255, 0.1)",
    },
  })
);

export const Button = styled.button<{ variant?: "primary" | "danger" | "secondary" }>(
  ({ variant }) =>
    css({
      px: variant === "primary" ? 6 : 5,
      py: "10px",
      borderRadius: "9999px",
      fontSize: "14px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      transition: "all 0.2s",
      cursor: "pointer",
      border: "none",
      bg:
        variant === "primary"
          ? "#0055FF"
          : variant === "danger"
            ? "#ef4444"
            : "#f1f5f9",
      color: variant === "secondary" ? "#475569" : "white",
      boxShadow:
        variant !== "secondary" ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
      "&:hover": {
        bg:
          variant === "primary"
            ? "#1d4ed8"
            : variant === "danger"
              ? "#dc2626"
              : "#e2e8f0",
      },
    })
);

export const AddCard = styled.div(
  css({
    bg: "rgba(248, 250, 252, 0.5)",
    borderRadius: "24px",
    border: "2px dashed",
    borderColor: "#0055FF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      bg: "#f8fafc",
      borderColor: "#0055FF",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    "&:hover .add-icon": { bg: "#eff6ff", color: "#0055FF" },
  })
);
