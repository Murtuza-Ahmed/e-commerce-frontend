import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ruler, X } from "lucide-react";
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
      {/* Reflowed table (Phase 1 audit H-3): no fixed min-width, so every
          column — including Trouser Width — fits on mobile. Compact
          padding/font on small screens; headers wrap to two lines.
          overflow-x-auto stays only as a safety net for very narrow
          screens. */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] sm:text-sm font-body">
          <thead>
            <tr className="text-left text-[11px] sm:text-caption uppercase tracking-wider text-primary-foreground">
              <th className="py-2 px-2 sm:py-3 sm:px-3 first:pl-0 font-semibold bg-primary rounded-tl-sm leading-tight">Size</th>
              <th className="py-2 px-2 sm:py-3 sm:px-3 font-semibold bg-primary leading-tight">Shirt Length</th>
              <th className="py-2 px-2 sm:py-3 sm:px-3 font-semibold bg-primary leading-tight">Chest</th>
              <th className="py-2 px-2 sm:py-3 sm:px-3 font-semibold bg-primary leading-tight">Sleeve</th>
              <th className="py-2 px-2 sm:py-3 sm:px-3 font-semibold bg-primary leading-tight">Trouser Length</th>
              <th className="py-2 px-2 sm:py-3 sm:px-3 last:pr-0 font-semibold bg-primary rounded-tr-sm leading-tight">Trouser Width</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE_ROWS.map((row, i) => (
              <tr
                key={row.size}
                className={`border-b border-border/60 last:border-0 ${i % 2 === 1 ? "bg-forest-mist/50" : ""}`}
              >
                <td className="py-2.5 pr-2 sm:py-3 sm:pr-4 font-display font-semibold text-primary text-base">{row.size}</td>
                <td className="py-2.5 pr-2 sm:py-3 sm:pr-4">{row.shirtLength}&Prime;</td>
                <td className="py-2.5 pr-2 sm:py-3 sm:pr-4">{row.chest}&Prime;</td>
                <td className="py-2.5 pr-2 sm:py-3 sm:pr-4">{row.sleeve}&Prime;</td>
                <td className="py-2.5 pr-2 sm:py-3 sm:pr-4">{row.trouserLength}&Prime;</td>
                <td className="py-2.5 sm:py-3">{row.trouserWidth}&Prime;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-caption text-muted-foreground font-body">
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
            className="absolute inset-0 bg-forest-deep/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground rounded-t-md sm:rounded-md shadow-elevated"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-primary-foreground/15 sticky top-0 bg-primary text-primary-foreground z-10">
              <h2 className="font-display text-display-4 font-semibold flex items-center gap-2">
                <Ruler className="w-5 h-5" />
                {SIZE_GUIDE_TITLE}
              </h2>
              <button
                onClick={onClose}
                className="min-h-10 min-w-10 flex items-center justify-center hover:bg-forest-soft rounded-sm transition-colors"
                aria-label="Close size guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <img
                src={SIZE_GUIDE_IMAGE}
                alt="AL UCCAZ Women's Pajama Sets Size Guide"
                className="w-full rounded-sm bg-forest-mist ring-1 ring-border"
              />
              <SizeGuideTable />
              <div className="flex flex-wrap gap-2">
                {SIZE_GUIDE_BADGES.map((b) => (
                  <span
                    key={b}
                    className="text-caption font-body font-semibold px-3 py-1.5 rounded-sm bg-forest-mist text-primary"
                  >
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
