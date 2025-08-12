import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user-model";
import { BadRequestError } from "../errors/bad-request-error";
import { JWTUtil } from "../services/Json-web-token";


const userController = async (req : Request, res: Response) => {

        const { email, password } = req.body;

        // Handle user signup logic here

        //check the db for email

        const existingUser = await User.findOne({ email });

        //error structure
        /*
        {
            errors : {
                message: string,
                field: string
            }[]
        }
        */
        if(existingUser) {
            throw new BadRequestError("This email is already in use! Please try to sign in")
        }

        // save user
        const user = User.build({ email, password });
        await user.save();

        const token = JWTUtil.generateToken(user.id, user.email);

        //store jwt into cookie
        req.session = {
            jwt: token
        }

        // to have a common response structure we can use toJson() in the object
        return res.status(201).send(user);

    }

export { userController };