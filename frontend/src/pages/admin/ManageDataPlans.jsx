import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, X, AlertTriangle } from "lucide-react";
import {
  useAllDataPlans,
  useCreateDataPlan,
  useUpdateDataPlan,
  useDeleteDataPlan,
} from "../../datahooks/dataHooks";

const ManageDataPlans = () => {
  const { data: plansData, isLoading } = useAllDataPlans({ limit: 500 });
  const dataPlans = plansData?.dataPlan || [];

  const { createPlanMutate, isPending: createPending } = useCreateDataPlan();
  const { updatePlanMutate, isPending: updatePending } = useUpdateDataPlan();
  const { deletePlanMutate, isPending: deletePending } = useDeleteDataPlan();

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected plan for edit/delete
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  // Open Form Modal (Create or Edit)
  const openFormModal = (plan = null) => {
    if (plan) {
      setSelectedPlan(plan);
      // Populate form for editing
      setValue("name", plan.name);
      setValue("network", plan.network);
      setValue("planCode", plan.planCode);
      setValue("serviceId", plan.serviceId);
      setValue("size", plan.size);
      setValue("validity", plan.validity);
      setValue("costPrice", plan.costPrice);
      setValue("sellingPrice", plan.sellingPrice);
      setValue("isActive", plan.isActive);
    } else {
      setSelectedPlan(null);
      reset();
      setValue("isActive", true); // default
    }
    setIsFormModalOpen(true);
  };

  // Close Form Modal
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedPlan(null);
    reset();
  };

  // Open Delete Modal
  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPlan(null);
  };

  // Submit Handler
  const onSubmitForm = (data) => {
    // Convert numeric fields
    const payload = {
      ...data,
      costPrice: Number(data.costPrice),
      sellingPrice: Number(data.sellingPrice),
    };

    if (selectedPlan) {
      // Update
      updatePlanMutate(
        { id: selectedPlan._id || selectedPlan.id, data: payload },
        { onSuccess: closeFormModal },
      );
    } else {
      // Create
      createPlanMutate(payload, { onSuccess: closeFormModal });
    }
  };

  // Delete Handler
  const confirmDelete = () => {
    if (selectedPlan) {
      deletePlanMutate(selectedPlan._id || selectedPlan.id, {
        onSuccess: closeDeleteModal,
      });
    }
  };

  const isSubmitting = createPending || updatePending;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary">
            Manage Data Plans
          </h1>
          <p className="text-gray-500 mt-1">
            Create, edit, and remove VTU data plans.
          </p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Plan
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Network</th>
                <th className="p-4 font-medium">Name & Size</th>
                <th className="p-4 font-medium">Validity</th>
                <th className="p-4 font-medium">Cost (₦)</th>
                <th className="p-4 font-medium">Selling (₦)</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </td>
                </tr>
              ) : dataPlans.length > 0 ? (
                dataPlans.map((plan) => (
                  <tr
                    key={plan._id || plan.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          plan.network === "mtn"
                            ? "bg-yellow-100 text-yellow-800"
                            : plan.network === "airtel"
                              ? "bg-red-100 text-red-800"
                              : plan.network === "glo"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {plan.network}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{plan.name}</p>
                      <p className="text-xs text-gray-500">Size: {plan.size}</p>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {plan.validity}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      ₦{plan.costPrice}
                    </td>
                    <td className="p-4 font-medium text-green-600">
                      ₦{plan.sellingPrice}
                    </td>
                    <td className="p-4">
                      {plan.isActive ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>{" "}
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openFormModal(plan)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(plan)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No data plans found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL (CREATE/EDIT) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl relative">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-secondary">
                {selectedPlan ? "Edit Data Plan" : "Create New Data Plan"}
              </h2>
              <button
                onClick={closeFormModal}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MTN 1GB 30Days"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Network */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Network Provider
                  </label>
                  <select
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white ${errors.network ? "border-red-500" : "border-gray-300"}`}
                    {...register("network", {
                      required: "Network is required",
                    })}
                  >
                    <option value="">Select Network...</option>
                    <option value="mtn">MTN</option>
                    <option value="airtel">Airtel</option>
                    <option value="glo">GLO</option>
                    <option value="9mobile">9Mobile</option>
                  </select>
                  {errors.network && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.network.message}
                    </p>
                  )}
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1GB"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.size ? "border-red-500" : "border-gray-300"}`}
                    {...register("size", { required: "Size is required" })}
                  />
                  {errors.size && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.size.message}
                    </p>
                  )}
                </div>

                {/* Validity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Days"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.validity ? "border-red-500" : "border-gray-300"}`}
                    {...register("validity", {
                      required: "Validity is required",
                    })}
                  />
                  {errors.validity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.validity.message}
                    </p>
                  )}
                </div>

                {/* Plan Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MTG1"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.planCode ? "border-red-500" : "border-gray-300"}`}
                    {...register("planCode", {
                      required: "Plan code is required",
                    })}
                  />
                  {errors.planCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.planCode.message}
                    </p>
                  )}
                </div>

                {/* Service ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. mtn-data"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.serviceId ? "border-red-500" : "border-gray-300"}`}
                    {...register("serviceId", {
                      required: "Service ID is required",
                    })}
                  />
                  {errors.serviceId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.serviceId.message}
                    </p>
                  )}
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.costPrice ? "border-red-500" : "border-gray-300"}`}
                    {...register("costPrice", {
                      required: "Cost price is required",
                      min: 0,
                    })}
                  />
                  {errors.costPrice && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.costPrice.message}
                    </p>
                  )}
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.sellingPrice ? "border-red-500" : "border-gray-300"}`}
                    {...register("sellingPrice", {
                      required: "Selling price is required",
                      min: 0,
                    })}
                  />
                  {errors.sellingPrice && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.sellingPrice.message}
                    </p>
                  )}
                </div>

                {/* Is Active Toggle */}
                <div className="md:col-span-2 flex items-center gap-3 mt-2 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                    {...register("isActive")}
                  />
                  <label
                    htmlFor="isActive"
                    className="font-medium text-gray-700 cursor-pointer"
                  >
                    Plan is Active and Visible to Users
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl font-bold text-white bg-primary shadow-md hover:bg-orange-600 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting
                    ? "Saving..."
                    : selectedPlan
                      ? "Update Plan"
                      : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Delete Data Plan
            </h3>
            <p className="text-gray-500 mb-8">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-800">
                {selectedPlan?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletePending}
                className={`flex-1 px-6 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-colors ${deletePending ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {deletePending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDataPlans;
