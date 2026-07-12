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

        toast.success("Database Created");

        console.log(response.data);

    } catch (error) {

        toast.error("Database Creation Failed");

        console.error(error);

    }

};

    };

    return (

        <Box>

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
                        onChange={(e)=>setDatabaseName(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        sx={{mt:2}}
                        onClick={createDatabase}
                    >
                        Create Database
                    </Button>

                </CardContent>

            </Card>

        </Box>

    );

}