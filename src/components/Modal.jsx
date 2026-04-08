import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, item }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-4xl p-8 max-h-[85vh] overflow-y-auto shadow-sheet"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-ink tracking-tight">Claim Item</h2>
                {item && <p className="text-ink-muted mt-1">Requesting to claim: {item.title}</p>}
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-background rounded-full text-ink-muted hover:text-ink transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
              <div className="flex flex-col space-y-2">
                <label className="font-medium text-ink text-sm ml-1" htmlFor="description">
                  Description of Item
                </label>
                <textarea
                  id="description"
                  required
                  placeholder="Provide details to prove ownership..."
                  className="bg-background rounded-2xl p-4 text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-32 transition-all"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium text-ink text-sm ml-1" htmlFor="dateLost">
                  Date Lost
                </label>
                <input
                  type="date"
                  id="dateLost"
                  required
                  className="bg-background rounded-2xl p-4 text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-medium text-ink text-sm ml-1" htmlFor="location">
                  Location Lost (Optional)
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="e.g. Main Library, Floor 2"
                  className="bg-background rounded-2xl p-4 text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="pt-4">
                <Button type="submit">Submit Claim</Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
