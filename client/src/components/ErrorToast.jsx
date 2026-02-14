import {useError} from '../context/ErrorContext.jsx'

const ErrorToast = () => {
    const { error, clearError } = useError();

    if (!error) return null;

    return (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
            <span>{error}</span>
            <button
                onClick={clearError}
                className="text-white hover:text-gray-200 font-bold"
            >
                ✕
            </button>
        </div>
    )
}
export default ErrorToast
