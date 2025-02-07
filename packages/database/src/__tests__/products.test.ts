import {
  getProductBySlug,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../admin/products";
import { ProductModel } from "../models/product";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  jest,
  describe,
  beforeAll,
  it,
  afterAll,
  beforeEach,
  expect,
} from "@jest/globals";
jest.mock<typeof ProductModel>("../models/product");

describe("Product Service", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    jest.clearAllMocks();
  });

  describe("getProductBySlug", () => {
    it("should return a product when given a valid slug", async () => {
      const mockProduct = {
        name: "Test Product",
        slug: "test-product",
        description: "Test description",
        price: 100,
      };

      (ProductModel.findOne as jest.Mock).mockResolvedValue(mockProduct);

      const product = await getProductBySlug("test-product");

      expect(ProductModel.findOne).toHaveBeenCalledWith({
        slug: "test-product",
      });
      expect(product).toEqual(mockProduct);
    });

    it("should throw an error when the product is not found", async () => {
      (ProductModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getProductBySlug("non-existent-slug")).rejects.toThrow(
        "Product not found"
      );

      expect(ProductModel.findOne).toHaveBeenCalledWith({
        slug: "non-existent-slug",
      });
    });

    it("should throw an error if ProductModel.findOne throws an error", async () => {
      const mockError = new Error("Database error");
      (ProductModel.findOne as jest.Mock).mockRejectedValue(mockError);

      await expect(getProductBySlug("test-slug")).rejects.toThrow(mockError);
    });
  });

  describe("getProducts", () => {
    it("should return a list of products", async () => {
      const mockProducts = [
        {
          name: "Product 1",
          slug: "product-1",
          description: "Description 1",
          price: 100,
        },
        {
          name: "Product 2",
          slug: "product-2",
          description: "Description 2",
          price: 200,
        },
      ];

      (ProductModel.find as jest.Mock).mockResolvedValue(mockProducts);

      const products = await getProducts();

      expect(ProductModel.find).toHaveBeenCalled();
      expect(products).toEqual(mockProducts);
    });

    it("should throw an error if ProductModel.find throws an error", async () => {
      const mockError = new Error("Database error");
      (ProductModel.find as jest.Mock).mockRejectedValue(mockError);

      await expect(getProducts()).rejects.toThrow(mockError);
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product and return it", async () => {
      const mockProduct = {
        name: "Test Product",
        slug: "test-product",
        description: "Test description",
        price: 100,
      };

      (ProductModel.findOneAndDelete as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const product = await deleteProduct("test-product");

      expect(ProductModel.findOneAndDelete).toHaveBeenCalledWith({
        slug: "test-product",
      });
      expect(product).toEqual(mockProduct);
    });

    it("should throw an error if ProductModel.findOneAndDelete throws an error", async () => {
      const mockError = new Error("Database error");
      (ProductModel.findOneAndDelete as jest.Mock).mockRejectedValue(mockError);

      await expect(deleteProduct("test-product")).rejects.toThrow(mockError);
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const mockProduct = {
        name: "Test Product",
        slug: "test-product",
        description: "Test description",
        price: 100,
      };

      (ProductModel.create as jest.Mock).mockResolvedValue(mockProduct);

      const product = await createProduct({
        name: "Test Product",
        description: "Test description",
        price: 100,
      });

      expect(ProductModel.create).toHaveBeenCalledWith({
        name: "Test Product",
        description: "Test description",
        price: 100,
        slug: "test-product",
      });
      expect(product).toEqual(mockProduct);
    });

    it("should throw an error if ProductModel.create throws an error", async () => {
      const mockError = new Error("Database error");
      (ProductModel.create as jest.Mock).mockRejectedValue(mockError);

      await expect(
        createProduct({
          name: "Test Product",
          description: "Test description",
          price: 100,
        })
      ).rejects.toThrow(mockError);
    });
  });

  describe("updateProduct", () => {
    it("should update a product and return it", async () => {
      const mockProduct = {
        name: "Updated Product",
        slug: "test-product",
        description: "Updated description",
        price: 150,
      };

      (ProductModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const product = await updateProduct("test-product", {
        name: "Updated Product",
        description: "Updated description",
        price: 150,
      });

      expect(ProductModel.findOneAndUpdate).toHaveBeenCalledWith(
        { slug: "test-product" },
        {
          name: "Updated Product",
          description: "Updated description",
          price: 150,
        },
        { new: true }
      );
      expect(product).toEqual(mockProduct);
    });

    it("should throw an error if the product is not found", async () => {
      (ProductModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        updateProduct("non-existent-slug", {
          name: "Updated Product",
          description: "Updated description",
          price: 150,
        })
      ).rejects.toThrow("Product not found");
    });

    it("should throw an error if ProductModel.findOneAndUpdate throws an error", async () => {
      const mockError = new Error("Database error");
      (ProductModel.findOneAndUpdate as jest.Mock).mockRejectedValue(mockError);

      await expect(
        updateProduct("test-product", {
          name: "Updated Product",
          description: "Updated description",
          price: 150,
        })
      ).rejects.toThrow(mockError);
    });
  });
});
