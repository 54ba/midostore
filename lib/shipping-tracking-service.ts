// @ts-nocheck
import { prisma } from './db';
import envConfig from '../env.config';

export interface TrackingInfo {
    trackingNumber: string;
    carrier: string;
    status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'returned';
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    currentLocation?: string;
    events: TrackingEvent[];
    lastUpdated: Date;
}

export interface TrackingEvent {
    timestamp: Date;
    status: string;
    location: string;
    description: string;
    carrier: string;
}

export interface ShippingCarrier {
    code: string;
    name: string;
    trackingUrl: string;
    apiEndpoint?: string;
    supportedCountries: string[];
    estimatedDays: { min: number; max: number };
    features: string[];
}

export interface ShippingRate {
    carrier: string;
    service: string;
    price: number;
    currency: string;
    estimatedDays: number;
    features: string[];
    trackingIncluded: boolean;
}

export class ShippingTrackingService {
    private carriers: ShippingCarrier[] = [
        {
            code: 'dhl',
            name: 'DHL Express',
            trackingUrl: 'https://www.dhl.com/tracking?id=',
            apiEndpoint: 'https://api-eu.dhl.com/track/shipments',
            supportedCountries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'US', 'GB', 'DE', 'FR', 'CN', 'JP'],
            estimatedDays: { min: 1, max: 5 },
            features: ['express', 'tracking', 'insurance', 'signature'],
        },
        {
            code: 'fedex',
            name: 'FedEx',
            trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=',
            apiEndpoint: 'https://api.fedex.com/track/v1/trackingnumbers',
            supportedCountries: ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'IT', 'ES', 'AE', 'SA'],
            estimatedDays: { min: 2, max: 7 },
            features: ['express', 'tracking', 'insurance', 'signature'],
        },
        {
            code: 'ups',
            name: 'UPS',
            trackingUrl: 'https://www.ups.com/track?tracknum=',
            apiEndpoint: 'https://onlinetools.ups.com/track/v1/details',
            supportedCountries: ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'IT', 'ES', 'AE'],
            estimatedDays: { min: 3, max: 10 },
            features: ['ground', 'air', 'tracking', 'insurance'],
        },
        {
            code: 'aramex',
            name: 'Aramex',
            trackingUrl: 'https://www.aramex.com/track/results?ShipmentNumber=',
            apiEndpoint: 'https://ws.aramex.net/ShippingAPI.V2/Tracking/Service_1_0.svc/json',
            supportedCountries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'JO', 'LB', 'EG'],
            estimatedDays: { min: 2, max: 6 },
            features: ['regional', 'tracking', 'cod', 'insurance'],
        },
        {
            code: 'emirates_post',
            name: 'Emirates Post',
            trackingUrl: 'https://www.epg.gov.ae/track-and-trace?trackingNumber=',
            supportedCountries: ['AE'],
            estimatedDays: { min: 1, max: 3 },
            features: ['local', 'tracking', 'cod'],
        },
        {
            code: 'saudi_post',
            name: 'Saudi Post',
            trackingUrl: 'https://splonline.com.sa/en/tracking-shipment?trackingNumber=',
            supportedCountries: ['SA'],
            estimatedDays: { min: 1, max: 4 },
            features: ['local', 'tracking', 'cod'],
        },
        {
            code: 'china_post',
            name: 'China Post',
            trackingUrl: 'http://www.ems.com.cn/mailtracking/you_jian_cha_xun.html?mailNum=',
            supportedCountries: ['CN', 'HK', 'TW'],
            estimatedDays: { min: 7, max: 21 },
            features: ['economy', 'tracking'],
        },
        {
            code: 'singapore_post',
            name: 'Singapore Post',
            trackingUrl: 'https://www.singpost.com/track-items?trackingNumber=',
            supportedCountries: ['SG', 'MY', 'TH', 'ID'],
            estimatedDays: { min: 3, max: 12 },
            features: ['regional', 'tracking', 'registered'],
        },
    ];

    // Track shipment
    async trackShipment(trackingNumber: string, carrier?: string): Promise<TrackingInfo | null> {
        try {
            // If carrier not specified, try to detect from tracking number format
            if (!carrier) {
                carrier = this.detectCarrier(trackingNumber);
            }

            if (!carrier) {
                throw new Error('Unable to detect carrier from tracking number');
            }

            // Get tracking info from carrier API
            const trackingInfo = await this.getTrackingFromCarrier(trackingNumber, carrier);

            if (trackingInfo) {
                // Update database
                await this.updateTrackingInDatabase(trackingInfo);
                return trackingInfo;
            }

            return null;
        } catch (error) {
            console.error('Error tracking shipment:', error);
            return null;
        }
    }

    // Get shipping rates
    async getShippingRates(
        fromCountry: string,
        toCountry: string,
        weight: number,
        dimensions: { length: number; width: number; height: number },
        value: number
    ): Promise<ShippingRate[]> {
        try {
            const rates: ShippingRate[] = [];

            // Get rates from each carrier
            for (const carrier of this.carriers) {
                if (carrier.supportedCountries.includes(toCountry)) {
                    const rate = await this.getCarrierRate(
                        carrier.code,
                        fromCountry,
                        toCountry,
                        weight,
                        dimensions,
                        value
                    );
                    if (rate) {
                        rates.push(rate);
                    }
                }
            }

            // Sort by price
            return rates.sort((a, b) => a.price - b.price);
        } catch (error) {
            console.error('Error getting shipping rates:', error);
            return [];
        }
    }

    // Create shipment
    async createShipment(
        orderId: string,
        carrier: string,
        service: string,
        fromAddress: any,
        toAddress: any,
        packageInfo: any
    ): Promise<{ trackingNumber: string; labelUrl?: string; cost: number }> {
        try {
            // Create shipment with carrier API
            const shipment = await this.createCarrierShipment(
                carrier,
                service,
                fromAddress,
                toAddress,
                packageInfo
            );

            if (shipment) {
                // Save shipment to database
                await prisma.shipment.create({
                    data: {
                        orderId,
                        trackingNumber: shipment.trackingNumber,
                        carrier,
                        service,
                        status: 'pending',
                        cost: shipment.cost,
                        labelUrl: shipment.labelUrl,
                        fromAddress,
                        toAddress,
                        packageInfo,
                        createdAt: new Date(),
                    },
                });

                return shipment;
            }

            throw new Error('Failed to create shipment');
        } catch (error) {
            console.error('Error creating shipment:', error);
            throw error;
        }
    }

    // Update all active shipments
    async updateAllShipments(): Promise<void> {
        try {
            const activeShipments = await prisma.shipment.findMany({
                where: {
                    status: {
                        notIn: ['delivered', 'returned', 'cancelled'],
                    },
                },
            });

            for (const shipment of activeShipments) {
                try {
                    const trackingInfo = await this.trackShipment(
                        shipment.trackingNumber,
                        shipment.carrier
                    );

                    if (trackingInfo) {
                        await prisma.shipment.update({
                            where: { id: shipment.id },
                            data: {
                                status: trackingInfo.status,
                                currentLocation: trackingInfo.currentLocation,
                                estimatedDelivery: trackingInfo.estimatedDelivery,
                                actualDelivery: trackingInfo.actualDelivery,
                                lastUpdated: new Date(),
                            },
                        });

                        // Send notifications for status changes
                        if (trackingInfo.status !== shipment.status) {
                            await this.sendStatusNotification(shipment.orderId, trackingInfo);
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to update shipment ${shipment.trackingNumber}:`, error);
                }
            }
        } catch (error) {
            console.error('Error updating all shipments:', error);
        }
    }

    // Get supported carriers
    getSupportedCarriers(): ShippingCarrier[] {
        return this.carriers;
    }

    // Get carrier by code
    getCarrier(code: string): ShippingCarrier | null {
        return this.carriers.find(c => c.code === code) || null;
    }

    // Private helper methods
    private detectCarrier(trackingNumber: string): string | null {
        // DHL: 10-11 digits
        if (/^\d{10,11}$/.test(trackingNumber)) {
            return 'dhl';
        }

        // FedEx: 12-14 digits
        if (/^\d{12,14}$/.test(trackingNumber)) {
            return 'fedex';
        }

        // UPS: 1Z followed by 16 characters
        if (/^1Z[A-Z0-9]{16}$/.test(trackingNumber)) {
            return 'ups';
        }

        // Aramex: Starts with letters followed by numbers
        if (/^[A-Z]{2,3}\d{8,12}[A-Z]{2}$/.test(trackingNumber)) {
            return 'aramex';
        }

        // China Post: 13 characters starting with letters
        if (/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(trackingNumber)) {
            return 'china_post';
        }

        return null;
    }

    private async getTrackingFromCarrier(
        trackingNumber: string,
        carrier: string
    ): Promise<TrackingInfo | null> {
        try {
            switch (carrier) {
                case 'dhl':
                    return await this.getDHLTracking(trackingNumber);
                case 'fedex':
                    return await this.getFedExTracking(trackingNumber);
                case 'ups':
                    return await this.getUPSTracking(trackingNumber);
                case 'aramex':
                    return await this.getAramexTracking(trackingNumber);
                default:
                    return await this.getGenericTracking(trackingNumber, carrier);
            }
        } catch (error) {
            console.error(`Error getting tracking from ${carrier}:`, error);
            return null;
        }
    }

    private async getDHLTracking(trackingNumber: string): Promise<TrackingInfo | null> {
        try {
            const response = await fetch(
                `https://api-eu.dhl.com/track/shipments?trackingNumber=${trackingNumber}`,
                {
                    headers: {
                        'DHL-API-Key': process.env.DHL_API_KEY || '',
                    },
                }
            );

            const data = await response.json();

            if (data.shipments && data.shipments.length > 0) {
                const shipment = data.shipments[0];
                const events = shipment.events?.map((event: any) => ({
                    timestamp: new Date(event.timestamp),
                    status: event.statusCode,
                    location: event.location?.address?.addressLocality || '',
                    description: event.description,
                    carrier: 'dhl',
                })) || [];

                return {
                    trackingNumber,
                    carrier: 'dhl',
                    status: this.mapDHLStatus(shipment.status?.statusCode),
                    estimatedDelivery: shipment.estimatedDeliveryDate ?
                        new Date(shipment.estimatedDeliveryDate) : undefined,
                    currentLocation: shipment.status?.location?.address?.addressLocality,
                    events,
                    lastUpdated: new Date(),
                };
            }

            return null;
        } catch (error) {
            console.error('Error getting DHL tracking:', error);
            return null;
        }
    }

    private async getFedExTracking(trackingNumber: string): Promise<TrackingInfo | null> {
        try {
            // Mock implementation - would integrate with FedEx API
            return {
                trackingNumber,
                carrier: 'fedex',
                status: 'in_transit',
                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                currentLocation: 'Memphis, TN',
                events: [
                    {
                        timestamp: new Date(),
                        status: 'in_transit',
                        location: 'Memphis, TN',
                        description: 'In transit',
                        carrier: 'fedex',
                    },
                ],
                lastUpdated: new Date(),
            };
        } catch (error) {
            console.error('Error getting FedEx tracking:', error);
            return null;
        }
    }

    private async getUPSTracking(trackingNumber: string): Promise<TrackingInfo | null> {
        try {
            // Mock implementation - would integrate with UPS API
            return {
                trackingNumber,
                carrier: 'ups',
                status: 'in_transit',
                estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                currentLocation: 'Louisville, KY',
                events: [
                    {
                        timestamp: new Date(),
                        status: 'in_transit',
                        location: 'Louisville, KY',
                        description: 'Package is in transit',
                        carrier: 'ups',
                    },
                ],
                lastUpdated: new Date(),
            };
        } catch (error) {
            console.error('Error getting UPS tracking:', error);
            return null;
        }
    }

    private async getAramexTracking(trackingNumber: string): Promise<TrackingInfo | null> {
        try {
            // Mock implementation - would integrate with Aramex API
            return {
                trackingNumber,
                carrier: 'aramex',
                status: 'picked_up',
                estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                currentLocation: 'Dubai, UAE',
                events: [
                    {
                        timestamp: new Date(),
                        status: 'picked_up',
                        location: 'Dubai, UAE',
                        description: 'Package picked up',
                        carrier: 'aramex',
                    },
                ],
                lastUpdated: new Date(),
            };
        } catch (error) {
            console.error('Error getting Aramex tracking:', error);
            return null;
        }
    }

    private async getGenericTracking(
        trackingNumber: string,
        carrier: string
    ): Promise<TrackingInfo | null> {
        try {
            // Generic tracking using 17track API
            const response = await fetch('https://api.17track.net/track/v2.2/gettrackinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    '17token': process.env.TRACK17_API_KEY || '',
                },
                body: JSON.stringify([{
                    number: trackingNumber,
                    carrier: carrier,
                }]),
            });

            const data = await response.json();

            if (data.data && data.data.accepted && data.data.accepted.length > 0) {
                const track = data.data.accepted[0];

                return {
                    trackingNumber,
                    carrier,
                    status: this.mapGenericStatus(track.track?.latest_status?.status),
                    currentLocation: track.track?.latest_status?.location,
                    events: track.track?.checkpoints?.map((checkpoint: any) => ({
                        timestamp: new Date(checkpoint.time_iso),
                        status: checkpoint.status,
                        location: checkpoint.location,
                        description: checkpoint.message,
                        carrier,
                    })) || [],
                    lastUpdated: new Date(),
                };
            }

            return null;
        } catch (error) {
            console.error('Error getting generic tracking:', error);
            return null;
        }
    }

    private async getCarrierRate(
        carrier: string,
        fromCountry: string,
        toCountry: string,
        weight: number,
        dimensions: any,
        value: number
    ): Promise<ShippingRate | null> {
        try {
            const carrierInfo = this.getCarrier(carrier);
            if (!carrierInfo) return null;

            // Calculate base rate (simplified calculation)
            let baseRate = 20; // Base rate in USD

            // Add weight-based pricing
            baseRate += weight * 5;

            // Add distance-based pricing
            if (!carrierInfo.supportedCountries.includes(fromCountry)) {
                baseRate += 10; // International surcharge
            }

            // Add service-specific pricing
            if (carrierInfo.features.includes('express')) {
                baseRate *= 1.5;
            }

            return {
                carrier: carrierInfo.name,
                service: carrierInfo.features[0] || 'standard',
                price: Math.round(baseRate * 100) / 100,
                currency: 'USD',
                estimatedDays: Math.floor((carrierInfo.estimatedDays.min + carrierInfo.estimatedDays.max) / 2),
                features: carrierInfo.features,
                trackingIncluded: carrierInfo.features.includes('tracking'),
            };
        } catch (error) {
            console.error(`Error getting ${carrier} rate:`, error);
            return null;
        }
    }

    private async createCarrierShipment(
        carrier: string,
        service: string,
        fromAddress: any,
        toAddress: any,
        packageInfo: any
    ): Promise<{ trackingNumber: string; labelUrl?: string; cost: number } | null> {
        try {
            // Mock implementation - would integrate with carrier APIs
            const trackingNumber = this.generateTrackingNumber(carrier);

            return {
                trackingNumber,
                labelUrl: `https://labels.example.com/${trackingNumber}.pdf`,
                cost: 25.99,
            };
        } catch (error) {
            console.error('Error creating carrier shipment:', error);
            return null;
        }
    }

    private generateTrackingNumber(carrier: string): string {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();

        switch (carrier) {
            case 'dhl':
                return timestamp.substring(-10);
            case 'fedex':
                return timestamp.substring(-12);
            case 'ups':
                return `1Z${random}${timestamp.substring(-10)}`;
            case 'aramex':
                return `${random}${timestamp.substring(-8)}AE`;
            default:
                return `${carrier.toUpperCase()}${timestamp.substring(-10)}`;
        }
    }

    private mapDHLStatus(status: string): TrackingInfo['status'] {
        const statusMap: Record<string, TrackingInfo['status']> = {
            'pre-transit': 'pending',
            'transit': 'in_transit',
            'delivered': 'delivered',
            'exception': 'exception',
            'unknown': 'pending',
        };

        return statusMap[status] || 'pending';
    }

    private mapGenericStatus(status: string): TrackingInfo['status'] {
        const statusMap: Record<string, TrackingInfo['status']> = {
            'InfoReceived': 'pending',
            'InTransit': 'in_transit',
            'OutForDelivery': 'out_for_delivery',
            'Delivered': 'delivered',
            'Exception': 'exception',
            'Expired': 'returned',
        };

        return statusMap[status] || 'pending';
    }

    private async updateTrackingInDatabase(trackingInfo: TrackingInfo): Promise<void> {
        try {
            await prisma.trackingInfo.upsert({
                where: { trackingNumber: trackingInfo.trackingNumber },
                update: {
                    status: trackingInfo.status,
                    currentLocation: trackingInfo.currentLocation,
                    estimatedDelivery: trackingInfo.estimatedDelivery,
                    actualDelivery: trackingInfo.actualDelivery,
                    events: trackingInfo.events,
                    lastUpdated: trackingInfo.lastUpdated,
                },
                create: {
                    trackingNumber: trackingInfo.trackingNumber,
                    carrier: trackingInfo.carrier,
                    status: trackingInfo.status,
                    currentLocation: trackingInfo.currentLocation,
                    estimatedDelivery: trackingInfo.estimatedDelivery,
                    actualDelivery: trackingInfo.actualDelivery,
                    events: trackingInfo.events,
                    lastUpdated: trackingInfo.lastUpdated,
                },
            });
        } catch (error) {
            console.error('Error updating tracking in database:', error);
        }
    }

    private async sendStatusNotification(orderId: string, trackingInfo: TrackingInfo): Promise<void> {
        try {
            // This would integrate with notification service
            console.log(`Sending notification for order ${orderId}: ${trackingInfo.status}`);

            // Could send email, SMS, or push notification
            // await notificationService.send({
            //   orderId,
            //   type: 'shipping_update',
            //   data: trackingInfo,
            // });
        } catch (error) {
            console.error('Error sending status notification:', error);
        }
    }
}

export default ShippingTrackingService;