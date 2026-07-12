import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Typography,
    TextField,
    Tooltip
} from "@mui/material";

import api from "../api/api";
import toast from "react-hot-toast";

export default function Database() {

    const [databaseName, setDatabaseName] = useState("");
    const [databases, setDatabases] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [selectedTables, setSelectedTables] = useState([]);

    const loadDatabases = async () => {
        try {
            const response = await api.get("/database/list");
            const nextDatabases = response.data.databases || [];

            setDatabases(nextDatabases);

            if (!selectedDatabase && nextDatabases.length > 0) {
                setSelectedDatabase(nextDatabases[0].database_name);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const loadTables = async (database) => {
        if (!database) {
            setSelectedTables([]);
            return;
        }

        try {
            const response = await api.get(`/database/${database}/tables`);
            setSelectedTables(response.data.tables || []);
        } catch (error) {
            console.error(error);
            setSelectedTables([]);
        }
    };

    const connectDatabase = async (database) => {
        try {
            const response = await api.post("/database/connect", {
                database_name: database,
            });

            toast.success(response.data.message || `Connected to ${database}`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to connect to ${database}`);
        }
    };

    const deleteDatabase = async (database) => {
        try {
            const response = await api.delete(`/database/${database}`);

            toast.success(response.data.message || `Deleted ${database}`);

            const remaining = databases.filter(
                (item) => item.database_name !== database
            );

            setDatabases(remaining);

            if (selectedDatabase === database) {
                const nextDatabase = remaining[0]?.database_name || "";
                setSelectedDatabase(nextDatabase);
                await loadTables(nextDatabase);
            }
        } catch (error) {
            console.error(error);
            toast.error(`Failed to delete ${database}`);
        }
    };

    useEffect(() => {
        loadDatabases();
    }, []);

    useEffect(() => {
        loadTables(selectedDatabase);
    }, [selectedDatabase]);

    const createDatabase = async () => {

        try {

            const response = await api.post(
                "/database/create",
                {
                    database_name: databaseName
                }
            );

            toast.success(
                response.data.message || "Database Created Successfully"
            );

            console.log(response.data);

            setDatabaseName("");

            await loadDatabases();

            setSelectedDatabase(databaseName);
            await loadTables(databaseName);

        } catch (error) {

            console.error(error);

            toast.error("Database Creation Failed");

        }

    };

    return (

        <Box sx={{ p: 3 }}>

            <Typography
                variant="h4"
                gutterBottom
            >
                Database Manager
            </Typography>

            <Card>

                <CardContent>

                    <TextField
                        fullWidth
                        label="Database Name"
                        value={databaseName}
                        onChange={(e) => setDatabaseName(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        onClick={createDatabase}
                        disabled={!databaseName}
                    >
                        Create Database
                    </Button>

                    <Divider sx={{ my: 3 }} />

                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Created Databases
                            </Typography>

                            <List dense>
                                {databases.length === 0 ? (
                                    <ListItem>
                                        <ListItemText primary="No databases created yet." />
                                    </ListItem>
                                ) : (
                                    databases.map((database) => (
                                        <ListItem key={database.database_name} disablePadding>
                                            <ListItemButton
                                                selected={selectedDatabase === database.database_name}
                                                onClick={() => setSelectedDatabase(database.database_name)}
                                            >
                                                <ListItemText
                                                    primary={database.database_name}
                                                    secondary={`${database.table_count} table(s)`}
                                                />
                                                <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                                                    <Tooltip title="Connect to database">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                connectDatabase(database.database_name);
                                                            }}
                                                        >
                                                            Connect
                                                        </Button>
                                                    </Tooltip>

                                                    <Tooltip title="Delete database">
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            variant="outlined"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                deleteDatabase(database.database_name);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Tooltip>
                                                </Stack>
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </Box>

                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Tables in {selectedDatabase || "selected database"}
                            </Typography>

                            <List dense>
                                {selectedTables.length === 0 ? (
                                    <ListItem>
                                        <ListItemText primary="No tables found." />
                                    </ListItem>
                                ) : (
                                    selectedTables.map((table) => (
                                        <ListItem key={table.table_name}>
                                            <ListItemText
                                                primary={table.table_name}
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </Box>
                    </Stack>

                </CardContent>

            </Card>

        </Box>

    );

}