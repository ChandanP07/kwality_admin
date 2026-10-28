import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
                <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-6">
                    You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
                </p>
                <Link
                    href="/dashboard"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
