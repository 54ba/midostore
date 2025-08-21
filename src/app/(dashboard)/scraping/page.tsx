"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import envConfig from '../../../../env.config';
import {
    Search,
    Filter,
    Download,
    Upload,
    Settings,
    Play,
    Pause,
    RotateCcw,
    CheckCircle,
    RefreshCw,
    XCircle,
    Clock,
    Eye,
    Trash2
} from 'lucide-react';

interface ScrapingJob {
    id: string;
    source: string;
    category: string;
    status: string;
    totalProducts: number;
    scrapedProducts: number;
    failedProducts: number;
    startedAt?: string;
    completedAt?: string;
    error?: string;
    createdAt: string;
}

export default function ScrapingDashboard() {
    const [jobs, setJobs] = useState<ScrapingJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewJobForm, setShowNewJobForm] = useState(false);
    const [newJobData, setNewJobData] = useState({
        source: 'alibaba',
        category: 'electronics',
        pageCount: 1,
    });

    const sources = envConfig.scrapingSources;
    const categories = envConfig.scrapingCategories;

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch('/api/scraping/jobs');
            const data = await response.json();
            if (data.success) {
                setJobs(data.data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const startNewJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/scraping/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newJobData),
            });

            const data = await response.json();
            if (data.success) {
                setShowNewJobForm(false);
                setNewJobData({ source: 'alibaba', category: 'electronics', pageCount: 1 });
                fetchJobs();
            }
        } catch (error) {
            console.error('Error starting job:', error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'running':
                return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getProgressPercentage = (job: ScrapingJob) => {
        if (job.totalProducts === 0) return 0;
        return Math.round((job.scrapedProducts / job.totalProducts) * 100);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Scraping Dashboard</h1>
                            <p className="mt-2 text-gray-600">
                                Manage and monitor product scraping jobs from Alibaba and AliExpress
                            </p>
                        </div>

                        <button
                            onClick={() => setShowNewJobForm(true)}
                            className="mt-4 lg:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Play className="h-5 w-5 inline mr-2" />
                            Start New Job
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <RefreshCw className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {jobs.filter(job => job.status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <RefreshCw className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Running</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {jobs.filter(job => job.status === 'running').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Failed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {jobs.filter(job => job.status === 'failed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Scraping Jobs</h3>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center">
                            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                            <p className="text-gray-500">Loading jobs...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Job
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Progress
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Started
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {job.source.charAt(0).toUpperCase() + job.source.slice(1)} - {job.category}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {job.id.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(job.status)}
                                                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                                                        {job.status}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${getProgressPercentage(job)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {job.scrapedProducts} / {job.totalProducts} products
                                                </div>
                                                {job.failedProducts > 0 && (
                                                    <div className="text-sm text-red-500">
                                                        {job.failedProducts} failed
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {job.startedAt ? formatDate(job.startedAt) : 'Not started'}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-900">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {job.status === 'completed' && (
                                                        <button className="text-green-600 hover:text-green-900">
                                                            <Download className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button className="text-red-600 hover:text-red-900">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No scraping jobs yet</h3>
                            <p className="text-gray-600 mb-4">
                                Start your first scraping job to begin collecting products
                            </p>
                            <button
                                onClick={() => setShowNewJobForm(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Start First Job
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* New Job Modal */}
            {showNewJobForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Start New Scraping Job</h3>

                            <form onSubmit={startNewJob} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Source
                                    </label>
                                    <select
                                        value={newJobData.source}
                                        onChange={(e) => setNewJobData({ ...newJobData, source: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {sources.map((source: string) => (
                                            <option key={source} value={source}>
                                                {source.charAt(0).toUpperCase() + source.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={newJobData.category}
                                        onChange={(e) => setNewJobData({ ...newJobData, category: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.map((category: string) => (
                                            <option key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pages to Scrape
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={newJobData.pageCount}
                                        onChange={(e) => setNewJobData({ ...newJobData, pageCount: parseInt(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Start Job
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewJobForm(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}