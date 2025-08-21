import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createAIScrapingService } from '@/lib/ai-powered-scraping-factory';

// Dynamic import to avoid webpack issues during build
let scrapingService: any = null;

async function getScrapingService() {
    if (!scrapingService) {
        scrapingService = await createAIScrapingService(prisma);
    }
    return scrapingService;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, config, sessionId } = body;

        switch (action) {
            case 'start':
                return await handleStartScraping(config);
            case 'pause':
                return await handlePauseSession(sessionId);
            case 'resume':
                return await handleResumeSession(sessionId);
            case 'stop':
                return await handleStopSession(sessionId);
            case 'status':
                return await handleGetStatus(sessionId);
            case 'sessions':
                return await handleGetAllSessions();
            default:
                return NextResponse.json(
                    { error: 'Invalid action. Must be one of: start, pause, resume, stop, status, sessions' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error in AI-powered scraping API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleStartScraping(config: any) {
    try {
        // Validate configuration
        if (!config.source || !config.category || !config.pageCount) {
            return NextResponse.json(
                { error: 'Missing required configuration: source, category, pageCount' },
                { status: 400 }
            );
        }

        // Validate source
        const validSources = ['alibaba', 'aliexpress', 'amazon', 'ebay', 'custom'];
        if (!validSources.includes(config.source)) {
            return NextResponse.json(
                { error: `Invalid source. Must be one of: ${validSources.join(', ')}` },
                { status: 400 }
            );
        }

        // Validate page count
        if (config.pageCount < 1 || config.pageCount > 100) {
            return NextResponse.json(
                { error: 'Page count must be between 1 and 100' },
                { status: 400 }
            );
        }

        // Create scraping job in database
        const job = await prisma.scrapingJob.create({
            data: {
                source: config.source,
                category: config.category,
                status: 'pending',
                totalProducts: 0,
                scrapedProducts: 0,
                failedProducts: 0,
                metadata: {
                    aiFeatures: config.aiFeatures,
                    automation: config.automation,
                    quality: config.quality,
                    pageCount: config.pageCount,
                },
            },
        });

        // Start AI-powered scraping session
        const service = await getScrapingService();
        const sessionId = await service.startScrapingSession(config);

        // Update job with session ID
        await prisma.scrapingJob.update({
            where: { id: job.id },
            data: {
                status: 'running',
                startedAt: new Date(),
                metadata: {
                    ...job.metadata,
                    sessionId,
                },
            },
        });

        return NextResponse.json({
            success: true,
            sessionId,
            jobId: job.id,
            message: 'AI-powered scraping session started successfully',
        });
    } catch (error) {
        console.error('Error starting AI scraping session:', error);
        return NextResponse.json(
            { error: 'Failed to start scraping session' },
            { status: 500 }
        );
    }
}

async function handlePauseSession(sessionId: string) {
    try {
        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        const service = await getScrapingService();
        const success = service.pauseSession(sessionId);

        if (success) {
            // Update job status in database
            await prisma.scrapingJob.updateMany({
                where: {
                    metadata: { path: ['sessionId'], equals: sessionId }
                },
                data: { status: 'paused' },
            });

            return NextResponse.json({
                success: true,
                message: 'Session paused successfully',
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to pause session' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error pausing session:', error);
        return NextResponse.json(
            { error: 'Failed to pause session' },
            { status: 500 }
        );
    }
}

async function handleResumeSession(sessionId: string) {
    try {
        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        const service = await getScrapingService();
        const success = service.resumeSession(sessionId);

        if (success) {
            // Update job status in database
            await prisma.scrapingJob.updateMany({
                where: {
                    metadata: { path: ['sessionId'], equals: sessionId }
                },
                data: { status: 'running' },
            });

            return NextResponse.json({
                success: true,
                message: 'Session resumed successfully',
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to resume session' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error resuming session:', error);
        return NextResponse.json(
            { error: 'Failed to resume session' },
            { status: 500 }
        );
    }
}

async function handleStopSession(sessionId: string) {
    try {
        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        const service = await getScrapingService();
        const success = service.stopSession(sessionId);

        if (success) {
            // Update job status in database
            await prisma.scrapingJob.updateMany({
                where: {
                    metadata: { path: ['sessionId'], equals: sessionId }
                },
                data: {
                    status: 'failed',
                    completedAt: new Date(),
                    error: 'Session stopped by user',
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Session stopped successfully',
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to stop session' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error stopping session:', error);
        return NextResponse.json(
            { error: 'Failed to stop session' },
            { status: 500 }
        );
    }
}

async function handleGetStatus(sessionId: string) {
    try {
        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        const service = await getScrapingService();
        const session = service.getSessionStatus(sessionId);

        if (session) {
            return NextResponse.json({
                success: true,
                session,
            });
        } else {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error getting session status:', error);
        return NextResponse.json(
            { error: 'Failed to get session status' },
            { status: 500 }
        );
    }
}

async function handleGetAllSessions() {
    try {
        const service = await getScrapingService();
        const sessions = service.getAllSessions();

        return NextResponse.json({
            success: true,
            sessions,
            total: sessions.length,
        });
    } catch (error) {
        console.error('Error getting all sessions:', error);
        return NextResponse.json(
            { error: 'Failed to get sessions' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (sessionId) {
            return await handleGetStatus(sessionId);
        } else {
            return await handleGetAllSessions();
        }
    } catch (error) {
        console.error('Error in AI-powered scraping GET API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}