import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { medicationCategories as defaultCategories } from "../../data/mockMedications";

export default function MedicationForm({
  isOpen,
  onClose,
  mode = "add",
  initialData = null,
  onSubmit,
  categories = defaultCategories,
  onOpenAddCategory
}) {
  const isEdit = mode === "edit";

  const categoryOptions = useMemo(() => {
    const list = (categories || defaultCategories).filter((c) => c !== "All");
    if (initialData?.category && !list.includes(initialData.category)) {
      return [...list, initialData.category];
    }
    return list;
  }, [categories, initialData]);

  const defaultCategory = categoryOptions[0] || "Other";

  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    commonUses: "",
    dosage: "",
    category: defaultCategory
  });

  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (isEdit && initialData) {
        setFormData({
          name: initialData.name || "",
          genericName: initialData.genericName || "",
          commonUses: initialData.commonUses || "",
          dosage: initialData.dosage || "",
          category: initialData.category || defaultCategory
        });
      } else {
        setFormData({
          name: "",
          genericName: "",
          commonUses: "",
          dosage: "",
          category: defaultCategory
        });
      }
      setTouched({});
    }
  }, [isOpen, isEdit, initialData, defaultCategory]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Required validations
  const isNameValid = formData.name.trim().length > 0;
  const isUsesValid = formData.commonUses.trim().length > 0;
  const isDosageValid = formData.dosage.trim().length > 0;

  const isFormValid = isNameValid && isUsesValid && isDosageValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSubmit({
      ...(initialData || {}),
      name: formData.name.trim(),
      genericName: formData.genericName.trim(),
      commonUses: formData.commonUses.trim(),
      dosage: formData.dosage.trim(),
      category: formData.category
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Medication" : "Add New Medication"}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Update general information about this medication in your reference library."
            : "Add general information about a medication to your reference library."}
        </p>

        {/* Medicine Name (Required) */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            Medicine Name <span className="text-teal-500 dark:text-teal-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="e.g. Paracetamol"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
          />
          {touched.name && !isNameValid && (
            <p className="text-[11px] text-rose-500 mt-1">Medicine name is required.</p>
          )}
        </div>

        {/* Generic Name (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            Generic Name <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.genericName}
            onChange={(e) => handleChange("genericName", e.target.value)}
            placeholder="e.g. Acetaminophen"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
          />
        </div>

        {/* Common Uses (Required Textarea) */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            Common Uses <span className="text-teal-500 dark:text-teal-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.commonUses}
            onChange={(e) => handleChange("commonUses", e.target.value)}
            onBlur={() => handleBlur("commonUses")}
            placeholder="What is this medicine commonly used for? (e.g. Fever, mild to moderate pain)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-y leading-relaxed"
          />
          {touched.commonUses && !isUsesValid && (
            <p className="text-[11px] text-rose-500 mt-1">Common uses are required.</p>
          )}
        </div>

        {/* Dosage (Required Textarea) */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            Dosage <span className="text-teal-500 dark:text-teal-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.dosage}
            onChange={(e) => handleChange("dosage", e.target.value)}
            onBlur={() => handleBlur("dosage")}
            placeholder="General dosage information (e.g. Adults: Follow the dosage instructions on the product label or as directed by a healthcare professional.)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-y leading-relaxed"
          />
          {touched.dosage && !isDosageValid && (
            <p className="text-[11px] text-rose-500 mt-1">Dosage information is required.</p>
          )}
        </div>

        {/* Category (Dropdown) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Category
            </label>
            {onOpenAddCategory && (
              <button
                type="button"
                onClick={onOpenAddCategory}
                className="text-[11px] font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>New Category</span>
              </button>
            )}
          </div>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors cursor-pointer"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-[#181818] text-slate-900 dark:text-slate-100">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#202020]">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isFormValid}
          >
            {isEdit ? "Save Changes" : "Add Medicine"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
