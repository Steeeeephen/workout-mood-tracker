import { useNotification } from '../context/NotificationContext';
const NotificationToast = () => {
    const { error, success, clearError, clearSuccess } = useNotification();


    return (
        <>
            { error && (
                <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
                    <span>{error}</span>
                    <button
                        onClick={clearError}
                        className="text-white hover:text-gray-200 font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Success Toast - Green */}
            {success && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
                    <span>✓ {success}</span>
                    <button
                        onClick={clearSuccess}
                        className="text-white hover:text-gray-200 font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    )
}
export default NotificationToast
