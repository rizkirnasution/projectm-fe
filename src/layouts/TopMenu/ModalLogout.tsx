'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface LogoutConfirmDialogProps {
    onConfirm: () => void
    onCancel: () => void
}

export default function LogoutConfirmDialog({
    onConfirm,
    onCancel,
}: LogoutConfirmDialogProps) {
    const [open, setOpen] = useState(true)

    const handleConfirm = () => {
        setOpen(false)
        onConfirm()
    }

    const handleCancel = () => {
        setOpen(false)
        onCancel()
    }

    return (
        <Dialog open={open} onClose={() => { }} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-black/30" />

            <div className="fixed inset-0 z-10 flex items-center justify-center">
                <DialogPanel className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
                    <div className="flex justify-center mb-4">
                        <div className="animate-scale-in flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <ArrowRightOnRectangleIcon className="h-10 w-10 text-blue-600" />
                        </div>
                    </div>
                    <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                    Are you sure you want to log out?"
                    </DialogTitle>
              
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Logout
                        </button>
                    </div>
                </DialogPanel>
            </div>

            <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
        </Dialog>
    )
}
