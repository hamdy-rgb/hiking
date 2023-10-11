import React, { useEffect } from "react";
import { Sidebar as ProSidebar, Menu, useProSidebar } from "react-pro-sidebar";
import { Typography, Box, IconButton, Avatar, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GridView, Logout } from "@mui/icons-material";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/features/authSlice";
import { useBrowserWidth } from "../../utils/Hooks";
import BoxCentered from "../utils/BoxCentered";
import { Item } from "../ui/menu";

const Sidebar = () => {
  const navigate = useNavigate();
  const { collapsed, collapseSidebar } = useProSidebar();
  const { firstName, lastName, photoUrl } = useSelector(state => state.auth);
  const { sasTokens } = useSelector(state => state.sasToken);
  const dispatch = useDispatch();
  const theme = useTheme();
  const browserWidth = useBrowserWidth();

  useEffect(() => {
    if (theme.breakpoints.values.md >= browserWidth) {
      collapseSidebar(true);
    } else {
      collapseSidebar(false);
    }
  }, [browserWidth]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        position: "fixed",
      }}
    >
      <ProSidebar
        collapsedWidth="80px"
        transitionDuration={500}
        rootStyles={{
          height: "100%",
          borderRight: "0px solid transparent",
          backgroundColor: "white",
        }}
      >
        <Menu
          rootStyles={{
            height: "100%",
            backgroundColor: "white",
          }}
        >
          <Box py={2}>
            <BoxCentered>
              <Box
                component="img"
                src="../../logo.png"
                width={collapsed ? 35 : 50}
                height={collapsed ? 35 : 50}
              />
            </BoxCentered>

            {!collapsed && (
              <Typography variant="body1" textAlign="center">
                Hiking
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: collapsed ? "89.5%" : "83.4%",
            }}
          >
            <Box
              style={{
                paddingRight: collapsed ? 10 : 15,
                paddingLeft: collapsed ? 10 : 15,
              }}
            >
              <Item title="Dashboard" to="/dashboard" icon={<GridView />} />
              <Item
                title="Admin"
                to="/dashboard/admin"
                icon={<AssignmentIndOutlinedIcon />}
              />
              <Item
                title="Evénement"
                to="/dashboard/events"
                icon={<EventNoteOutlinedIcon />}
              />
              <Item
                title="Category"
                to="/dashboard/categories"
                icon={<CategoryOutlinedIcon />}
              />
            </Box>
            <Stack
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: collapsed ? "column" : "row",
                paddingRight: "20px",
                paddingLeft: "20px",
                pb: 2,
                gap: 1,
              }}
            >
              <Avatar
                variant="circular"
                sx={{
                  width: collapsed ? 30 : 35,
                  height: collapsed ? 30 : 35,
                }}
                src={`${photoUrl}?${sasTokens.fileStorage}`}
                alt={`${firstName} ${lastName}`}
              />
              {!collapsed && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" component="p" color="initial">
                    {firstName} {lastName}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="p"
                    color="primary.main"
                  >
                    Admin
                  </Typography>
                </Box>
              )}
              <IconButton onClick={handleLogout}>
                <Logout sx={{ color: "black" }} fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
