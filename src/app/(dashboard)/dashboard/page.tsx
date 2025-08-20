"use client";

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthNavigation from '@/components/AuthNavigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [clerkUser, setClerkUser] = useState<any>(null);

  // Check if Clerk is available and load user data
  useEffect(() => {
    const loadClerkUser = async () => {
      if (process.env.NEXT_PUBLIC_CLERK_FRONTEND_API && process.env.CLERK_SECRET_KEY) {
        try {
          const { useUser } = await import('@clerk/nextjs');
          // Note: This won't work without ClerkProvider, but we can check if it's available
          setClerkUser({ available: true });
        } catch (error) {
          console.error('Failed to load Clerk user:', error);
          setClerkUser(null);
        }
      }
    };

    loadClerkUser();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome to Your Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">User Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {user.full_name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Phone:</span> {user.phone}</p>
                <p><span className="font-medium">User ID:</span> {user.user_id}</p>
                {clerkUser && (
                  <p><span className="font-medium">Clerk User:</span> Yes</p>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  View Products
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Manage Orders
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Analytics
                </button>
              </div>
            </div>

            {/* Project Links Card */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Connected Projects</h3>
              <div className="space-y-3">
                <a
                  href="https://clerk-netlify-template.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-center"
                >
                  Auth Template
                </a>
                <p className="text-sm text-purple-700">
                  Your authentication is powered by Clerk and shared across both projects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-gray-600">Active Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-gray-600">Products Listed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">$0</div>
            <div className="text-gray-600">Revenue</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-gray-600">Customers</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="text-center text-gray-500 py-8">
            <p>No recent activity yet.</p>
            <p className="text-sm mt-2">Start by exploring products and creating your first listing!</p>
          </div>
        </div>
      </div>
    </div>
  );
}