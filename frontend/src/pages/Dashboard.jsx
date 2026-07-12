import { Grid } from "@mui/material";
import StatCard from "../components/StatCard";

export default function Dashboard() {

    return (

        <Grid container spacing={3}>

            <Grid item xs={12} md={3}>
                <StatCard
                    title="Running Jobs"
                    value="0"
                />
            </Grid>

            <Grid item xs={12} md={3}>
                <StatCard
                    title="Rows Generated"
                    value="0"
                />
            </Grid>

            <Grid item xs={12} md={3}>
                <StatCard
                    title="Databases"
                    value="0"
                />
            </Grid>

            <Grid item xs={12} md={3}>
                <StatCard
                    title="Tables"
                    value="0"
                />
            </Grid>

        </Grid>

    );

}