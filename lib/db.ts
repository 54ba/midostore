// Simplified database with in-memory data for Netlify deployment
// This avoids SQLite dependencies that cause build issues

// Mock data for products
const mockProducts = [
  {
    id: "prod-1",
    name: "iPhone 15 Pro Max - 256GB",
    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.",
    shortDescription: "Premium smartphone with cutting-edge technology",
    sku: "IPH15PM-256",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    basePrice: 1199.99,
    salePrice: 1099.99,
    costPrice: 899.99,
    profitMargin: 25.0,
    stockQuantity: 150,
    categoryId: "cat-1",
    subcategoryId: "sub-1",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"
    ]),
    averageRating: 4.9,
    reviewCount: 234,
    soldCount: 567,
    tags: JSON.stringify(["smartphone", "apple", "iphone", "5g", "camera", "premium"]),
    supplierId: "sup-1",
    externalId: "ALI001",
    source: "alibaba",
    categoryName: "Electronics",
    supplierName: "TechCorp Global",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock data for categories
const mockCategories = [
  { id: "cat-1", name: "Electronics", description: "Latest electronic devices and gadgets", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop", isActive: 1, sortOrder: 0 },
  { id: "cat-2", name: "Fashion", description: "Trendy clothing and accessories", slug: "fashion", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop", isActive: 1, sortOrder: 1 }
];

// Database operations using in-memory data
export const getProducts = async (limit = 20, offset = 0, categoryId?: string) => {
  try {
    let products = [...mockProducts];
    
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }
    
    return products.slice(offset, offset + limit);
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    return mockProducts.find(p => p.id === id) || null;
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    return mockCategories.filter(c => c.isActive === 1);
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};

export const getSubcategories = async (categoryId: string) => {
  try {
    return [];
  } catch (error) {
    console.error("Error getting subcategories:", error);
    return [];
  }
};

export const getAdCampaigns = async (userId?: string) => {
  try {
    return [];
  } catch (error) {
    console.error("Error getting ad campaigns:", error);
    return [];
  }
};

export const getSocialMediaAccounts = async (ownerId?: string) => {
  try {
    return [];
  } catch (error) {
    console.error("Error getting social media accounts:", error);
    return [];
  }
};

export const getP2PListings = async (status = "ACTIVE") => {
  try {
    return [];
  } catch (error) {
    console.error("Error getting P2P listings:", error);
    return [];
  }
};

export const searchProducts = async (query: string, limit = 20) => {
  try {
    const searchTerm = query.toLowerCase();
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm)
    ).slice(0, limit);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

// Mock database client for compatibility
let prisma: any = null;

// Initialize immediately if not in browser
if (typeof window === "undefined") {
  console.log("✅ In-memory database initialized successfully");
  prisma = { isMock: true };
}

// Export database client
export { prisma };

// Export database status
export const isRealDatabase = () => prisma !== null;
export const databaseType = () => {
  if (!prisma) return "Not initialized";
  return "In-Memory Mock Data";
};

// Export default
export default prisma;
