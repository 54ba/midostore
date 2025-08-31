import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Grid, List, Filter } from 'lucide-react';

export default function ProductsLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="space-y-6">
            {/* Products Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600">Discover amazing products from trusted sellers</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                    <Button variant="outline" size="sm">
                        <Grid className="h-4 w-4 mr-2" />
                        Grid
                    </Button>
                    <Button variant="outline" size="sm">
                        <List className="h-4 w-4 mr-2" />
                        List
                    </Button>
                </div>
            </div>

            {/* Products Content */}
            {children}
        </div>
    );
}