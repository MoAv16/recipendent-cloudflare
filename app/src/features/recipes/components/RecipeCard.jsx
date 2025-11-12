import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{
              backgroundColor: recipe.color || '#e0e0e0',
            }}
          >
            {recipe.icon || '📖'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
            {recipe.description && (
              <p className="text-sm text-gray-600 line-clamp-1">{recipe.description}</p>
            )}
          </div>
        </div>
      </div>

      {recipe.folder && (
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: recipe.folder.color || '#gray' }}
          />
          <span className="text-sm text-gray-600">{recipe.folder.name}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
          <span>{recipe.usage_count}x verwendet</span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            // Handle create order from template
          }}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
        >
          Verwenden
        </button>
      </div>
    </Link>
  );
}
