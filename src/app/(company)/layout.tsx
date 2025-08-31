import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store, ArrowLeft } from 'lucide-react';

export default function CompanyLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Company Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <Link href="/" className="flex items-center space-x-2">
                                <Store className="h-8 w-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900">MidoStore</span>
                            </Link>
                        </div>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                                About Us
                            </Link>
                            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Contact
                            </Link>
                            <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Terms
                            </Link>
                            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Privacy
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </div>
        </div>
    );
}