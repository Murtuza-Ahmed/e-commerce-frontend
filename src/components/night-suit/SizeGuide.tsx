import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  SIZE_GUIDE_BADGES,
  SIZE_GUIDE_IMAGE,
  SIZE_GUIDE_ROWS,
  SIZE_GUIDE_TITLE,
} from "@/data/sizeGuide";

/** Size table — transcribed from the size-guide photo (all measurements in inches). */
export function SizeGuideTable() {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-3 pr-4 font-semibold">Size</th>
              <th className="py-3 pr-4 font-semibold">Shirt Length</th>
              <th className="py-3 pr-4 font-semibold">Chest</th>
              <th className="py-3 pr-4 font-semibold">Sleeve</th>
              <th className="py-3 pr-4 font-semibold">Trouser Length</th>
              <th className="py-3 font-semibold">Trouser Width</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE_ROWS.map((row) => (
              <tr key={row.size} className="border-b border-border/60 last:border-0">
                <td className="py-3 pr-4 font-bold">{row.size}</td>
                <td className="py-3 pr-4">{row.shirtLength}&Prime;</td>
                <td className="py-3 pr-4">{row.chest}&Prime;</td>
                <td className="py-3 pr-4">{row.sleeve}&Prime;</td>
                <td className="py-3 pr-4">{row.trouserLength}&Prime;</td>
                <td className="py-3">{row.trouserWidth}&Prime;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground font-body">
        All measurements in inches. {SIZE_GUIDE_BADGES.join(" · ")}.
      </p>
    </div>
  );
}

export function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Size guide"
        >
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-t-lg sm:rounded-sm shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background z-10">
              <h2 className="font-display text-lg font-bold">{SIZE_GUIDE_TITLE}</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-sm transition-colors" aria-label="Close size guide">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <img
                src={SIZE_GUIDE_IMAGE}
                alt="AL UCCAZ Women's Pajama Sets Size Guide"
                className="w-full rounded-sm bg-muted"
              />
              <SizeGuideTable />
              <div className="flex flex-wrap gap-2">
                {SIZE_GUIDE_BADGES.map((b) => (
                  <span key={b} className="text-xs font-body px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
