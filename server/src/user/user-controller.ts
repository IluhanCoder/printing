import { ExtendedRequest } from './../auth/auth-middleware';
import { Request, Response } from "express";
import userService from "./user-service";
import User from './user-model';

export default new class UserController {
    async createSpecialist (req: Request, res: Response) {
        try {
            const userData = req.body;
            const user = await userService.createSpecialist(userData);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getUserId (req: ExtendedRequest, res: Response) {
        try {
            const user = req.user;
            res.status(200).json({id: user._id as string});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateProfile(req: ExtendedRequest, res: Response) {
        try {
            const { username, email, cell, cardNumber } = req.body;
            const userId = req.user._id;

            const updatedUser = await User.findByIdAndUpdate(userId, { username, email, cell, cardNumber }, { new: true });
            res.status(200).json({ user: updatedUser });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getUserCard (req: ExtendedRequest, res: Response) {
        try {
          const userId = req.params.userId;
          const user = await User.findById(userId);
          if (!user) {
            res.status(404).json({ message: "User not found" });
          }
          res.status(200).json({ cardNumber: user.cardNumber });
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch card number" });
        }
      }

      async getProfile (req, res) {
        try {
          const userId = req.user._id;
      
          // Find the user by ID, excluding sensitive information like password
          const user = await User.findById(userId).select("-password");
      
          // If user not found, send an error response
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
          // Send the user profile data as a response
          res.status(200).json(user);
        } catch (error) {
          console.error("Failed to get profile", error);
          res.status(500).json({ message: "Server error" });
        }
      }
}