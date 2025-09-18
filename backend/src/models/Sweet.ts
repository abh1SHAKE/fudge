import mongoose, { Document, Schema } from 'mongoose';

export interface ISweet extends Document {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const sweetSchema = new Schema<ISweet>({
    name: {
        type: String,
        required: [true, 'Sweet name is required'],
        trim: true,
        maxlength: [64, 'Sweet name cannot exceed 64 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['chocolate', 'gummy', 'hard-candy', 'lollipop', 'fudge', 'toffee', 'mint', 'nougat', 'other'],
        lowercase: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price cannot be zero or negative']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    imageUrl: {
        type: String,
    }
}, {
    timestamps: true
});

// Indexes for search functionality
sweetSchema.index({ name: 'text', category: 'text' });
sweetSchema.index({ price: 1 });

export default mongoose.model<ISweet>('Sweet', sweetSchema);