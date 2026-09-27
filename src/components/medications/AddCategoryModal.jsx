import { useState, useEffect, useRef } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Tag } from "lucide-react";

export default function AddCategoryModal({
  isOpen,
  onClose,
  existingCategories = [],
  onAddCategory
}) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setCategoryName("");
    setError("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = categoryName.trim();

    if (!trimmed) {
      setError("Category name cannot be empty.");
      return;
    }

    if (trimmed.length > 30) {
      setError("Category name must be 30 characters or less.");
      return;
    }

    const isDuplicate = existingCategories.some(
      (cat) => cat.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setError(`"${trimmed}" category already exists.`);
      return;
    }

    onAddCategory(trimmed);
    setCategoryName("");
    setError("");
  };

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
    if (error) setError("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Medication Category"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Create a new category
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              New categories will appear in the filter bar and when adding medications.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="category-name-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Category Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="category-name-input"
            ref={inputRef}
            type="text"
            value={categoryName}
            onChange={handleInputChange}
            maxLength={30}
            placeholder="e.g. Dermatology, Cardiology, Respiratory"
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors ${
              error
                ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-slate-200 dark:border-[#2a2a2a] focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            }`}
          />
          {error ? (
            <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>
          ) : (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Maximum 30 characters
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#202020]">
          <Button variant="secondary" size="md" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!categoryName.trim()}
          >
            Add Category
          </Button>
        </div>
      </form>
    </Modal>
  );
}
