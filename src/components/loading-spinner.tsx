export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-500">Gerando... (modelos avançados podem levar mais tempo)</p>
            </div>
        </div>
    );
}
