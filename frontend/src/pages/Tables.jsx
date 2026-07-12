import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Alert,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from "@mui/material";

import api from "../api/api";
import toast from "react-hot-toast";

const dataTypes = [
    "TEXT",
    "INTEGER",
    "REAL",
    "EMAIL",
    "PHONE",
    "BOOLEAN",
    "DATE",
    "DATETIME"
];

export default function Tables() {

    const [databaseName, setDatabaseName] = useState("company");

    const [tableName, setTableName] = useState("");

    const [saveStatus, setSaveStatus] = useState("");

    const [tables, setTables] = useState([]);

    const [editingTable, setEditingTable] = useState("");

    const [editedTableName, setEditedTableName] = useState("");

    const [selectedTableForView, setSelectedTableForView] = useState("");

    const [tableData, setTableData] = useState({ columns: [], rows: [], total_rows: 0 });

    const [loadingData, setLoadingData] = useState(false);

    const loadTables = async (database) => {
        if (!database) {
            setTables([]);
            return;
        }

        try {
            const response = await api.get(`/database/${database}/tables`);
            setTables(response.data.tables || []);
        } catch (error) {
            console.error(error);
            setTables([]);
        }
    };

    const loadTableData = async (database, table) => {
        if (!database || !table) return;

        try {
            setLoadingData(true);
            const response = await api.get(`/table/${database}/${table}/data`, {
                params: { limit: 50, offset: 0 }
            });

            if (response.data.status === "success") {
                setTableData({
                    columns: response.data.columns,
                    rows: response.data.rows,
                    total_rows: response.data.total_rows
                });
            }
            setLoadingData(false);
        } catch (error) {
            console.error(error);
            setLoadingData(false);
        }
    };

    useEffect(() => {
        loadTables(databaseName);
    }, [databaseName]);

    // Auto-refresh table data every 2 seconds when table is selected
    useEffect(() => {
        if (!selectedTableForView) return;

        loadTableData(databaseName, selectedTableForView);

        const interval = setInterval(() => {
            loadTableData(databaseName, selectedTableForView);
        }, 2000); // Refresh every 2 seconds

        return () => clearInterval(interval);
    }, [selectedTableForView, databaseName]);

    const [columns, setColumns] = useState([
        {
            column_name: "",
            data_type: "TEXT"
        }
    ]);

    const addColumn = () => {

        setColumns([
            ...columns,
            {
                column_name: "",
                data_type: "TEXT"
            }
        ]);

    };

    const createTable = async () => {

        if (!tableName) {
            toast.error("Enter Table Name");
            return;
        }

        if (!databaseName) {
            toast.error("Enter Database Name");
            return;
        }

        try {

            const response = await api.post(
                "/table/create",
                {
                    database_name: databaseName,
                    table_name: tableName,
                    columns: columns
                }
            );

            toast.success(
                response.data.message || "Table Created Successfully"
            );

            setSaveStatus(
                `Saved to local database: ${databaseName}`
            );

            await loadTables(databaseName);

            console.log(response.data);

            setTableName("");
            setColumns([
                {
                    column_name: "",
                    data_type: "TEXT"
                }
            ]);

        } catch (error) {

            console.error(error);

            toast.error("Failed to Create Table");

        }

    };

    const renameTable = async (tableNameToRename) => {
        if (!editedTableName) {
            toast.error("Enter a new table name");
            return;
        }

        try {
            const response = await api.post("/table/rename", {
                database_name: databaseName,
                table_name: tableNameToRename,
                new_table_name: editedTableName,
            });

            toast.success(response.data.message || "Table renamed successfully");
            setEditingTable("");
            setEditedTableName("");
            await loadTables(databaseName);
        } catch (error) {
            console.error(error);
            toast.error("Failed to rename table");
        }
    };

    const deleteTable = async (tableNameToDelete) => {
        try {
            const response = await api.delete("/table/delete", {
                data: {
                    database_name: databaseName,
                    table_name: tableNameToDelete,
                },
            });

            toast.success(response.data.message || "Table deleted successfully");
            await loadTables(databaseName);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete table");
        }
    };

    return (

        <Box sx={{ p: 3 }}>

            <Typography
                variant="h4"
                gutterBottom
            >
                Table Designer
            </Typography>

            <Card>

                <CardContent>

                    <TextField
                        fullWidth
                        label="Database Name"
                        value={databaseName}
                        onChange={(e) => setDatabaseName(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Table Name"
                        value={tableName}
                        onChange={(e) => setTableName(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    {columns.map((column, index) => (

                        <Grid
                            container
                            spacing={2}
                            key={index}
                            sx={{ mb: 2 }}
                        >

                            <Grid item xs={6}>

                                <TextField
                                    fullWidth
                                    label="Column Name"
                                    value={column.column_name}
                                    onChange={(e) => {

                                        const updated = [...columns];

                                        updated[index].column_name =
                                            e.target.value;

                                        setColumns(updated);

                                    }}
                                />

                            </Grid>

                            <Grid item xs={6}>

                                <TextField
                                    select
                                    fullWidth
                                    label="Datatype"
                                    value={column.data_type}
                                    onChange={(e) => {

                                        const updated = [...columns];

                                        updated[index].data_type =
                                            e.target.value;

                                        setColumns(updated);

                                    }}
                                >

                                    {dataTypes.map((type) => (

                                        <MenuItem
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </MenuItem>

                                    ))}

                                </TextField>

                            </Grid>

                        </Grid>

                    ))}

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={addColumn}
                        >
                            Add Column
                        </Button>

                        <Button
                            variant="contained"
                            onClick={createTable}
                        >
                            Create Table
                        </Button>

                    </Box>

                    {saveStatus && (
                        <Alert
                            severity="success"
                            sx={{ mt: 3 }}
                        >
                            {saveStatus}
                        </Alert>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Tables in {databaseName}
                    </Typography>

                    <List dense>
                        {tables.length === 0 ? (
                            <ListItem>
                                <ListItemText primary="No tables found." />
                            </ListItem>
                        ) : (
                            tables.map((table) => (
                                <ListItem 
                                    key={table.table_name} 
                                    disablePadding 
                                    sx={{ 
                                        mb: 1, 
                                        bgcolor: selectedTableForView === table.table_name ? "action.selected" : "transparent",
                                        borderRadius: 1
                                    }}
                                >
                                    <ListItemButton
                                        onClick={() => setSelectedTableForView(table.table_name)}
                                    >
                                        <Stack spacing={1} sx={{ width: "100%" }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <ListItemText primary={table.table_name} />
                                                <Chip 
                                                    label={`${table.row_count || 0} rows`} 
                                                    size="small" 
                                                    variant="outlined"
                                                />
                                            </Stack>

                                            {editingTable === table.table_name && (
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="New table name"
                                                    value={editedTableName}
                                                    onChange={(e) => setEditedTableName(e.target.value)}
                                                />
                                            )}

                                            <Stack direction="row" spacing={1}>
                                                {editingTable === table.table_name ? (
                                                    <>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            onClick={() => renameTable(table.table_name)}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                setEditingTable("");
                                                                setEditedTableName("");
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                setEditingTable(table.table_name);
                                                                setEditedTableName(table.table_name);
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            variant="outlined"
                                                            onClick={() => deleteTable(table.table_name)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </ListItemButton>
                                </ListItem>
                            ))
                        )}
                    </List>

                    {/* Live Data Preview */}
                    {selectedTableForView && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h6">
                                    📊 Live Data: <strong>{selectedTableForView}</strong>
                                </Typography>
                                <Chip 
                                    label={`${tableData.total_rows} total rows`} 
                                    color={tableData.total_rows > 0 ? "success" : "default"}
                                    icon={loadingData ? undefined : undefined}
                                />
                            </Box>

                            {tableData.rows.length === 0 ? (
                                <Alert severity="info">
                                    No data in this table yet. Start the generator to create test data!
                                </Alert>
                            ) : (
                                <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                                {tableData.columns.map((col) => (
                                                    <TableCell key={col} sx={{ fontWeight: "bold" }}>
                                                        {col}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tableData.rows.map((row, idx) => (
                                                <TableRow key={idx} hover>
                                                    {tableData.columns.map((col) => (
                                                        <TableCell key={`${idx}-${col}`}>
                                                            {typeof row[col] === 'boolean' ? (
                                                                <Chip 
                                                                    label={row[col] ? 'true' : 'false'} 
                                                                    size="small"
                                                                    color={row[col] ? 'success' : 'default'}
                                                                />
                                                            ) : (
                                                                String(row[col] || '-').substring(0, 50)
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}

                </CardContent>

            </Card>

        </Box>

    );

}