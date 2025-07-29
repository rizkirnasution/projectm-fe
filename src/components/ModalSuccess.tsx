'use client'

import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function SuccessDialog({ onClose }) {
    const [open, setOpen] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false)
            onClose()
        }, 2000) // Auto-close after 2 seconds
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <Dialog open={open} onClose={() => { }} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-black/30" />

            <div className="fixed inset-0 z-10 flex items-center justify-center">
                <DialogPanel className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
                    <div className="flex justify-center mb-4">
                        <div className="animate-scale-in flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircleIcon className="h-10 w-10 text-green-600" />
                        </div>
                    </div>
                    <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                        Sukses!
                    </DialogTitle>
                    <p className="mt-2 text-sm text-gray-600">
                        Aksi kamu berhasil dan data telah disimpan.
                    </p>
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
