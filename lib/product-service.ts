import { prisma } from './db';
import { ExchangeRateService } from './exchange-rate-service';
import { config } from '../env.config';
// import { ScrapedProduct } from './scraping-service';
import { zonedTimeToUtc } from 'date-fns-tz';

export class ProductService {
    private exchangeRateService: ExchangeRateService;

    constructor() {
        this.exchangeRateService = new ExchangeRateService();
    }

    // async createProductFromScraped(scrapedProduct: ScrapedProduct): Promise<string> {
    //     try {
    //         // Create or update supplier
    //         const supplier = await this.upsertSupplier(scrapedProduct.supplier);

    //         // Calculate profit margin based on category
    //         const profitMargin = this.getProfitMargin(scrapedProduct.category);

    //         // Create product
    //         const product = await prisma.product.create({
    //         data: {
    //             externalId: scrapedProduct.externalId,
    //             source: scrapedProduct.source,
    //             title: scrapedProduct.title,
    //             description: scrapedProduct.description,
    //             price: scrapedProduct.price,
    //             originalPrice: scrapedProduct.originalPrice,
    //             currency: scrapedProduct.currency,
    //             images: scrapedProduct.images,
    //             category: scrapedProduct.category,
    //             subcategory: scrapedProduct.subcategory,
    //             tags: scrapedProduct.tags,
    //             rating: scrapedProduct.rating,
    //             reviewCount: scrapedProduct.reviewCount,
    //             soldCount: scrapedProduct.soldCount,
    //             minOrderQuantity: scrapedProduct.minOrderQuantity,
    //             maxOrderQuantity: scrapedProduct.maxOrderQuantity,
    //             shippingWeight: scrapedProduct.shippingWeight,
    //             shippingDimensions: scrapedProduct.shippingDimensions,
    //             supplierId: supplier.id,
    //             profitMargin,
    //             lastScraped: new Date(),
    //         },
    //     });

    //         // Create variants if they exist
    //         if (scrapedProduct.variants) {
    //         for (const variant of scrapedProduct.variants) {
    //             await prisma.productVariant.create({
    //             data: {
    //                 productId: product.id,
    //                 name: variant.name,
    //                 value: variant.value,
    //                 price: variant.price,
    //                 stock: variant.stock,
    //                 sku: variant.sku,
    //             },
    //         });
    //     }

    //         // Create localizations for Gulf countries
    //         await this.createGulfLocalizations(product.id, scrapedProduct);

    //         return product.id;
    //     } catch (error) {
    //         console.error('Error creating product from scraped data:', error);
    //         throw error;
    //     }
    // }

    async updateProductPrices(): Promise<void> {
        try {
            const products = await prisma.product.findMany({
                where: { isActive: true },
                include: { localizations: true },
            });

            for (const product of products) {
                await this.updateProductLocalizedPrices(product.id);
            }
        } catch (error) {
            console.error('Error updating product prices:', error);
        }
    }

    async updateProductLocalizedPrices(productId: string): Promise<void> {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: { localizations: true },
            });

            if (!product) return;

            for (const gulfCountry of config.gulfCountries) {
                // Convert price to local currency
                const localPrice = await this.exchangeRateService.convertPrice(
                    product.price,
                    product.currency,
                    gulfCountry.currency
                );

                // Apply profit margin
                const profitMargin = product.profitMargin || config.profitMargins.default;
                const finalPrice = localPrice * (1 + profitMargin / 100);

                // Update or create localization
                await prisma.productLocalization.upsert({
                    where: {
                        productId_locale: {
                            productId,
                            locale: gulfCountry.locale,
                        },
                    },
                    update: {
                        price: finalPrice,
                        currency: gulfCountry.currency,
                    },
                    create: {
                        productId,
                        locale: gulfCountry.locale,
                        title: product.title,
                        description: product.description,
                        price: finalPrice,
                        currency: gulfCountry.currency,
                    },
                });
            }

            // Update main product with Gulf price
            const uaePrice = await this.exchangeRateService.convertPrice(
                product.price,
                product.currency,
                'AED'
            );
            const profitMargin = product.profitMargin || config.profitMargins.default;
            const gulfPrice = uaePrice * (1 + profitMargin / 100);

            await prisma.product.update({
                where: { id: productId },
                data: {
                    gulfPrice,
                    gulfCurrency: 'AED',
                },
            });
        } catch (error) {
            console.error(`Error updating localized prices for product ${productId}:`, error);
        }
    }

    async getProductsByCategory(category: string, locale: string = 'en-AE', page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;

            const products = await prisma.product.findMany({
                where: {
                    category: category.toLowerCase(),
                    isActive: true,
                },
                include: {
                    supplier: true,
                    variants: {
                        where: { isActive: true },
                    },
                    localizations: {
                        where: { locale, isActive: true },
                    },
                },
                skip,
                take: limit,
                orderBy: [
                    { isFeatured: 'desc' },
                    { rating: 'desc' },
                    { soldCount: 'desc' },
                ],
            });

            // Transform products to include localized data
            const transformedProducts = products.map((product: any) => {
                const localization = product.localizations[0];
                return {
                    ...product,
                    title: localization?.title || product.title,
                    description: localization?.description || product.description,
                    price: localization?.price || product.gulfPrice || product.price,
                    currency: localization?.currency || product.gulfCurrency || product.currency,
                    localizations: undefined, // Remove from response
                };
            });

            const total = await prisma.product.count({
                where: {
                    category: category.toLowerCase(),
                    isActive: true,
                },
            });

            return {
                products: transformedProducts,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error('Error getting products by category:', error);
            throw error;
        }
    }

    async getFeaturedProducts(locale: string = 'en-AE', limit: number = 10) {
        try {
            const products = await prisma.product.findMany({
                where: {
                    isFeatured: true,
                    isActive: true,
                },
                include: {
                    supplier: true,
                    variants: {
                        where: { isActive: true },
                    },
                    localizations: {
                        where: { locale, isActive: true },
                    },
                },
                take: limit,
                orderBy: [
                    { rating: 'desc' },
                    { soldCount: 'desc' },
                ],
            });

            return products.map((product: any) => {
                const localization = product.localizations[0];
                return {
                    ...product,
                    title: localization?.title || product.title,
                    description: localization?.description || product.description,
                    price: localization?.price || product.gulfPrice || product.price,
                    currency: localization?.currency || product.gulfCurrency || product.currency,
                    localizations: undefined,
                };
            });
        } catch (error) {
            console.error('Error getting featured products:', error);
            throw error;
        }
    }

    async searchProducts(query: string, locale: string = 'en-AE', page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;

            const products = await prisma.product.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { tags: { hasSome: [query.toLowerCase()] } },
                    ],
                    isActive: true,
                },
                include: {
                    supplier: true,
                    variants: {
                        where: { isActive: true },
                    },
                    localizations: {
                        where: { locale, isActive: true },
                    },
                },
                skip,
                take: limit,
                orderBy: [
                    { isFeatured: 'desc' },
                    { rating: 'desc' },
                    { soldCount: 'desc' },
                ],
            });

            const transformedProducts = products.map((product: any) => {
                const localization = product.localizations[0];
                return {
                    ...product,
                    title: localization?.title || product.title,
                    description: localization?.description || product.description,
                    price: localization?.price || product.gulfPrice || product.price,
                    currency: localization?.currency || product.gulfCurrency || product.currency,
                    localizations: undefined,
                };
            });

            const total = await prisma.product.count({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { tags: { hasSome: [query.toLowerCase()] } },
                    ],
                    isActive: true,
                },
            });

            return {
                products: transformedProducts,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }

    private async upsertSupplier(supplierData: any) {
        return await prisma.supplier.upsert({
            where: { externalId: supplierData.externalId },
            update: {
                name: supplierData.name,
                companyName: supplierData.companyName,
                country: supplierData.country,
                city: supplierData.city,
                rating: supplierData.rating,
                responseRate: supplierData.responseRate,
                responseTime: supplierData.responseTime,
                verified: supplierData.verified,
                goldMember: supplierData.goldMember,
            },
            create: {
                externalId: supplierData.externalId,
                source: supplierData.source || 'unknown',
                name: supplierData.name,
                companyName: supplierData.companyName,
                country: supplierData.country,
                city: supplierData.city,
                rating: supplierData.rating,
                responseRate: supplierData.responseRate,
                responseTime: supplierData.responseTime,
                verified: supplierData.verified,
                goldMember: supplierData.goldMember,
            },
        });
    }

    private getProfitMargin(category?: string): number {
        if (category && config.profitMargins.byCategory[category.toLowerCase()]) {
            return config.profitMargins.byCategory[category.toLowerCase()];
        }
        return config.profitMargins.default;
    }

    // private async createGulfLocalizations(productId: string, scrapedProduct: ScrapedProduct) {
    //     for (const gulfCountry of config.gulfCountries) {
    //         try {
    //         const localPrice = await this.exchangeRateService.convertPrice(
    //             scrapedProduct.price,
    //             scrapedProduct.currency,
    //             gulfCountry.currency
    //         );

    //         const profitMargin = this.getProfitMargin(scrapedProduct.category);
    //         const finalPrice = localPrice * (1 + profitMargin / 100);

    //         await prisma.productLocalization.create({
    //             data: {
    //                 productId,
    //                 locale: gulfCountry.locale,
    //                 title: scrapedProduct.title,
    //                 description: scrapedProduct.description,
    //                 price: finalPrice,
    //                 currency: gulfCountry.currency,
    //             },
    //         });
    //     } catch (error) {
    //         console.error(`Error creating localization for ${gulfCountry.locale}:`, error);
    //     }
    // }
}

export default ProductService;