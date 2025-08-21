import { NextRequest, NextResponse } from 'next/server';
import ShippingTrackingService from '@/lib/shipping-tracking-service';

const shippingService = new ShippingTrackingService();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const trackingNumber = searchParams.get('trackingNumber');
        const carrier = searchParams.get('carrier');

        switch (action) {
            case 'carriers':
                return NextResponse.json({
                    success: true,
                    data: shippingService.getSupportedCarriers(),
                });

            case 'track':
                if (!trackingNumber) {
                    return NextResponse.json(
                        { error: 'Tracking number is required' },
                        { status: 400 }
                    );
                }

                const trackingInfo = await shippingService.trackShipment(
                    trackingNumber,
                    carrier || undefined
                );

                if (!trackingInfo) {
                    return NextResponse.json(
                        { error: 'Tracking information not found' },
                        { status: 404 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    data: trackingInfo,
                });

            case 'carrier-info':
                if (!carrier) {
                    return NextResponse.json(
                        { error: 'Carrier code is required' },
                        { status: 400 }
                    );
                }

                const carrierInfo = shippingService.getCarrier(carrier);
                if (!carrierInfo) {
                    return NextResponse.json(
                        { error: 'Carrier not found' },
                        { status: 404 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    data: carrierInfo,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in shipping GET:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case 'get-rates':
                const { fromCountry, toCountry, weight, dimensions, value } = data;

                if (!fromCountry || !toCountry || !weight) {
                    return NextResponse.json(
                        { error: 'From country, to country, and weight are required' },
                        { status: 400 }
                    );
                }

                const rates = await shippingService.getShippingRates(
                    fromCountry,
                    toCountry,
                    weight,
                    dimensions || { length: 10, width: 10, height: 10 },
                    value || 0
                );

                return NextResponse.json({
                    success: true,
                    data: rates,
                });

            case 'create-shipment':
                const { orderId, carrier, service, fromAddress, toAddress, packageInfo } = data;

                if (!orderId || !carrier || !service || !fromAddress || !toAddress || !packageInfo) {
                    return NextResponse.json(
                        { error: 'All shipment details are required' },
                        { status: 400 }
                    );
                }

                const shipment = await shippingService.createShipment(
                    orderId,
                    carrier,
                    service,
                    fromAddress,
                    toAddress,
                    packageInfo
                );

                return NextResponse.json({
                    success: true,
                    data: shipment,
                });

            case 'update-all-shipments':
                await shippingService.updateAllShipments();

                return NextResponse.json({
                    success: true,
                    message: 'All shipments updated successfully',
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in shipping POST:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}