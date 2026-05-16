import styled from "@emotion/styled";
import css from "@styled-system/css";
import { Music, BarChart2, Disc, Users, Search, Plus, Bell } from "lucide-react";

const Header = styled.header(
  css({
    bg: "white",
    borderBottom: "1px solid",
    borderColor: "#e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 30,
  }),
);
const HeaderContent = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 6,
    py: 3,
    maxWidth: "1600px",
    width: "100%",
    mx: "auto",
  }),
);
const LogoGroup = styled.div(
  css({ display: "flex", alignItems: "center", gap: "12px" }),
);
const Logo = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    gap: 2,
    color: "#0055FF",
    fontWeight: 700,
    fontSize: "28px",
    letterSpacing: "tight",
    cursor: "pointer",
  }),
);
const Nav = styled.nav(
  css({ display: ["none", "none", "flex"], alignItems: "center", gap: 1 }),
);
const NavItem = styled.button<{ active?: boolean }>(({ active }) =>
  css({
    display: "flex",
    alignItems: "center",
    gap: 2,
    px: "20px",
    py: "10px",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s",
    bg: active ? "#0055FF" : "transparent",
    color: active ? "white" : "#475569",
    boxShadow: active ? "0 4px 6px -1px rgba(0, 85, 255, 0.2)" : "none",
    border: "none",
    cursor: "pointer",
    "&:hover": { bg: active ? "#0055FF" : "#f1f5f9" },
  }),
);
const HeaderActions = styled.div(
  css({ display: "flex", alignItems: "center", gap: 4 }),
);
const SearchWrapper = styled.div(
  css({
    position: "relative",
    display: ["none", "none", "none", "block"],
    "&:focus-within svg": { color: "#0055FF" },
  }),
);
export const SearchInput = styled.input(
  css({
    width: "220px",
    height: "40px",
    pl: "36px",
    pr: 4,
    borderRadius: "9999px",
    border: "1px solid transparent",
    bg: "#f8fafc",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.2s",
    "&::placeholder": { color: "#94a3b8" },
    "&:focus": { bg: "white", borderColor: "#cbd5e1", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  }),
);
const AddButton = styled.button(
  css({
    bg: "#0055FF",
    color: "white",
    px: "24px",
    height: "48px",
    borderRadius: "9999px",
    fontSize: "14px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 2,
    transition: "all 0.2s",
    boxShadow: "0 8px 20px rgba(0,85,255,0.18)",
    border: "none",
    cursor: "pointer",
    "&:hover": { bg: "#1d4ed8" },
    "&:active": { transform: "scale(0.95)" },
  }),
);
const Avatar = styled.div(
  css({
    width: "36px",
    height: "36px",
    borderRadius: "full",
    bg: "#1e293b",
    border: "2px solid white",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    cursor: "pointer",
  }),
);

export default function AppHeader({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  handleOpenForm,
}: any) {
  return (
    <Header>
      <HeaderContent>
        <LogoGroup>
          <Logo>
            <Music size={24} fill="currentColor" />
            <span>MusicBox</span>
          </Logo>
          <Nav>
            <NavItem
              active={activeTab === "songs"}
              onClick={() => setActiveTab("songs")}
            >
              <Music size={16} /> Songs
            </NavItem>
            <NavItem
              active={activeTab === "stats"}
              onClick={() => setActiveTab("stats")}
            >
              <BarChart2 size={16} /> Stats
            </NavItem>
            <NavItem>
              <Disc size={16} /> Albums
            </NavItem>
            <NavItem>
              <Users size={16} /> Artists
            </NavItem>
          </Nav>
        </LogoGroup>
        <HeaderActions>
          <SearchWrapper>
            <div
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            >
              <Search size={16} />
            </div>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search music library..."
            />
          </SearchWrapper>
          <AddButton onClick={handleOpenForm}>
            <Plus size={16} /> Add New Song
          </AddButton>
          <div
            style={{
              width: "1px",
              height: "24px",
              backgroundColor: "#e2e8f0",
              margin: "0 8px",
            }}
          />
          <button
            style={{
              color: "#94a3b8",
              background: "none",
              border: "none",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <Bell size={20} />
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "8px",
                height: "8px",
                backgroundColor: "#ef4444",
                borderRadius: "50%",
                border: "2px solid white",
              }}
            ></span>
          </button>
          <Avatar>
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="User"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Avatar>
        </HeaderActions>
      </HeaderContent>
    </Header>
  );
}
