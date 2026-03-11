'use client'

import { X, Keyboard } from 'lucide-react'
import { KeyboardShortcut, formatShortcut } from '@/hooks/useKeyboardShortcuts'

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[]
  onClose: () => void
}

export function KeyboardShortcutsHelp({ shortcuts, onClose }: KeyboardShortcutsHelpProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-b-0"
            >
              <span className="text-sm text-gray-700">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                {formatShortcut(shortcut)}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-600 text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded">?</kbd> to toggle this help
          </p>
        </div>
      </div>
    </div>
  )
}
