import { useState, useMemo, useEffect } from "react";
import { Plus, Pill, Search as SearchIcon } from "lucide-react";
import { mockMedications, medicationCategories as defaultCategories } from "../data/mockMedications";
import MedicationCard from "../components/medications/MedicationCard";
import MedicationSearch from "../components/medications/MedicationSearch";
import MedicationFilters from "../components/medications/MedicationFilters";
import MedicationDetail from "../components/medications/MedicationDetail";
import MedicationForm from "../components/medications/MedicationForm";
import DeleteMedicationModal from "../components/medications/DeleteMedicationModal";
import AddCategoryModal from "../components/medications/AddCategoryModal";
import DeleteCategoryModal from "../components/medications/DeleteCategoryModal";
import Button from "../components/ui/Button";
import { useChat } from "../context/ChatContext";

export default function Medications() {
  const { showToast } = useChat();

  // Manageable medication database state (stored in React state, initialized with mock data)
  const [medications, setMedications] = useState(() => {
    try {
      const saved = localStorage.getItem("doctorai_medications");
      return saved ? JSON.parse(saved) : mockMedications;
    } catch {
      return mockMedications;
    }
  });

  // Manageable categories state (stored in React state, synced with localStorage)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("doctorai_medication_categories");
      return saved ? JSON.parse(saved) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });

  // Sync medications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("doctorai_medications", JSON.stringify(medications));
    } catch {
      // Ignore storage errors
    }
  }, [medications]);

  // Sync categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("doctorai_medication_categories", JSON.stringify(categories));
    } catch {
      // Ignore storage errors
    }
  }, [categories]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Medication modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" | "edit"
  const [editingMedication, setEditingMedication] = useState(null);
  const [detailMedication, setDetailMedication] = useState(null);
  const [deletingMedication, setDeletingMedication] = useState(null);

  // Category modal states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Real-time search and category filtering
  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      const matchesCategory =
        selectedCategory === "All" || med.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        med.name.toLowerCase().includes(q) ||
        (med.genericName && med.genericName.toLowerCase().includes(q)) ||
        med.commonUses.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [medications, searchQuery, selectedCategory]);

  // Count medications in the category being deleted
  const deletingCategoryMedCount = useMemo(() => {
    if (!deletingCategory) return 0;
    return medications.filter((m) => m.category === deletingCategory).length;
  }, [medications, deletingCategory]);

  // Add Medication
  const handleOpenAdd = () => {
    setFormMode("add");
    setEditingMedication(null);
    setIsFormOpen(true);
  };

  const handleAddSubmit = (newMed) => {
    const itemWithId = {
      ...newMed,
      id: `med-${Date.now()}`
    };
    setMedications((prev) => [itemWithId, ...prev]);
    setIsFormOpen(false);
    showToast("Medication added successfully.", "success");
  };

  // Edit Medication
  const handleOpenEdit = (med) => {
    setFormMode("edit");
    setEditingMedication(med);
    setIsFormOpen(true);
  };

  const handleEditSubmit = (updatedMed) => {
    setMedications((prev) =>
      prev.map((item) => (item.id === updatedMed.id ? updatedMed : item))
    );
    setIsFormOpen(false);
    setEditingMedication(null);
    if (detailMedication && detailMedication.id === updatedMed.id) {
      setDetailMedication(updatedMed);
    }
    showToast("Medication updated successfully.", "success");
  };

  // Delete Medication
  const handleOpenDelete = (med) => {
    setDeletingMedication(med);
  };

  const handleDeleteConfirm = (id) => {
    setMedications((prev) => prev.filter((item) => item.id !== id));
    setDeletingMedication(null);
    if (detailMedication && detailMedication.id === id) {
      setDetailMedication(null);
    }
    showToast("Medication deleted successfully.", "success");
  };

  // View Details
  const handleOpenDetail = (med) => {
    setDetailMedication(med);
  };

  // Category Actions: Add
  const handleAddCategory = (newCategory) => {
    setCategories((prev) => {
      const otherIdx = prev.indexOf("Other");
      if (otherIdx !== -1) {
        const next = [...prev];
        next.splice(otherIdx, 0, newCategory);
        return next;
      }
      return [...prev, newCategory];
    });
    setSelectedCategory(newCategory);
    setIsAddCategoryOpen(false);
    showToast(`Category "${newCategory}" created successfully.`, "success");
  };

  // Category Actions: Delete
  const handleDeleteCategoryConfirm = (catToDelete) => {
    // 1. Reassign any medications belonging to this category to "Other"
    setMedications((prev) =>
      prev.map((med) =>
        med.category === catToDelete ? { ...med, category: "Other" } : med
      )
    );

    // 2. Remove category from list
    setCategories((prev) => prev.filter((cat) => cat !== catToDelete));

    // 3. Reset selected filter if currently selected
    if (selectedCategory === catToDelete) {
      setSelectedCategory("All");
    }

    setDeletingCategory(null);
    showToast(`Category "${catToDelete}" deleted.`, "success");
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 overflow-y-auto chat-scroll font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#1c1c1c]">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Medication Reference
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage and review general medication information.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 self-start sm:self-auto w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAdd}
              className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm shadow-teal-700/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </Button>
            <button
              type="button"
              onClick={() => setIsAddCategoryOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 hover:bg-teal-100/70 dark:hover:bg-teal-900/40 hover:border-teal-300 dark:hover:border-teal-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div>
          <MedicationSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
        </div>

        {/* Category Filters */}
        <div>
          <MedicationFilters
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenDeleteCategory={(cat) => setDeletingCategory(cat)}
          />
        </div>

        {/* Medication Cards List or Empty States */}
        {medications.length === 0 ? (
          /* Empty State: No medications at all */
          <div className="p-12 sm:p-16 text-center bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] shadow-sm flex flex-col items-center justify-center my-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Pill className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              No medications yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
              Add your first medication to your reference library.
            </p>
            <Button variant="primary" size="md" onClick={handleOpenAdd} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </Button>
          </div>
        ) : filteredMedications.length === 0 ? (
          /* Empty State: Search or filter returned no matches */
          <div className="p-12 sm:p-16 text-center bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] shadow-sm flex flex-col items-center justify-center my-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-[#262626] text-slate-400 flex items-center justify-center mb-4">
              <SearchIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              No medications found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
              Try a different search term or select another category.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear Search & Filters
            </Button>
          </div>
        ) : (
          /* Responsive Grid of Medication Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMedications.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onViewDetails={handleOpenDetail}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Medication Modal */}
      <MedicationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMedication(null);
        }}
        mode={formMode}
        initialData={editingMedication}
        onSubmit={formMode === "edit" ? handleEditSubmit : handleAddSubmit}
        categories={categories}
        onOpenAddCategory={() => setIsAddCategoryOpen(true)}
      />

      {/* Medication Details Modal */}
      <MedicationDetail
        isOpen={Boolean(detailMedication)}
        medication={detailMedication}
        onClose={() => setDetailMedication(null)}
        onEdit={(med) => {
          setDetailMedication(null);
          handleOpenEdit(med);
        }}
      />

      {/* Delete Medication Confirmation Modal */}
      <DeleteMedicationModal
        isOpen={Boolean(deletingMedication)}
        medication={deletingMedication}
        onClose={() => setDeletingMedication(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        existingCategories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Delete Category Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={Boolean(deletingCategory)}
        category={deletingCategory}
        medicationCount={deletingCategoryMedCount}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategoryConfirm}
      />
    </div>
  );
}
