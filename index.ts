import express from "express";
import apiAjokirjauksetRouter from "./routes/apiAjokirjaukset";
import virhekasittelija from "./errors/virhekasittelija";

const app : express.Application = express();
const portti : number = Number(process.env.PORT) || 3104;

app.use("/api", apiAjokirjauksetRouter);
app.use(virhekasittelija);

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});