import clientPromise from './mongodb';

export interface BuyerProduct {
  id: string;
  sellerProductId: string;
  sellerId: string;
  baseProductId: string;
  sellerName: string;
  sellerLogo?: string;
  sellerRating: number;
  productTitle: string;
  productDescription?: string;
  productImages: string[];
  sellingPrice: number;
  currency: string;
  originalPrice?: number;
  discount?: number;
  availableStock: number;
  shippingCost: number;
  estimatedDelivery?: string;
  productRating: number;
  productReviewCount: number;
  isInStock: boolean;
  isFeatured: boolean;
}

export interface ProductComparison {
  baseProductId: string;
  productTitle: string;
  productImages: string[];
  sellers: {
    sellerId: string;
    sellerName: string;
    sellerLogo?: string;
    sellerRating: number;
    sellingPrice: number;
    shippingCost: number;
    totalPrice: number;
    estimatedDelivery?: string;
    availableStock: number;
  }[];
}

export interface BuyerPreferences {
  userId: string;
  preferredCategories: string[];
  preferredPriceRange: {
    min: number;
    max: number;
    currency: string;
  };
  preferredSellers: string[];
  shippingPreferences: {
    freeShipping: boolean;
    maxShippingCost: number;
    preferredDeliveryTime: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default class BuyerService {
  private db: any;
  private sellerProducts: any;
  private sellers: any;
  private baseProducts: any;
  private userInteractions: any;
  private userPreferences: any;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const client = await clientPromise;
      this.db = client.db('midostore');
      this.sellerProducts = this.db.collection('sellerProducts');
      this.sellers = this.db.collection('sellers');
      this.baseProducts = this.db.collection('baseProducts');
      this.userInteractions = this.db.collection('userInteractions');
      this.userPreferences = this.db.collection('userPreferences');
    } catch (error) {
      console.error('Failed to initialize BuyerService:', error);
    }
  }

  // Product Discovery
  async getProductsByCategory(category: string, limit = 50, offset = 0, sortBy = 'popularity'): Promise<BuyerProduct[]> {
    await this.init();

    const pipeline = [
      { $match: { category, isActive: true } },
      { $lookup: { from: 'sellerProducts', localField: 'id', foreignField: 'baseProductId', as: 'sellerProducts' } },
      { $unwind: '$sellerProducts' },
      { $match: { 'sellerProducts.isActive': true } },
      { $lookup: { from: 'sellers', localField: 'sellerProducts.sellerId', foreignField: 'id', as: 'seller' } },
      { $unwind: '$seller' },
      { $match: { 'seller.isActive': true, 'seller.isVerified': true } },
      {
        $project: {
          id: '$sellerProducts.id',
          sellerProductId: '$sellerProducts.id',
          sellerId: '$sellerProducts.sellerId',
          baseProductId: '$id',
          sellerName: '$seller.businessName',
          sellerLogo: '$seller.logo',
          sellerRating: '$seller.averageRating',
          productTitle: { $ifNull: ['$sellerProducts.customTitle', '$title'] },
          productDescription: { $ifNull: ['$sellerProducts.customDescription', '$description'] },
          productImages: { $ifNull: ['$sellerProducts.customImages', '$images'] },
          sellingPrice: '$sellerProducts.sellingPrice',
          currency: '$sellerProducts.currency',
          originalPrice: '$basePrice',
          discount: {
            $cond: {
              if: { $gt: ['$basePrice', '$sellerProducts.sellingPrice'] },
              then: { $multiply: [{ $divide: [{ $subtract: ['$basePrice', '$sellerProducts.sellingPrice'] }, '$basePrice'] }, 100] },
              else: 0
            }
          },
          availableStock: '$sellerProducts.availableStock',
          shippingCost: '$sellerProducts.shippingCost',
          estimatedDelivery: '$sellerProducts.estimatedDelivery',
          productRating: '$rating',
          productReviewCount: '$reviewCount',
          isInStock: { $gt: ['$sellerProducts.availableStock', 0] },
          isFeatured: '$sellerProducts.isFeatured'
        }
      }
    ];

    // Add sorting
    switch (sortBy) {
      case 'price_low':
        pipeline.push({ $sort: { sellingPrice: 1 } });
        break;
      case 'price_high':
        pipeline.push({ $sort: { sellingPrice: -1 } });
        break;
      case 'rating':
        pipeline.push({ $sort: { productRating: -1 } });
        break;
      case 'newest':
        pipeline.push({ $sort: { 'sellerProducts.createdAt': -1 } });
        break;
      default: // popularity
        pipeline.push({ $sort: { soldCount: -1, productRating: -1 } });
    }

    pipeline.push({ $skip: offset }, { $limit: limit });

    return await this.baseProducts.aggregate(pipeline).toArray();
  }

  async searchProducts(query: string, limit = 50, offset = 0): Promise<BuyerProduct[]> {
    await this.init();

    const pipeline = [
      {
        $match: {
          isActive: true,
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        }
      },
      { $lookup: { from: 'sellerProducts', localField: 'id', foreignField: 'baseProductId', as: 'sellerProducts' } },
      { $unwind: '$sellerProducts' },
      { $match: { 'sellerProducts.isActive': true } },
      { $lookup: { from: 'sellers', localField: 'sellerProducts.sellerId', foreignField: 'id', as: 'seller' } },
      { $unwind: '$seller' },
      { $match: { 'seller.isActive': true, 'seller.isVerified': true } },
      {
        $project: {
          id: '$sellerProducts.id',
          sellerProductId: '$sellerProducts.id',
          sellerId: '$sellerProducts.sellerId',
          baseProductId: '$id',
          sellerName: '$seller.businessName',
          sellerLogo: '$seller.logo',
          sellerRating: '$seller.averageRating',
          productTitle: { $ifNull: ['$sellerProducts.customTitle', '$title'] },
          productDescription: { $ifNull: ['$sellerProducts.customDescription', '$description'] },
          productImages: { $ifNull: ['$sellerProducts.customImages', '$images'] },
          sellingPrice: '$sellerProducts.sellingPrice',
          currency: '$sellerProducts.currency',
          originalPrice: '$basePrice',
          discount: {
            $cond: {
              if: { $gt: ['$basePrice', '$sellerProducts.sellingPrice'] },
              then: { $multiply: [{ $divide: [{ $subtract: ['$basePrice', '$sellerProducts.sellingPrice'] }, '$basePrice'] }, 100] },
              else: 0
            }
          },
          availableStock: '$sellerProducts.availableStock',
          shippingCost: '$sellerProducts.shippingCost',
          estimatedDelivery: '$sellerProducts.estimatedDelivery',
          productRating: '$rating',
          productReviewCount: '$reviewCount',
          isInStock: { $gt: ['$sellerProducts.availableStock', 0] },
          isFeatured: '$sellerProducts.isFeatured'
        }
      },
      { $sort: { productRating: -1, soldCount: -1 } },
      { $skip: offset },
      { $limit: limit }
    ];

    return await this.baseProducts.aggregate(pipeline).toArray();
  }

  async getProductComparison(baseProductId: string): Promise<ProductComparison | null> {
    await this.init();

    const baseProduct = await this.baseProducts.findOne({ id: baseProductId });
    if (!baseProduct) return null;

    const sellerProducts = await this.sellerProducts
      .find({ baseProductId, isActive: true })
      .toArray();

    if (sellerProducts.length === 0) return null;

    const sellerIds = sellerProducts.map(sp => sp.sellerId);
    const sellers = await this.sellers
      .find({ id: { $in: sellerIds }, isActive: true, isVerified: true })
      .toArray();

    const sellerMap = new Map(sellers.map(s => [s.id, s]));

    const comparison: ProductComparison = {
      baseProductId,
      productTitle: baseProduct.title,
      productImages: baseProduct.images,
      sellers: sellerProducts
        .filter(sp => sellerMap.has(sp.sellerId))
        .map(sp => {
          const seller = sellerMap.get(sp.sellerId)!;
          return {
            sellerId: sp.sellerId,
            sellerName: seller.businessName,
            sellerLogo: seller.logo,
            sellerRating: seller.averageRating,
            sellingPrice: sp.sellingPrice,
            shippingCost: sp.shippingCost,
            totalPrice: sp.sellingPrice + sp.shippingCost,
            estimatedDelivery: sp.estimatedDelivery,
            availableStock: sp.availableStock
          };
        })
        .sort((a, b) => a.totalPrice - b.totalPrice)
    };

    return comparison;
  }

  async getFeaturedProducts(limit = 20): Promise<BuyerProduct[]> {
    await this.init();

    const pipeline = [
      { $lookup: { from: 'sellerProducts', localField: 'id', foreignField: 'baseProductId', as: 'sellerProducts' } },
      { $unwind: '$sellerProducts' },
      { $match: { 'sellerProducts.isActive': true, 'sellerProducts.isFeatured': true } },
      { $lookup: { from: 'sellers', localField: 'sellerProducts.sellerId', foreignField: 'id', as: 'seller' } },
      { $unwind: '$seller' },
      { $match: { 'seller.isActive': true, 'seller.isVerified': true } },
      {
        $project: {
          id: '$sellerProducts.id',
          sellerProductId: '$sellerProducts.id',
          sellerId: '$sellerProducts.sellerId',
          baseProductId: '$id',
          sellerName: '$seller.businessName',
          sellerLogo: '$seller.logo',
          sellerRating: '$seller.averageRating',
          productTitle: { $ifNull: ['$sellerProducts.customTitle', '$title'] },
          productDescription: { $ifNull: ['$sellerProducts.customDescription', '$description'] },
          productImages: { $ifNull: ['$sellerProducts.customImages', '$images'] },
          sellingPrice: '$sellerProducts.sellingPrice',
          currency: '$sellerProducts.currency',
          originalPrice: '$basePrice',
          discount: {
            $cond: {
              if: { $gt: ['$basePrice', '$sellerProducts.sellingPrice'] },
              then: { $multiply: [{ $divide: [{ $subtract: ['$basePrice', '$sellerProducts.sellingPrice'] }, '$basePrice'] }, 100] },
              else: 0
            }
          },
          availableStock: '$sellerProducts.availableStock',
          shippingCost: '$sellerProducts.shippingCost',
          estimatedDelivery: '$sellerProducts.estimatedDelivery',
          productRating: '$rating',
          productReviewCount: '$reviewCount',
          isInStock: { $gt: ['$sellerProducts.availableStock', 0] },
          isFeatured: true
        }
      },
      { $sort: { 'sellerProducts.createdAt': -1 } },
      { $limit: limit }
    ];

    return await this.baseProducts.aggregate(pipeline).toArray();
  }

  async getProductsBySeller(sellerId: string, limit = 50, offset = 0): Promise<BuyerProduct[]> {
    await this.init();

    const seller = await this.sellers.findOne({ id: sellerId, isActive: true, isVerified: true });
    if (!seller) return [];

    const pipeline = [
      { $match: { sellerId, isActive: true } },
      { $lookup: { from: 'baseProducts', localField: 'baseProductId', foreignField: 'id', as: 'baseProduct' } },
      { $unwind: '$baseProduct' },
      { $match: { 'baseProduct.isActive': true } },
      {
        $project: {
          id: '$id',
          sellerProductId: '$id',
          sellerId: '$sellerId',
          baseProductId: '$baseProductId',
          sellerName: seller.businessName,
          sellerLogo: seller.logo,
          sellerRating: seller.averageRating,
          productTitle: { $ifNull: ['$customTitle', '$baseProduct.title'] },
          productDescription: { $ifNull: ['$customDescription', '$baseProduct.description'] },
          productImages: { $ifNull: ['$customImages', '$baseProduct.images'] },
          sellingPrice: '$sellingPrice',
          currency: '$currency',
          originalPrice: '$baseProduct.basePrice',
          discount: {
            $cond: {
              if: { $gt: ['$baseProduct.basePrice', '$sellingPrice'] },
              then: { $multiply: [{ $divide: [{ $subtract: ['$baseProduct.basePrice', '$sellingPrice'] }, '$baseProduct.basePrice'] }, 100] },
              else: 0
            }
          },
          availableStock: '$availableStock',
          shippingCost: '$shippingCost',
          estimatedDelivery: '$estimatedDelivery',
          productRating: '$baseProduct.rating',
          productReviewCount: '$baseProduct.reviewCount',
          isInStock: { $gt: ['$availableStock', 0] },
          isFeatured: '$isFeatured'
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: limit }
    ];

    return await this.sellerProducts.aggregate(pipeline).toArray();
  }

  // User Interactions
  async recordInteraction(userId: string, baseProductId: string, type: 'VIEW' | 'LIKE' | 'CART' | 'PURCHASE'): Promise<void> {
    await this.init();

    // Record user interaction
    await this.userInteractions.updateOne(
      { userId, baseProductId, type },
      { $set: { timestamp: new Date() } },
      { upsert: true }
    );

    // Update product metrics if it's a seller product
    if (type === 'VIEW') {
      const sellerProduct = await this.sellerProducts.findOne({ baseProductId });
      if (sellerProduct) {
        await this.sellerProducts.updateOne(
          { id: sellerProduct.id },
          { $inc: { views: 1 } }
        );
      }
    }
  }

  async getRecommendedProducts(userId: string, limit = 20): Promise<BuyerProduct[]> {
    await this.init();

    // Get user's interaction history
    const userInteractions = await this.userInteractions
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    if (userInteractions.length === 0) {
      return await this.getFeaturedProducts(limit);
    }

    // Get categories and products the user has interacted with
    const interactedProductIds = userInteractions.map(ui => ui.baseProductId);
    const interactedProducts = await this.baseProducts
      .find({ id: { $in: interactedProductIds } })
      .toArray();

    const preferredCategories = [...new Set(interactedProducts.map(p => p.category))];

    // Get recommended products from preferred categories
    const pipeline = [
      { $match: { category: { $in: preferredCategories }, isActive: true } },
      { $lookup: { from: 'sellerProducts', localField: 'id', foreignField: 'baseProductId', as: 'sellerProducts' } },
      { $unwind: '$sellerProducts' },
      { $match: { 'sellerProducts.isActive': true } },
      { $lookup: { from: 'sellers', localField: 'sellerProducts.sellerId', foreignField: 'id', as: 'seller' } },
      { $unwind: '$seller' },
      { $match: { 'seller.isActive': true, 'seller.isVerified': true } },
      {
        $project: {
          id: '$sellerProducts.id',
          sellerProductId: '$sellerProducts.id',
          sellerId: '$sellerProducts.sellerId',
          baseProductId: '$id',
          sellerName: '$seller.businessName',
          sellerLogo: '$seller.logo',
          sellerRating: '$seller.averageRating',
          productTitle: { $ifNull: ['$sellerProducts.customTitle', '$title'] },
          productDescription: { $ifNull: ['$sellerProducts.customDescription', '$description'] },
          productImages: { $ifNull: ['$sellerProducts.customImages', '$images'] },
          sellingPrice: '$sellerProducts.sellingPrice',
          currency: '$sellerProducts.currency',
          originalPrice: '$basePrice',
          discount: {
            $cond: {
              if: { $gt: ['$basePrice', '$sellerProducts.sellingPrice'] },
              then: { $multiply: [{ $divide: [{ $subtract: ['$basePrice', '$sellerProducts.sellingPrice'] }, '$basePrice'] }, 100] },
              else: 0
            }
          },
          availableStock: '$sellerProducts.availableStock',
          shippingCost: '$sellerProducts.shippingCost',
          estimatedDelivery: '$sellerProducts.estimatedDelivery',
          productRating: '$rating',
          productReviewCount: '$reviewCount',
          isInStock: { $gt: ['$sellerProducts.availableStock', 0] },
          isFeatured: '$sellerProducts.isFeatured'
        }
      },
      { $sort: { productRating: -1, soldCount: -1 } },
      { $limit: limit }
    ];

    return await this.baseProducts.aggregate(pipeline).toArray();
  }

  // User Preferences
  async getUserPreferences(userId: string): Promise<BuyerPreferences | null> {
    await this.init();
    return await this.userPreferences.findOne({ userId });
  }

  async updateUserPreferences(userId: string, preferences: Partial<BuyerPreferences>): Promise<boolean> {
    await this.init();
    const result = await this.userPreferences.updateOne(
      { userId },
      { $set: { ...preferences, updatedAt: new Date() } },
      { upsert: true }
    );
    return result.modifiedCount > 0 || result.upsertedCount > 0;
  }

  // Utility methods
  async getCategories(): Promise<string[]> {
    await this.init();
    const categories = await this.baseProducts.distinct('category', { isActive: true });
    return categories.filter(Boolean);
  }

  async getTopSellers(limit = 10): Promise<any[]> {
    await this.init();
    return await this.sellers
      .find({ isActive: true, isVerified: true })
      .sort({ totalSales: -1, averageRating: -1 })
      .limit(limit)
      .toArray();
  }
}