import { useState, useMemo, useEffect } from "react";
import { Plus, Pill, Search as SearchIcon } from "lucide-react";
import { mockMedications } from "../data/mockMedications";
import MedicationCard from "../components/medications/MedicationCard";
import MedicationSearch from "../components/medications/MedicationSearch";
import MedicationFilters from "../components/medications/MedicationFilters";
import MedicationDetail from "../components/medications/MedicationDetail";
import MedicationForm from "../components/medications/MedicationForm";
import DeleteMedicationModal from "../components/medications/DeleteMedicationModal";
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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("doctorai_medications", JSON.stringify(medications));
    } catch {
      // Ignore storage errors
    }
  }, [medications]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" | "edit"
  const [editingMedication, setEditingMedication] = useState(null);
  const [detailMedication, setDetailMedication] = useState(null);
  const [deletingMedication, setDeletingMedication] = useState(null);

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

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            className="self-start sm:self-auto flex items-center gap-2 shadow-sm shadow-teal-700/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </Button>
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
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
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

      {/* Delete Confirmation Modal */}
      <DeleteMedicationModal
        isOpen={Boolean(deletingMedication)}
        medication={deletingMedication}
        onClose={() => setDeletingMedication(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
