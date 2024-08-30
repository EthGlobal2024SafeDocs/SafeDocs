import { Response } from "express";
import {Request} from 'express-jwt'

export const HandleMe  = (req: Request, res: Response)=>{

    const {auth} = req
    console.log(auth);
    
    res.status(200).send();
}