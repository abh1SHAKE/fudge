import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import Sweet from "../models/Sweet.js";
import type { ApiResponse, PaginatedResponse } from "../types/api.js";

export const createSweet = async (req: AuthRequest, res: Response) => {
    try {
        const { name, category, price, quantity, description, imageUrl } = req.body;

        const sweet = await Sweet.create({
            name,
            category,
            price,
            quantity,
            description,
            imageUrl
        });

        res.status(201).json({
            success: true,
            message: 'Sweet created successfully',
            data: sweet
        } as ApiResponse );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create sweet'
        } as ApiResponse );
    }
};

export const getAllSweets = async(req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const sweets = await Sweet.find().skip(skip).limit(limit);
        const total = await Sweet.countDocuments();

        const response: PaginatedResponse<typeof sweets[0]> = {
            data: sweets,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };

        res.json({
            success: true,
            message: 'Sweets retrieved successfully',
            data: response
        } as ApiResponse<PaginatedResponse<typeof sweets[0]>> );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve sweets'
        } as ApiResponse );
    }
};

export const searchSweets = async (req: AuthRequest, res: Response) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        let query:any = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                query.price.$gte = parseFloat(minPrice as string);
            }

            if (maxPrice) {
                query.price.$lte = parseFloat(maxPrice as string);
            }
        }

        const sweets = await Sweet.find(query).skip(skip).limit(limit);
        const total = await Sweet.countDocuments(query);

        const response: PaginatedResponse<typeof sweets[0]> = {
            data: sweets,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };

        res.json({
            success: true,
            message: 'Search results retrieved successfully',
            data: response
        } as ApiResponse<PaginatedResponse<typeof sweets[0]>> );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed'
        } as ApiResponse ); 
    }
};

export const updateSweet = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const sweet = await Sweet.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            } as ApiResponse );
        }

        res.json({
            success: true,
            message: 'Sweet updated successfully',
            data: sweet
        } as ApiResponse );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update sweet'
        } as ApiResponse );
    }
};

export const deleteSweet = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const sweet = await Sweet.findOneAndDelete({ _id: id });

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            } as ApiResponse );
        }

        res.json({
            success: true,
            message: 'Sweet deleted successfully'
        } as ApiResponse );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete sweet'
        } as ApiResponse )
    }
};

export const purchaseSweet = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity = 1 } = req.body;

        const sweet = await Sweet.findById(id);

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            } as ApiResponse );
        }

        if (sweet.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient quantity in stock'
            } as ApiResponse );
        }

        sweet.quantity -= quantity;
        await sweet.save();

        res.json({
            success: true,
            message: `Successfully purchased ${quantity} ${sweet.name}(s)`,
            data: sweet
        } as ApiResponse );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Purchase failed'
        } as ApiResponse );
    }
};

export const restockSweet = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quantity'
            } as ApiResponse );
        }

        const sweet = await Sweet.findById(id);

        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: 'Sweet not found'
            } as ApiResponse )
        }

        sweet.quantity += quantity;
        await sweet.save();

        res.json({
            success: true,
            message: `Successfully restocked ${quantity} ${sweet.name}(s)`,
            data: sweet
        } as ApiResponse );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Restock failed'
        } as ApiResponse )
    }
};