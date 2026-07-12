import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography
} from "@mui/material";

import api from "../api/api";
import toast from "react-hot-toast";

export default function Database() {

    const [databaseName, setDatabaseName] = useState("");

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
                    >
                        Create Database
                    </Button>

                </CardContent>

            </Card>

        </Box>

    );

}