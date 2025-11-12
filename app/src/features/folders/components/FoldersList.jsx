import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../services/folderService';
import FolderModal from './FolderModal';

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
];

export default function FoldersList() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data: folders, isLoading, error } = useQuery({
    queryKey: ['folders'],
    queryFn: getFolders,
  });

  const createMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateFolder(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowModal(false);
      setEditingFolder(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setDeleteConfirm(null);
    },
  });

  const handleEdit = (folder) => {
    setEditingFolder(folder);
    setShowModal(true);
  };

  const handleDelete = (folderId) => {
    if (deleteConfirm === folderId) {
      deleteMutation.mutate(folderId);
    } else {
      setDeleteConfirm(folderId);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Fehler beim Laden der Ordner: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ordner</h1>
          <p className="mt-1 text-sm text-gray-600">
            Organisiere deine Aufträge in Ordnern
          </p>
        </div>
        <button
          onClick={() => {
            setEditingFolder(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Neuer Ordner
        </button>
      </div>

      {/* Folders Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : folders && folders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: folder.color }}
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{folder.name}</h3>
                    {folder.description && (
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {folder.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(folder)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(folder.id)}
                  className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                    deleteConfirm === folder.id
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {deleteConfirm === folder.id ? 'Bestätigen' : 'Löschen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-gray-500 text-lg">Keine Ordner vorhanden</p>
          <p className="text-gray-400 text-sm mt-2">
            Erstelle deinen ersten Ordner, um Aufträge zu organisieren
          </p>
          <button
            onClick={() => {
              setEditingFolder(null);
              setShowModal(true);
            }}
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ersten Ordner erstellen
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <FolderModal
          folder={editingFolder}
          onClose={() => {
            setShowModal(false);
            setEditingFolder(null);
          }}
          onSave={(data) => {
            if (editingFolder) {
              updateMutation.mutate({ id: editingFolder.id, updates: data });
            } else {
              createMutation.mutate(data);
            }
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
          colors={PRESET_COLORS}
        />
      )}
    </div>
  );
}
