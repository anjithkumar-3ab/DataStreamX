import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import api from "../api/api";
import toast from "react-hot-toast";

export default function Generator() {

    const [databases, setDatabases] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState("");
    const [columns, setColumns] = useState([]);
    const [delay, setDelay] = useState(1);
    const [activeJob, setActiveJob] = useState(null);
    const [jobs, setJobs] = useState([]);

    const loadDatabases = async () => {
        const response = await api.get("/database/list");
        const nextDatabases = response.data.databases || [];
        setDatabases(nextDatabases);
        if (!selectedDatabase && nextDatabases.length > 0) {
            setSelectedDatabase(nextDatabases[0].database_name);
        }
    };

    const loadTables = async (databaseName) => {
        if (!databaseName) {
            setTables([]);
            setSelectedTable("");
            setColumns([]);
            return;
        }

        const response = await api.get(`/database/${databaseName}/tables`, {
            params: { include_columns: true },
        });

        const nextTables = response.data.tables || [];
        setTables(nextTables);

        if (!selectedTable && nextTables.length > 0) {
            setSelectedTable(nextTables[0].table_name);
            setColumns(nextTables[0].columns || []);
        }
    };

    const loadJobs = async () => {
        const response = await api.get("/generator/jobs");
        setJobs(response.data || []);
    };

    useEffect(() => {
        loadDatabases();
        loadJobs();
    }, []);

    useEffect(() => {
        loadTables(selectedDatabase);
    }, [selectedDatabase]);

    useEffect(() => {
        const selected = tables.find((table) => table.table_name === selectedTable);
        setColumns(selected?.columns || []);
    }, [selectedTable, tables]);

    const startGenerator = async () => {
        if (!selectedDatabase || !selectedTable) {
            toast.error("Select a database and table first");
            return;
        }

        if (columns.length === 0) {
            toast.error("Selected table has no columns");
            return;
        }

        try {
            const response = await api.post("/generator/start", {
                database_name: selectedDatabase,
                table_name: selectedTable,
                delay: Number(delay),
                columns: columns.map((column) => ({
                    column_name: column.name,
                    data_type: column.type,
                })),
            });

            setActiveJob(response.data.job_id);
            toast.success("Generator started successfully");
            await loadJobs();
        } catch (error) {
            console.error(error);
            toast.error("Failed to start generator");
        }
    };

    const stopGenerator = async (jobId) => {
        try {
            await api.post(`/generator/stop/${jobId}`);
            toast.success("Generator stopped");
            setActiveJob(null);
            await loadJobs();
        } catch (error) {
            console.error(error);
            toast.error("Failed to stop generator");
        }
    };

    const selectedTablePreview = useMemo(
        () => tables.find((table) => table.table_name === selectedTable),
        [tables, selectedTable]
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Generator
            </Typography>

            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Database"
                                    value={selectedDatabase}
                                    onChange={(e) => {
                                        setSelectedDatabase(e.target.value);
                                        setSelectedTable("");
                                    }}
                                >
                                    {databases.map((database) => (
                                        <MenuItem key={database.database_name} value={database.database_name}>
                                            {database.database_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Table"
                                    value={selectedTable}
                                    onChange={(e) => setSelectedTable(e.target.value)}
                                >
                                    {tables.map((table) => (
                                        <MenuItem key={table.table_name} value={table.table_name}>
                                            {table.table_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Delay (seconds)"
                                    value={delay}
                                    onChange={(e) => setDelay(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Divider />

                        <Typography variant="h6">
                            Table Columns
                        </Typography>

                        <Stack spacing={1}>
                            {(selectedTablePreview?.columns || []).map((column) => (
                                <Box key={column.name} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography>{column.name}</Typography>
                                    <Typography color="text.secondary">{column.type}</Typography>
                                </Box>
                            ))}
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" onClick={startGenerator}>
                                Start Generator
                            </Button>
                        </Stack>

                        <Divider />

                        <Typography variant="h6">
                            Active Jobs
                        </Typography>

                        <Stack spacing={1}>
                            {jobs.length === 0 ? (
                                <Typography color="text.secondary">No jobs running.</Typography>
                            ) : (
                                jobs.map((job) => (
                                    <Box
                                        key={job.job_id}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 2,
                                            p: 2,
                                        }}
                                    >
                                        <Box>
                                            <Typography fontWeight={600}>{job.database}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {job.table} - {job.rows_generated} rows - every {job.delay}s
                                            </Typography>
                                        </Box>

                                        <Button
                                            color="error"
                                            variant="outlined"
                                            onClick={() => stopGenerator(job.job_id)}
                                            disabled={!job.running}
                                        >
                                            Stop
                                        </Button>
                                    </Box>
                                ))
                            )}
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}