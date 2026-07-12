import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Box
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import TableChartIcon from "@mui/icons-material/TableChart";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import DescriptionIcon from "@mui/icons-material/Description";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 250;

const menuItems = [
    {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/"
    },
    {
        text: "Database",
        icon: <StorageIcon />,
        path: "/database"
    },
    {
        text: "Tables",
        icon: <TableChartIcon />,
        path: "/tables"
    },
    {
        text: "Generator",
        icon: <PlayCircleIcon />,
        path: "/generator"
    },
    {
        text: "Jobs",
        icon: <WorkspacesIcon />,
        path: "/jobs"
    },
    {
        text: "Logs",
        icon: <DescriptionIcon />,
        path: "/logs"
    }
];

export default function Sidebar() {

    const location = useLocation();

    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box"
                }
            }}
        >

            <Toolbar>

                <Box>

                    <Typography variant="h5" fontWeight="bold">
                        DataStreamX
                    </Typography>

                    <Typography variant="body2">
                        Live BI Generator
                    </Typography>

                </Box>

            </Toolbar>

            <List>

                {menuItems.map((item) => (

                    <ListItemButton
                        key={item.text}
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                    >

                        <ListItemIcon>

                            {item.icon}

                        </ListItemIcon>

                        <ListItemText
                            primary={item.text}
                        />

                    </ListItemButton>

                ))}

            </List>

        </Drawer>

    );

}