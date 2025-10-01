import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api';
import useAuthStore from '../../../store/useAuthStore';
import Modal from '../../../components/common/Modal';
import InvoiceForm from '../../../components/forms/InvoiceForm';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const fetchInvoiceData = async () => {
  try {
    const [invoicesRes, projectsRes] = await Promise.all([
      apiClient.get('/invoices'),
      apiClient.get('/projects'),
    ]);
    return {
      invoices: invoicesRes?.data?.data || [],
      projects: projectsRes?.data?.data || [],
    };
  } catch (err) {
    console.error('Error fetching invoice data:', err);
    return { invoices: [], projects: [] };
  }
};

const createInvoice = async (newInvoice) =>
  (await apiClient.post('/invoices', newInvoice)).data.data;
const updateInvoice = async ({ id, ...data }) =>
  (await apiClient.put(`/invoices/${id}`, data)).data.data;
const deleteInvoice = async (id) => await apiClient.delete(`/invoices/${id}`);

const ManageInvoices = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const canManage =
    user?.role === 'admin' ||
    user?.role === 'owner' ||
    user?.role === 'accountant';

  const { data, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoiceData,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setIsModalOpen(false);
      setEditingInvoice(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || 'An error occurred'),
  };

  const createMutation = useMutation({
    mutationFn: createInvoice,
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Invoice created!');
      mutationOptions.onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateInvoice,
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Invoice updated!');
      mutationOptions.onSuccess();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Invoice deleted!');
      mutationOptions.onSuccess();
    },
  });

  const handleFormSubmit = (formData) => {
    if (editingInvoice) {
      updateMutation.mutate({ id: editingInvoice._id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  const thClass =
    'px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300';
  const tdClass =
    'px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Manage Invoices</h1>
        {canManage && (
          <button
            onClick={() => {
              setEditingInvoice(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <FaPlus /> New Invoice
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className={thClass}>Invoice #</th>
              <th className={thClass}>Client</th>
              <th className={thClass}>Amount</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Due Date</th>
              {canManage && <th className={thClass}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              (data?.invoices || []).map((invoice) => (
                <tr key={invoice._id}>
                  <td className={tdClass}>{invoice.invoiceNumber}</td>
                  <td className={tdClass}>{invoice.client?.name}</td>
                  <td className={tdClass}>{formatCurrency(invoice.amount)}</td>
                  <td className={tdClass}>
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full capitalize ${
                        invoice.status === 'paid'
                          ? 'bg-green-200 text-green-900'
                          : invoice.status === 'overdue'
                          ? 'bg-red-200 text-red-900'
                          : 'bg-yellow-200 text-yellow-900'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className={tdClass}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  {canManage && (
                    <td className={`${tdClass} text-center`}>
                      <button
                        onClick={() => {
                          setEditingInvoice(invoice);
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(invoice._id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
      >
        <InvoiceForm
          onSubmit={handleFormSubmit}
          initialData={editingInvoice}
          projects={data?.projects || []}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default ManageInvoices;
