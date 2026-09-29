import { useState, useMemo, useEffect } from "react";
import { Plus, Pill, Search as SearchIcon } from "lucide-react";

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
import { supabase } from "../lib/supabase";

export default function Medications() {
  const { showToast } = useChat();

  const [medications, setMedications] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Medication modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingMedication, setEditingMedication] = useState(null);
  const [detailMedication, setDetailMedication] = useState(null);
  const [deletingMedication, setDeletingMedication] = useState(null);

  // Category modal states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // --------------------------------------------------
  // LOAD MEDICATIONS + CATEGORIES
  // --------------------------------------------------

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        { data: categoryData, error: categoryError },
        { data: medicationData, error: medicationError },
      ] = await Promise.all([
        supabase
          .from("medication_categories")
          .select("id, category_name")
          .order("category_name"),

        supabase
          .from("medications")
          .select(`
            id,
            medicine_name,
            generic_name,
            common_uses,
            dosage,
            category_id,
            created_at,
            updated_at,
            medication_categories (
              id,
              category_name
            )
          `)
          .order("medicine_name"),
      ]);

      if (categoryError) {
        throw categoryError;
      }

      if (medicationError) {
        throw medicationError;
      }

      // Keep categories as names because your existing
      // MedicationFilters and MedicationForm use strings.
      setCategories(
        (categoryData || []).map(
          (category) => category.category_name
        )
      );

      // Convert Supabase structure into the structure
      // your existing components already expect.
      const formattedMedications = (medicationData || []).map(
        (medication) => ({
          id: medication.id,

          name: medication.medicine_name,

          genericName: medication.generic_name || "",

          commonUses: medication.common_uses || "",

          dosage: medication.dosage || "",

          category:
            medication.medication_categories
              ?.category_name || "Other",

          // Keep the database category ID internally.
          categoryId: medication.category_id,

          createdAt: medication.created_at,

          updatedAt: medication.updated_at,
        })
      );

      setMedications(formattedMedications);
    } catch (error) {
      console.error("Failed to load medication data:", error);

      showToast(
        "Failed to load medications.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // SEARCH + CATEGORY FILTER
  // --------------------------------------------------

  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      const matchesCategory =
        selectedCategory === "All" ||
        med.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        med.name?.toLowerCase().includes(q) ||
        med.genericName?.toLowerCase().includes(q) ||
        med.commonUses?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [
    medications,
    searchQuery,
    selectedCategory,
  ]);

  // --------------------------------------------------
  // CATEGORY DELETE COUNT
  // --------------------------------------------------

  const deletingCategoryMedCount = useMemo(() => {
    if (!deletingCategory) return 0;

    return medications.filter(
      (med) => med.category === deletingCategory
    ).length;
  }, [medications, deletingCategory]);

  // --------------------------------------------------
  // ADD MEDICATION
  // --------------------------------------------------

  const handleOpenAdd = () => {
    setFormMode("add");
    setEditingMedication(null);
    setIsFormOpen(true);
  };

  const handleAddSubmit = async (newMed) => {
    try {
      // Convert category name → category UUID
      const { data: category, error: categoryError } =
        await supabase
          .from("medication_categories")
          .select("id")
          .eq("category_name", newMed.category)
          .single();

      if (categoryError) {
        throw categoryError;
      }

      const { error } = await supabase
        .from("medications")
        .insert({
          medicine_name: newMed.name,
          generic_name: newMed.genericName || "",
          common_uses: newMed.commonUses || "",
          dosage: newMed.dosage || "",
          category_id: category?.id || null,
        });

      if (error) {
        throw error;
      }

      setIsFormOpen(false);

      await loadData();

      showToast(
        "Medication added successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to add medication:",
        error
      );

      showToast(
        "Failed to add medication.",
        "error"
      );
    }
  };

  // --------------------------------------------------
  // EDIT MEDICATION
  // --------------------------------------------------

  const handleOpenEdit = (med) => {
    setFormMode("edit");
    setEditingMedication(med);
    setIsFormOpen(true);
  };

  const handleEditSubmit = async (updatedMed) => {
    try {
      const { data: category, error: categoryError } =
        await supabase
          .from("medication_categories")
          .select("id")
          .eq("category_name", updatedMed.category)
          .single();

      if (categoryError) {
        throw categoryError;
      }

      const { error } = await supabase
        .from("medications")
        .update({
          medicine_name: updatedMed.name,
          generic_name: updatedMed.genericName || "",
          common_uses: updatedMed.commonUses || "",
          dosage: updatedMed.dosage || "",
          category_id: category?.id || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedMed.id);

      if (error) {
        throw error;
      }

      setIsFormOpen(false);
      setEditingMedication(null);

      await loadData();

      // Update details modal if it was open
      if (
        detailMedication &&
        detailMedication.id === updatedMed.id
      ) {
        setDetailMedication(updatedMed);
      }

      showToast(
        "Medication updated successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to update medication:",
        error
      );

      showToast(
        "Failed to update medication.",
        "error"
      );
    }
  };

  // --------------------------------------------------
  // DELETE MEDICATION
  // --------------------------------------------------

  const handleOpenDelete = (med) => {
    setDeletingMedication(med);
  };

  const handleDeleteConfirm = async (id) => {
    try {
      const { error } = await supabase
        .from("medications")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setDeletingMedication(null);

      if (
        detailMedication &&
        detailMedication.id === id
      ) {
        setDetailMedication(null);
      }

      await loadData();

      showToast(
        "Medication deleted successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to delete medication:",
        error
      );

      showToast(
        "Failed to delete medication.",
        "error"
      );
    }
  };

  // --------------------------------------------------
  // VIEW DETAILS
  // --------------------------------------------------

  const handleOpenDetail = (med) => {
    setDetailMedication(med);
  };

  // --------------------------------------------------
  // ADD CATEGORY
  // --------------------------------------------------

  const handleAddCategory = async (newCategory) => {
    const trimmedCategory = newCategory.trim();

    if (!trimmedCategory) return;

    try {
      const { error } = await supabase
        .from("medication_categories")
        .insert({
          category_name: trimmedCategory,
        });

      if (error) {
        if (error.code === "23505") {
          showToast(
            "That category already exists.",
            "error"
          );
          return;
        }

        throw error;
      }

      setIsAddCategoryOpen(false);

      await loadData();

      setSelectedCategory(trimmedCategory);

      showToast(
        `Category "${trimmedCategory}" created successfully.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to add category:",
        error
      );

      showToast(
        "Failed to create category.",
        "error"
      );
    }
  };

  // --------------------------------------------------
  // DELETE CATEGORY
  // --------------------------------------------------

  const handleDeleteCategoryConfirm = async (
    categoryToDelete
  ) => {
    try {
      // Find the category ID first
      const { data: category, error: findError } =
        await supabase
          .from("medication_categories")
          .select("id")
          .eq("category_name", categoryToDelete)
          .single();

      if (findError) {
        throw findError;
      }

      // Find "Other" category
      const { data: otherCategory, error: otherError } =
        await supabase
          .from("medication_categories")
          .select("id")
          .eq("category_name", "Other")
          .single();

      if (otherError) {
        throw new Error(
          'The "Other" category is required before deleting a category.'
        );
      }

      // Reassign medications to Other
      const { error: medicationError } =
        await supabase
          .from("medications")
          .update({
            category_id: otherCategory.id,
            updated_at: new Date().toISOString(),
          })
          .eq("category_id", category.id);

      if (medicationError) {
        throw medicationError;
      }

      // Delete category
      const { error: deleteError } =
        await supabase
          .from("medication_categories")
          .delete()
          .eq("id", category.id);

      if (deleteError) {
        throw deleteError;
      }

      setDeletingCategory(null);

      if (selectedCategory === categoryToDelete) {
        setSelectedCategory("All");
      }

      await loadData();

      showToast(
        `Category "${categoryToDelete}" deleted.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error
      );

      showToast(
        error.message ||
        "Failed to delete category.",
        "error"
      );
    }
  };

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[300px]">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Loading medications...
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="flex-1 bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 overflow-y-auto chat-scroll font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* PAGE HEADER */}
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
              onClick={() =>
                setIsAddCategoryOpen(true)
              }
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 hover:bg-teal-100/70 dark:hover:bg-teal-900/40 hover:border-teal-300 dark:hover:border-teal-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>

          </div>
        </div>

        {/* SEARCH */}
        <div>
          <MedicationSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
        </div>

        {/* CATEGORY FILTERS */}
        <div>
          <MedicationFilters
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenDeleteCategory={(cat) =>
              setDeletingCategory(cat)
            }
          />
        </div>

        {/* MEDICATION LIST */}
        {medications.length === 0 ? (

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

            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAdd}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </Button>

          </div>

        ) : filteredMedications.length === 0 ? (

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

      {/* ADD / EDIT MEDICATION */}
      <MedicationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMedication(null);
        }}
        mode={formMode}
        initialData={editingMedication}
        onSubmit={
          formMode === "edit"
            ? handleEditSubmit
            : handleAddSubmit
        }
        categories={categories}
        onOpenAddCategory={() =>
          setIsAddCategoryOpen(true)
        }
      />

      {/* MEDICATION DETAILS */}
      <MedicationDetail
        isOpen={Boolean(detailMedication)}
        medication={detailMedication}
        onClose={() =>
          setDetailMedication(null)
        }
        onEdit={(med) => {
          setDetailMedication(null);
          handleOpenEdit(med);
        }}
      />

      {/* DELETE MEDICATION */}
      <DeleteMedicationModal
        isOpen={Boolean(deletingMedication)}
        medication={deletingMedication}
        onClose={() =>
          setDeletingMedication(null)
        }
        onConfirm={handleDeleteConfirm}
      />

      {/* ADD CATEGORY */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() =>
          setIsAddCategoryOpen(false)
        }
        existingCategories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* DELETE CATEGORY */}
      <DeleteCategoryModal
        isOpen={Boolean(deletingCategory)}
        category={deletingCategory}
        medicationCount={deletingCategoryMedCount}
        onClose={() =>
          setDeletingCategory(null)
        }
        onConfirm={
          handleDeleteCategoryConfirm
        }
      />
    </div>
  );
}