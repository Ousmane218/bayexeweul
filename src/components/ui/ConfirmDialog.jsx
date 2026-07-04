import { X } from "lucide-react"

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmer", cancelText = "Annuler", isDestructive = true }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-navy">{title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 mb-8">{message}</p>
          
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`px-5 py-2.5 rounded-xl text-white font-medium transition-colors shadow-sm ${
                isDestructive 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-navy hover:bg-navy-hover"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
