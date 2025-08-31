import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

export interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription?: string;
    sku: string;
    brand?: string;
    model?: string;
    basePrice: number;
    salePrice?: number;
    costPrice?: number;
    currency: string;
    profitMargin: number;
    stockQuantity: number;
    isActive: boolean;
    categoryId: string;
    subcategoryId?: string;
    images: string;
    averageRating: number;
    reviewCount: number;
    soldCount: number;
    tags: string;
    supplierId?: string;
    externalId?: string;
    source?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    slug: string;
    image?: string;
    isActive: boolean;
    sortOrder: number;
}

export interface Subcategory {
    id: string;
    name: string;
    description?: string;
    slug: string;
    categoryId: string;
    image?: string;
    isActive: boolean;
}

export interface Supplier {
    id: string;
    name: string;
    description?: string;
    rating: number;
    verified: boolean;
    goldMember: boolean;
    country: string;
    responseTime: number;
    minOrderAmount: number;
    logo?: string;
    website?: string;
    contactEmail?: string;
    contactPhone?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: string;
    productId: string;
    reviewerName: string;
    rating: number;
    title?: string;
    content: string;
    helpful: number;
    verified: boolean;
    createdAt: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    createdAt: string;
}

class DatabaseService {
    private db: Database | null = null;
    private static instance: DatabaseService;

    private constructor() { }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public async initialize(): Promise<void> {
        if (this.db) return;

        try {
            const dbPath = path.join(process.cwd(), 'data', 'midostore.db');
            this.db = await open({
                filename: dbPath,
                driver: sqlite3.Database
            });

            console.log('✅ Database service initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize database service:', error);
            throw error;
        }
    }

    public async getProducts(limit: number = 50, offset: number = 0, categoryId?: string): Promise<Product[]> {
        if (!this.db) await this.initialize();

        try {
            let query = `
        SELECT p.*, c.name as categoryName, s.name as supplierName
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        LEFT JOIN suppliers s ON p.supplierId = s.id
        WHERE p.isActive = 1
      `;
            const params: any[] = [];

            if (categoryId) {
                query += ' AND p.categoryId = ?';
                params.push(categoryId);
            }

            query += ' ORDER BY p.averageRating DESC, p.reviewCount DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const products = await this.db!.all(query, params);
            return products.map(this.parseProduct);
        } catch (error) {
            console.error('Error getting products:', error);
            return [];
        }
    }

    public async getProductById(id: string): Promise<Product | null> {
        if (!this.db) await this.initialize();

        try {
            const product = await this.db!.get(`
        SELECT p.*, c.name as categoryName, s.name as supplierName
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        LEFT JOIN suppliers s ON p.supplierId = s.id
        WHERE p.id = ? AND p.isActive = 1
      `, [id]);

            return product ? this.parseProduct(product) : null;
        } catch (error) {
            console.error('Error getting product by id:', error);
            return null;
        }
    }

    public async getCategories(): Promise<Category[]> {
        if (!this.db) await this.initialize();

        try {
            const categories = await this.db!.all(`
        SELECT c.*, COUNT(p.id) as productCount
        FROM categories c
        LEFT JOIN products p ON c.id = p.categoryId AND p.isActive = 1
        WHERE c.isActive = 1
        GROUP BY c.id
        ORDER BY c.sortOrder ASC, c.name ASC
      `);
            return categories;
        } catch (error) {
            console.error('Error getting categories:', error);
            return [];
        }
    }

    public async getSubcategories(categoryId: string): Promise<Subcategory[]> {
        if (!this.db) await this.initialize();

        try {
            const subcategories = await this.db!.all(`
        SELECT s.*, COUNT(p.id) as productCount
        FROM subcategories s
        LEFT JOIN products p ON s.id = p.subcategoryId AND p.isActive = 1
        WHERE s.categoryId = ? AND s.isActive = 1
        GROUP BY s.id
        ORDER BY s.name ASC
      `, [categoryId]);
            return subcategories;
        } catch (error) {
            console.error('Error getting subcategories:', error);
            return [];
        }
    }

    public async getSuppliers(): Promise<Supplier[]> {
        if (!this.db) await this.initialize();

        try {
            const suppliers = await this.db!.all(`
        SELECT s.*, COUNT(p.id) as productCount
        FROM suppliers s
        LEFT JOIN products p ON s.id = p.supplierId AND p.isActive = 1
        GROUP BY s.id
        ORDER BY s.rating DESC, s.verified DESC
      `);
            return suppliers;
        } catch (error) {
            console.error('Error getting suppliers:', error);
            return [];
        }
    }

    public async getReviews(productId: string, limit: number = 20): Promise<Review[]> {
        if (!this.db) await this.initialize();

        try {
            const reviews = await this.db!.all(`
        SELECT * FROM reviews
        WHERE productId = ?
        ORDER BY createdAt DESC
        LIMIT ?
      `, [productId, limit]);
            return reviews;
        } catch (error) {
            console.error('Error getting reviews:', error);
            return [];
        }
    }

    public async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
        if (!this.db) await this.initialize();

        try {
            const searchTerm = `%${query}%`;
            const products = await this.db!.all(`
        SELECT p.*, c.name as categoryName, s.name as supplierName
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        LEFT JOIN suppliers s ON p.supplierId = s.id
        WHERE p.isActive = 1
        AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ? OR p.tags LIKE ?)
        ORDER BY p.averageRating DESC, p.reviewCount DESC
        LIMIT ?
      `, [searchTerm, searchTerm, searchTerm, searchTerm, limit]);

            return products.map(this.parseProduct);
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }

    public async getProductsByCategory(categoryId: string, limit: number = 50): Promise<Product[]> {
        if (!this.db) await this.initialize();

        try {
            const products = await this.db!.all(`
        SELECT p.*, c.name as categoryName, s.name as supplierName
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        LEFT JOIN suppliers s ON p.supplierId = s.id
        WHERE p.categoryId = ? AND p.isActive = 1
        ORDER BY p.averageRating DESC, p.reviewCount DESC
        LIMIT ?
      `, [categoryId, limit]);

            return products.map(this.parseProduct);
        } catch (error) {
            console.error('Error getting products by category:', error);
            return [];
        }
    }

    public async getFeaturedProducts(limit: number = 12): Promise<Product[]> {
        if (!this.db) await this.initialize();

        try {
            const products = await this.db!.all(`
        SELECT p.*, c.name as categoryName, s.name as supplierName
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.id
        LEFT JOIN suppliers s ON p.supplierId = s.id
        WHERE p.isActive = 1 AND p.averageRating >= 4.5
        ORDER BY p.averageRating DESC, p.reviewCount DESC
        LIMIT ?
      `, [limit]);

            return products.map(this.parseProduct);
        } catch (error) {
            console.error('Error getting featured products:', error);
            return [];
        }
    }

    public async getAnalytics(): Promise<any> {
        if (!this.db) await this.initialize();

        try {
            const [totalProducts, totalCategories, totalSuppliers, avgRating] = await Promise.all([
                this.db!.get('SELECT COUNT(*) as count FROM products WHERE isActive = 1'),
                this.db!.get('SELECT COUNT(*) as count FROM categories WHERE isActive = 1'),
                this.db!.get('SELECT COUNT(*) as count FROM suppliers'),
                this.db!.get('SELECT AVG(averageRating) as avg FROM products WHERE isActive = 1 AND averageRating > 0')
            ]);

            const topCategories = await this.db!.all(`
        SELECT c.name, COUNT(p.id) as productCount
        FROM categories c
        LEFT JOIN products p ON c.id = p.categoryId AND p.isActive = 1
        WHERE c.isActive = 1
        GROUP BY c.id
        ORDER BY productCount DESC
        LIMIT 5
      `);

            return {
                totalProducts: totalProducts?.count || 0,
                totalCategories: totalCategories?.count || 0,
                totalSuppliers: totalSuppliers?.count || 0,
                averageRating: avgRating?.avg || 0,
                topCategories
            };
        } catch (error) {
            console.error('Error getting analytics:', error);
            return {
                totalProducts: 0,
                totalCategories: 0,
                totalSuppliers: 0,
                averageRating: 0,
                topCategories: []
            };
        }
    }

    private parseProduct(rawProduct: any): Product {
        return {
            ...rawProduct,
            images: rawProduct.images ? JSON.parse(rawProduct.images) : [],
            tags: rawProduct.tags ? JSON.parse(rawProduct.tags) : [],
            isActive: Boolean(rawProduct.isActive)
        };
    }

    public async close(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }
}

export default DatabaseService;