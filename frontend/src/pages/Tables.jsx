import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
    Typography
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

            console.log(response.data);

        } catch (error) {

            console.error(error);

            toast.error("Failed to Create Table");

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

                </CardContent>

            </Card>

        </Box>

    );

}