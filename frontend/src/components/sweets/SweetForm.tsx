import React, { useState, useEffect } from "react";
import type { Sweet } from "../../types";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";

interface SweetFormProps {
  sweet?: Sweet;
  onSubmit: (sweetData: Partial<Sweet>) => Promise<void>;
  onCancel: () => void;
}

export const SweetForm: React.FC<SweetFormProps> = ({
  sweet,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "chocolate" as Sweet["category"],
    price: 0,
    quantity: 0,
    description: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        description: sweet.description || "",
        imageUrl: sweet.imageUrl || "",
      });
    }
  }, [sweet]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.quantity < 0)
      newErrors.quantity = "Quantity cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <Input
        label="Sweet Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter sweet name"
        required
      />

      <div>
        <label className="block text-sm font-medium text-cocoa mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-raspberry focus:border-raspberry"
        >
          <option value="chocolate">Chocolate</option>
          <option value="gummy">Gummy</option>
          <option value="hard-candy">Hard Candy</option>
          <option value="lollipop">Lollipop</option>
          <option value="fudge">Fudge</option>
          <option value="toffee">Toffee</option>
          <option value="mint">Mint</option>
          <option value="nougat">Nougat</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="0.00"
          required
        />

        <Input
          label="Quantity"
          name="quantity"
          type="number"
          min="0"
          value={formData.quantity}
          onChange={handleChange}
          error={errors.quantity}
          placeholder="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cocoa mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-raspberry focus:border-raspberry"
          placeholder="Enter sweet description (optional)"
        />
      </div>

      <Input
        label="Image URL"
        name="imageUrl"
        type="url"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg (optional)"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {sweet ? "Update Sweet" : "Create Sweet"}
        </Button>
      </div>
    </form>
  );
};
