import type { Request, Response } from "express";
import User from "../models/User.js";
import type { ApiResponse, AuthResponse } from "../types/api.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            } as ApiResponse )
        }
        
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'user'
        });

        const token = generateToken(user._id);

        const response: AuthResponse = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: response
        } as ApiResponse<AuthResponse> );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        } as ApiResponse )
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            } as ApiResponse )
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            } as ApiResponse );
        }

        const token = generateToken(user._id);

        const response: AuthResponse = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token
        };

        res.json({
            success: true,
            message: 'Login successful',
            data: response
        } as ApiResponse<AuthResponse> );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed'
        } as ApiResponse );
    }
};