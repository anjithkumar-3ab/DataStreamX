import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AppRoutes from "../routes/AppRoutes";

export default function MainLayout() {
    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />

            <Box sx={{ flexGrow: 1 }}>
                <Navbar />

                <Box sx={{ p: 3 }}>
                    <AppRoutes />
                </Box>
            </Box>
        </Box>
    );
}