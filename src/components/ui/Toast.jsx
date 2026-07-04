
import { useToast } from '@/context/ToastContext'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const { message, type } = toast

  const variants = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const icons = {
    success: <CheckCircle className="text-green-500 w-5 h-5" />,
    error: <AlertCircle className="text-red-500 w-5 h-5" />,
    warning: <AlertTriangle className="text-orange-500 w-5 h-5" />,
    info: <Info className="text-blue-500 w-5 h-5" />
  }

  return (
    <div className={`flex items-start p-4 border rounded-xl shadow-lg transition-all animate-in slide-in-from-right-full ${variants[type] || variants.info}`}>
      <div className="flex-shrink-0 mr-3">
        {icons[type] || icons.info}
      </div>
      <div className="flex-1 mr-2 text-sm font-medium">
        {message}
      </div>
      <button 
        onClick={onRemove}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
