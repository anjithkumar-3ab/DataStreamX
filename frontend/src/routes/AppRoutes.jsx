import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Database from "../pages/Database";
import Tables from "../pages/Tables";
import Generator from "../pages/Generator";
import Jobs from "../pages/Jobs";
import Logs from "../pages/Logs";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/database" element={<Database />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/logs" element={<Logs />} />
        </Routes>
    );
}