import { prisma } from './db'
import { z } from 'zod'

// Dropshipping schemas
const ProductSourceSchema = z.object({
    name: z.string(),
    url: z.string().url(),
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
    categories: z.array(z.string()),
    countries: z.array(z.string()),
    minOrderValue: z.number().optional(),
    maxOrderValue: z.number().optional(),
    leadTime: z.number(), // Days
    shippingCost: z.number().optional(),
    profitMargin: z.number().default(25),
    isActive: z.boolean().default(true),
})

const SupplierProductSchema = z.object({
    externalId: z.string(),
    supplierId: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    currency: z.string().length(3),
    stock: z.number().nonnegative(),
    images: z.array(z.string().url()),
    variants: z.array(z.object({
        name: z.string(),
        value: z.string(),
        price: z.number().optional(),
        stock: z.number().optional(),
    })).optional(),
    specifications: z.record(z.string(), z.any()).optional(),
    shipping: z.object({
        weight: z.number().optional(),
        dimensions: z.object({
            length: z.number().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
        }).optional(),
        methods: z.array(z.object({
            name: z.string(),
            cost: z.number(),
            time: z.number(), // Days
        })),
    }),
    category: z.string(),
    tags: z.array(z.string()).optional(),
})

const DropshippingOrderSchema = z.object({
    orderId: string,
    supplierId: string,
    products: z.array(z.object({
        externalId: string,
        quantity: z.number().positive(),
        variantId: z.string().optional(),
    })),
    customerInfo: z.object({
        name: string,
        email: string,
        phone: string,
        address: z.object({
            street: string,
            city: string,
            state: string,
            postalCode: string,
            country: string,
        }),
    }),
    shippingMethod: string,
    specialInstructions: z.string().optional(),
})

export class EnhancedDropshippingService {
    private sources: Map<string, z.infer<typeof ProductSourceSchema>>

    constructor() {
        this.sources = new Map()
        this.initializeSources()
    }

    /**
     * Initialize dropshipping sources
     */
    private async initializeSources() {
        try {
            // Load sources from database
            const sources = await prisma.supplier.findMany({
                where: { isDropshipper: true }
            })

            sources.forEach(source => {
                this.sources.set(source.id, {
                    name: source.name,
                    url: source.website || '',
                    apiKey: '', // Would be stored securely
                    apiSecret: '', // Would be stored securely
                    categories: [], // Would be loaded from source
                    countries: [source.country],
                    minOrderValue: source.minOrderValue || 0,
                    maxOrderValue: source.maxOrderValue || 999999,
                    leadTime: source.leadTime || 7,
                    shippingCost: 0,
                    profitMargin: 25,
                    isActive: source.isActive
                })
            })

            // Add default sources if none exist
            if (this.sources.size === 0) {
                this.addDefaultSources()
            }
        } catch (error) {
            console.error('Failed to initialize dropshipping sources:', error)
            this.addDefaultSources()
        }
    }

    /**
     * Add default dropshipping sources
     */
    private addDefaultSources() {
        const defaultSources = [
            {
                id: 'alibaba',
                name: 'Alibaba',
                url: 'https://www.alibaba.com',
                categories: ['electronics', 'clothing', 'home', 'beauty', 'sports'],
                countries: ['CN'],
                minOrderValue: 100,
                maxOrderValue: 100000,
                leadTime: 7,
                shippingCost: 50,
                profitMargin: 20,
                isActive: true
            },
            {
                id: 'aliexpress',
                name: 'AliExpress',
                url: 'https://www.aliexpress.com',
                categories: ['electronics', 'clothing', 'home', 'beauty', 'sports'],
                countries: ['CN'],
                minOrderValue: 1,
                maxOrderValue: 10000,
                leadTime: 15,
                shippingCost: 10,
                profitMargin: 30,
                isActive: true
            },
            {
                id: 'amazon',
                name: 'Amazon',
                url: 'https://www.amazon.com',
                categories: ['electronics', 'clothing', 'home', 'beauty', 'sports'],
                countries: ['US', 'UK', 'DE', 'FR', 'IT', 'ES'],
                minOrderValue: 25,
                maxOrderValue: 50000,
                leadTime: 3,
                shippingCost: 0,
                profitMargin: 15,
                isActive: true
            },
            {
                id: 'ebay',
                name: 'eBay',
                url: 'https://www.ebay.com',
                categories: ['electronics', 'clothing', 'home', 'beauty', 'sports'],
                countries: ['US', 'UK', 'DE', 'FR', 'IT', 'ES'],
                minOrderValue: 1,
                maxOrderValue: 25000,
                leadTime: 5,
                shippingCost: 5,
                profitMargin: 25,
                isActive: true
            }
        ]

        defaultSources.forEach(source => {
            this.sources.set(source.id, source)
        })
    }

    /**
     * Search for products across all sources
     */
    async searchProducts(query: string, filters: {
        category?: string
        minPrice?: number
        maxPrice?: number
        source?: string
        country?: string
        inStock?: boolean
    } = {}): Promise<z.infer<typeof SupplierProductSchema>[]> {
        try {
            const results: z.infer<typeof SupplierProductSchema>[] = []

            for (const [sourceId, source] of this.sources) {
                if (!source.isActive) continue

                if (filters.source && filters.source !== sourceId) continue

                try {
                    const sourceProducts = await this.searchSource(sourceId, query, filters)
                    results.push(...sourceProducts)
                } catch (error) {
                    console.warn(`Failed to search source ${sourceId}:`, error)
                }
            }

            // Sort by relevance and price
            return results.sort((a, b) => {
                // Priority: in stock, then price
                if (a.stock > 0 && b.stock === 0) return -1
                if (a.stock === 0 && b.stock > 0) return 1
                return a.price - b.price
            })

        } catch (error) {
            console.error('Product search error:', error)
            return []
        }
    }

    /**
     * Search a specific source for products
     */
    private async searchSource(
        sourceId: string,
        query: string,
        filters: any
    ): Promise<z.infer<typeof SupplierProductSchema>[]> {
        const source = this.sources.get(sourceId)
        if (!source) return []

        try {
            switch (sourceId) {
                case 'alibaba':
                    return await this.searchAlibaba(query, filters, source)
                case 'aliexpress':
                    return await this.searchAliExpress(query, filters, source)
                case 'amazon':
                    return await this.searchAmazon(query, filters, source)
                case 'ebay':
                    return await this.searchEbay(query, filters, source)
                default:
                    return await this.searchGenericSource(query, filters, source)
            }
        } catch (error) {
            console.error(`Failed to search ${sourceId}:`, error)
            return []
        }
    }

    /**
     * Search Alibaba for products
     */
    private async searchAlibaba(
        query: string,
        filters: any,
        source: z.infer<typeof ProductSourceSchema>
    ): Promise<z.infer<typeof SupplierProductSchema>[]> {
        // In a real implementation, this would use Alibaba's API
        // For now, we'll return mock data
        const mockProducts: z.infer<typeof SupplierProductSchema>[] = [
            {
                externalId: `alibaba_${Date.now()}_1`,
                supplierId: 'alibaba',
                name: `${query} - Premium Quality`,
                description: `High-quality ${query} sourced directly from manufacturers`,
                price: Math.random() * 100 + 10,
                currency: 'USD',
                stock: Math.floor(Math.random() * 1000),
                images: [`https://via.placeholder.com/300x300?text=${encodeURIComponent(query)}`],
                variants: [
                    { name: 'Size', value: 'Large', price: 5 },
                    { name: 'Color', value: 'Black', price: 0 }
                ],
                specifications: {
                    'Material': 'Premium',
                    'Warranty': '1 Year',
                    'Origin': 'China'
                },
                shipping: {
                    weight: 0.5,
                    dimensions: { length: 20, width: 15, height: 10 },
                    methods: [
                        { name: 'Standard', cost: 15, time: 7 },
                        { name: 'Express', cost: 35, time: 3 }
                    ]
                },
                category: filters.category || 'general',
                tags: [query, 'premium', 'wholesale']
            }
        ]

        return mockProducts.filter(product => {
            if (filters.minPrice && product.price < filters.minPrice) return false
            if (filters.maxPrice && product.price > filters.maxPrice) return false
            if (filters.inStock && product.stock === 0) return false
            return true
        })
    }

    /**
     * Search AliExpress for products
     */
    private async searchAliExpress(
        query: string,
        filters: any,
        source: z.infer<typeof ProductSourceSchema>
    ): Promise<z.infer<typeof SupplierProductSchema>[]> {
        // Mock AliExpress search
        const mockProducts: z.infer<typeof SupplierProductSchema>[] = [
            {
                externalId: `aliexpress_${Date.now()}_1`,
                supplierId: 'aliexpress',
                name: `${query} - Best Seller`,
                description: `Popular ${query} with great reviews`,
                price: Math.random() * 50 + 5,
                currency: 'USD',
                stock: Math.floor(Math.random() * 500),
                images: [`https://via.placeholder.com/300x300?text=${encodeURIComponent(query)}`],
                variants: [
                    { name: 'Size', value: 'Medium', price: 2 },
                    { name: 'Color', value: 'White', price: 0 }
                ],
                specifications: {
                    'Rating': '4.5+ Stars',
                    'Reviews': '1000+',
                    'Shipping': 'Free'
                },
                shipping: {
                    weight: 0.3,
                    dimensions: { length: 15, width: 12, height: 8 },
                    methods: [
                        { name: 'Free Shipping', cost: 0, time: 15 },
                        { name: 'DHL', cost: 25, time: 7 }
                    ]
                },
                category: filters.category || 'general',
                tags: [query, 'bestseller', 'freeshipping']
            }
        ]

        return mockProducts.filter(product => {
            if (filters.minPrice && product.price < filters.minPrice) return false
            if (filters.maxPrice && product.price > filters.maxPrice) return false
            if (filters.inStock && product.stock === 0) return false
            return true
        })
    }

    /**
     * Search Amazon for products
     */
    private async searchAmazon(
        query: string,
        filters: any,
        source: z.infer<typeof ProductSourceSchema>
    ): Promise<z.infer<typeof SupplierProductSchema>[]> {
        // Mock Amazon search
        const mockProducts: z.infer<typeof SupplierProductSchema>[] = [
            {
                externalId: `amazon_${Date.now()}_1`,
                supplierId: 'amazon',
                name: `${query} - Amazon Choice`,
                description: `Amazon's choice for ${query}`,
                price: Math.random() * 200 + 20,
                currency: 'USD',
                stock: Math.floor(Math.random() * 200),
                images: [`https://via.placeholder.com/300x300?text=${encodeURIComponent(query)}`],
                variants: [
                    { name: 'Size', value: 'Standard', price: 0 },
                    { name: 'Color', value: 'Multi', price: 0 }
                ],
                specifications: {
                    'Prime': 'Yes',
                    'Rating': '4.8 Stars',
                    'Fastest': 'Same Day'
                },
                shipping: {
                    weight: 1.0,
                    dimensions: { length: 25, width: 20, height: 15 },
                    methods: [
                        { name: 'Prime', cost: 0, time: 1 },
                        { name: 'Standard', cost: 8, time: 3 }
                    ]
                },
                category: filters.category || 'general',
                tags: [query, 'amazonchoice', 'prime']
            }
        ]

        return mockProducts.filter(product => {
            if (filters.minPrice && product.price < filters.minPrice) return false
            if (filters.maxPrice && product.price > filters.maxPrice) return false
            if (filters.inStock && product.stock === 0) return false
            return true
        })
    }

    /**
     * Search eBay for products
     */
    private async searchEbay(
        query: string,
        filters: any,
        source: z.infer<typeof ProductSourceSchema>
    ): Promise<z.infer<typeof SupplierProductSchema>[]> {
        // Mock eBay search
        const mockProducts: z.infer<typeof SupplierProductSchema>[] = [
            {
                externalId: `ebay_${Date.now()}_1`,
                supplierId: 'ebay',
                name: `${query} - Auction`,
                description: `Great deal on ${query}`,
                price: Math.random() * 150 + 15,
                currency: 'USD',
                stock: Math.floor(Math.random() * 100),
                images: [`https://via.placeholder.com/300x300?text=${encodeURIComponent(query)}`],
                variants: [
                    { name: 'Condition', value: 'New', price: 0 },
                    { name: 'Brand', value: 'Generic', price: 0 }
                ],
                specifications: {
                    'Condition': 'New',
                    'Returns': '30 Days',
                    'Shipping': 'Calculated'
                },
                shipping: {
                    weight: 0.8,
                    dimensions: { length: 22, width: 18, height: 12 },
                    methods: [
                        { name: 'Standard', cost: 12, time: 5 },
                        { name: 'Expedited', cost: 28, time: 2 }
                    ]
                },
                category: filters.category || 'general',
                tags: [query, 'auction', 'greatdeal']
            }
        ]

        return mockProducts.filter(product => {
            if (filters.minPrice && product.price < filters.minPrice) return false
            if (filters.maxPrice && product.price > filters.maxPrice) return false
            if (filters.inStock && product.stock === 0) return false
            return true
        })
    }

    /**
     * Search generic source for products
     */
    private async searchGenericSource(
        query: string,
        filters: any,
        source: z.infer<typeof ProductSourceSchema>
    ): Promise<z.infer<typeof SupplierProductSchema>[]> {
        // Generic search implementation
        return []
    }

    /**
     * Create a dropshipping order
     */
    async createDropshippingOrder(orderData: z.infer<typeof DropshippingOrderSchema>): Promise<{
        success: boolean
        orderId: string
        supplierOrderId?: string
        estimatedDelivery: Date
        totalCost: number
        error?: string
    }> {
        try {
            const validatedData = DropshippingOrderSchema.parse(orderData)

            // Validate supplier
            const supplier = await prisma.supplier.findUnique({
                where: { id: validatedData.supplierId }
            })

            if (!supplier || !supplier.isDropshipper) {
                throw new Error('Invalid supplier or supplier not a dropshipper')
            }

            // Calculate total cost and delivery
            let totalCost = 0
            let maxLeadTime = 0

            for (const product of validatedData.products) {
                // Get product details from supplier
                const supplierProduct = await this.getSupplierProduct(
                    validatedData.supplierId,
                    product.externalId
                )

                if (!supplierProduct) {
                    throw new Error(`Product ${product.externalId} not found`)
                }

                if (supplierProduct.stock < product.quantity) {
                    throw new Error(`Insufficient stock for product ${product.externalId}`)
                }

                totalCost += supplierProduct.price * product.quantity
                maxLeadTime = Math.max(maxLeadTime, supplier.leadTime || 7)
            }

            // Add shipping cost
            const shippingCost = this.calculateShippingCost(validatedData.shippingMethod, supplier)
            totalCost += shippingCost

            // Create supplier order
            const supplierOrder = await this.createSupplierOrder(validatedData, totalCost)

            // Create local order record
            const localOrder = await prisma.order.create({
                data: {
                    orderNumber: `DS-${Date.now()}`,
                    userId: 'SYSTEM', // System user for dropshipping orders
                    status: 'PENDING',
                    customerEmail: validatedData.customerInfo.email,
                    customerName: validatedData.customerInfo.name,
                    customerPhone: validatedData.customerInfo.phone,
                    billingAddressId: 'SYSTEM',
                    shippingAddressId: 'SYSTEM',
                    subtotal: totalCost - shippingCost,
                    taxAmount: 0,
                    shippingAmount: shippingCost,
                    discountAmount: 0,
                    totalAmount: totalCost,
                    currency: 'USD',
                    paymentStatus: 'PENDING',
                    internalNotes: `Dropshipping order from ${supplier.name}`
                }
            })

            // Create order items
            for (const product of validatedData.products) {
                await prisma.orderItem.create({
                    data: {
                        orderId: localOrder.id,
                        productName: `Dropshipped Product`,
                        productSku: product.externalId,
                        quantity: product.quantity,
                        unitPrice: 0, // Will be updated when supplier confirms
                        totalPrice: 0,
                        isDropshipped: true,
                        supplierId: validatedData.supplierId,
                        supplierOrderId: supplierOrder.orderId
                    }
                })
            }

            // Create shipment record
            const estimatedDelivery = new Date()
            estimatedDelivery.setDate(estimatedDelivery.getDate() + maxLeadTime)

            await prisma.shipment.create({
                data: {
                    orderId: localOrder.id,
                    userId: 'SYSTEM',
                    supplierId: validatedData.supplierId,
                    trackingNumber: `DS-${Date.now()}`,
                    carrier: supplier.name,
                    service: validatedData.shippingMethod,
                    status: 'PENDING',
                    estimatedDelivery
                }
            })

            return {
                success: true,
                orderId: localOrder.id,
                supplierOrderId: supplierOrder.orderId,
                estimatedDelivery,
                totalCost
            }

        } catch (error) {
            console.error('Dropshipping order creation error:', error)
            return {
                success: false,
                orderId: '',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    /**
     * Get product details from supplier
     */
    private async getSupplierProduct(
        supplierId: string,
        externalId: string
    ): Promise<z.infer<typeof SupplierProductSchema> | null> {
        // In a real implementation, this would fetch from supplier's API
        // For now, return mock data
        return {
            externalId,
            supplierId,
            name: 'Mock Product',
            description: 'Mock product description',
            price: 25.99,
            currency: 'USD',
            stock: 100,
            images: ['https://via.placeholder.com/300x300'],
            variants: [],
            specifications: {},
            shipping: {
                weight: 0.5,
                dimensions: { length: 20, width: 15, height: 10 },
                methods: [
                    { name: 'Standard', cost: 10, time: 7 },
                    { name: 'Express', cost: 25, time: 3 }
                ]
            },
            category: 'general',
            tags: []
        }
    }

    /**
     * Create order with supplier
     */
    private async createSupplierOrder(
        orderData: z.infer<typeof DropshippingOrderSchema>,
        totalCost: number
    ): Promise<{ orderId: string }> {
        // In a real implementation, this would create an order with the supplier
        // For now, return a mock order ID
        return {
            orderId: `SUPPLIER_${Date.now()}`
        }
    }

    /**
     * Calculate shipping cost
     */
    private calculateShippingCost(
        shippingMethod: string,
        supplier: any
    ): number {
        // Basic shipping cost calculation
        const baseCost = supplier.shippingCost || 10

        switch (shippingMethod.toLowerCase()) {
            case 'express':
                return baseCost * 2
            case 'standard':
                return baseCost
            case 'economy':
                return baseCost * 0.7
            default:
                return baseCost
        }
    }

    /**
     * Get available dropshipping sources
     */
    getAvailableSources(): Array<{ id: string; name: string; categories: string[]; countries: string[] }> {
        return Array.from(this.sources.entries()).map(([id, source]) => ({
            id,
            name: source.name,
            categories: source.categories,
            countries: source.countries
        }))
    }

    /**
     * Get source details
     */
    getSourceDetails(sourceId: string): z.infer<typeof ProductSourceSchema> | null {
        return this.sources.get(sourceId) || null
    }

    /**
     * Update source configuration
     */
    async updateSource(sourceId: string, updates: Partial<z.infer<typeof ProductSourceSchema>>): Promise<boolean> {
        try {
            const source = this.sources.get(sourceId)
            if (!source) return false

            // Update local source
            this.sources.set(sourceId, { ...source, ...updates })

            // Update database if supplier exists
            await prisma.supplier.updateMany({
                where: { id: sourceId },
                data: {
                    isDropshipper: updates.isActive !== undefined ? updates.isActive : true,
                    minOrderValue: updates.minOrderValue,
                    maxOrderValue: updates.maxOrderValue,
                    leadTime: updates.leadTime,
                    isActive: updates.isActive
                }
            })

            return true
        } catch (error) {
            console.error('Failed to update source:', error)
            return false
        }
    }

    /**
     * Get dropshipping analytics
     */
    async getAnalytics(): Promise<{
        totalOrders: number
        totalRevenue: number
        averageOrderValue: number
        topSuppliers: Array<{ name: string; orders: number; revenue: number }>
        topCategories: Array<{ name: string; orders: number; revenue: number }>
    }> {
        try {
            // Get orders from database
            const orders = await prisma.order.findMany({
                where: { internalNotes: { contains: 'Dropshipping' } },
                include: { items: true }
            })

            const totalOrders = orders.length
            const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

            // Get supplier statistics
            const supplierStats = await prisma.orderItem.groupBy({
                by: ['supplierId'],
                where: { isDropshipped: true },
                _count: { id: true },
                _sum: { totalPrice: true }
            })

            const topSuppliers = await Promise.all(
                supplierStats.slice(0, 5).map(async (stat) => {
                    const supplier = await prisma.supplier.findUnique({
                        where: { id: stat.supplierId || '' }
                    })
                    return {
                        name: supplier?.name || 'Unknown',
                        orders: stat._count.id,
                        revenue: stat._sum.totalPrice || 0
                    }
                })
            )

            // Get category statistics
            const categoryStats = await prisma.orderItem.groupBy({
                by: ['productSku'],
                where: { isDropshipped: true },
                _count: { id: true },
                _sum: { totalPrice: true }
            })

            const topCategories = categoryStats.slice(0, 5).map(stat => ({
                name: 'General',
                orders: stat._count.id,
                revenue: stat._sum.totalPrice || 0
            }))

            return {
                totalOrders,
                totalRevenue,
                averageOrderValue,
                topSuppliers,
                topCategories
            }

        } catch (error) {
            console.error('Failed to get dropshipping analytics:', error)
            return {
                totalOrders: 0,
                totalRevenue: 0,
                averageOrderValue: 0,
                topSuppliers: [],
                topCategories: []
            }
        }
    }
}

export default EnhancedDropshippingService