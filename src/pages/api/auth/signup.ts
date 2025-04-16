import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client"

type SignUpForm = {
  email: string;
  password: string;
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient()

  try {
    if (req.method !== 'POST') {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ message: "Method not allowed" });
    }

    const { email, password, name } = req.body as SignUpForm;

    // Check if user exists
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        accounts: {
          where: {
            provider: "google"
          }
        }
      }
    });

    if (existingUserWithEmail) {
      // If user exists and has a Google account, return a specific error
      if (existingUserWithEmail.accounts.length > 0) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(
          { message: "This email is already registered with Google. Please sign in with Google instead." }
        );
      }
      
      // Otherwise, return the standard error
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(
        { message: "User with this email already exists" }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return res.status(StatusCodes.CREATED).json(
      { message: "User created" }
    );
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      { message: "Internal server error" }
    );
  }
} 