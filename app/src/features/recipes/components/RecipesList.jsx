import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '../services/recipeService';
import RecipeCard from './RecipeCard';

export default function RecipesList() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  });

  // Filter recipes by search query
  const filteredRecipes = recipes?.filter((recipe) => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.name?.toLowerCase().includes(query) ||
      recipe.description?.toLowerCase().includes(query)
    );
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Fehler beim Laden der Rezepte: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rezepte</h1>
          <p className="mt-1 text-sm text-gray-600">
            Erstelle Vorlagen für wiederkehrende Aufträge
          </p>
        </div>
        <Link
          to="/recipes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Neues Rezept
        </Link>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Rezepte sind Vorlagen für häufig wiederkehrende Aufträge. Erstelle einmal ein
              Rezept und nutze es immer wieder, um schneller Aufträge zu erstellen.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Rezepte durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Recipes List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredRecipes && filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-gray-500 text-lg">Keine Rezepte gefunden</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchQuery
              ? 'Versuche eine andere Suche'
              : 'Erstelle dein erstes Rezept, um schneller Aufträge zu erstellen'}
          </p>
          {!searchQuery && (
            <Link
              to="/recipes/new"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Erstes Rezept erstellen
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
