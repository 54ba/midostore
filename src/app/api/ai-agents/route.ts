import { NextRequest, NextResponse } from 'next/server';
import MongoDBService from '@/lib/mongodb-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');

        const dbService = MongoDBService.getInstance();
        await dbService.initialize();

        let agents;

        if (type && status) {
            agents = await dbService.getAIAgents(type);
            agents = agents.filter(agent => agent.status === status);
        } else if (type) {
            agents = await dbService.getAIAgents(type);
        } else if (status) {
            agents = await dbService.getAIAgents();
            agents = agents.filter(agent => agent.status === status);
        } else {
            agents = await dbService.getAIAgents();
        }

        return NextResponse.json({
            success: true,
            data: agents
        });
    } catch (error) {
        console.error('Error fetching AI agents:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch AI agents' },
            { status: 500 }
        );
    }
}