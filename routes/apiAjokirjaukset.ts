import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virhekasittelija';

const ajokirjaukset : PrismaClient = new PrismaClient(); 

const apiAjokirjauksetRouter : express.Router = express.Router();

apiAjokirjauksetRouter.use(express.json());

apiAjokirjauksetRouter.put("/paivita/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (await ajokirjaukset.ajo.count({
        where : {
            id : Number(req.params.id)
        }
    })) {
        if (req.body.reitti.length > 0 && req.body.km > 0) {

            try {
                const muokattuAjo = await ajokirjaukset.ajo.update({
                    where : {
                        id : Number(req.params.id)
                    },
                    data : {
                        reitti : req.body.reitti,
                        km : req.body.km,
                        pvm : req.body.pvm
                    }
                });
                res.status(200).json(muokattuAjo);}
            catch (e : any) {
                next(new Virhe())}
        }
        else {next(new Virhe(400, "Tietojen päivittäminen epäonnistui. Tarkista syötetyt tiedot."))};
    }
    else {next(new Virhe(404, "Tietojen päivittäminen epäonnistui. Annettua ID:tä ei löydy"))}
});

apiAjokirjauksetRouter.delete("/poista/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
   
    if (await ajokirjaukset.ajo.count({
        where : {
            id : Number(req.params.id)
        }
        })) {
        try {
            const poistettuAjo = await ajokirjaukset.ajo.delete({
                where : {
                    id : Number(req.params.id)
                }
            });

            res.status(200).json(poistettuAjo);
        }
        catch (e : any) {next(new Virhe())}
   }
   else {next(new Virhe(404, "Poisto epäonnistui. Annettua ID:tä ei löydy."))}
});

apiAjokirjauksetRouter.post("/kirjaa", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (req.body.reitti.length > 0 && req.body.km > 0 && req.body.kayttaja > 0) {

        let pvmMuoto = /[0-9]{1,2}.[0-9]{1,2}.[0-9]{4}/;

        let p = new Date();
        let vvvv = p.getFullYear();
        let kk = p.getMonth() + 1;
        let pp = p.getDate();


        if (req.body.pvm?.length > 0 && pvmMuoto.test(req.body.pvm) === false) {
            next(new Virhe(400, "Ajon kirjaaminen epäonnistui. Syötä päivämäärä muodossa pp.kk.vvvv."));
        }
        else {

            try {
                const uusiAjo = await ajokirjaukset.ajo.create({
                    data : {
                        reitti : req.body.reitti,
                        km : req.body.km,
                        kayttaja : req.body.kayttaja,
                        pvm : req.body.pvm ? req.body.pvm : `${pp}.${kk}.${vvvv}`
                    }
                });

                res.status(200).json(uusiAjo);}
            catch (e : any) {
                next (new Virhe())}
        }
    }
    else {
        next(new Virhe(400, "Ajon kirjaaminen epäonnistui. Tarkista syötetyt tiedot."))}
});

export default apiAjokirjauksetRouter;