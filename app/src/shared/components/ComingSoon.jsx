export default function ComingSoon({ feature = 'Diese Funktion' }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-104px)] p-6">
      <div className="bg-white rounded-2xl border-2 border-primary shadow-soft p-12 max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-purple-light rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-albert-sans font-bold text-text-dark mb-4">
          Coming Soon
        </h2>

        {/* Description */}
        <p className="text-lg font-cabin text-gray-600 mb-8">
          {feature} ist derzeit in Entwicklung und wird bald verfügbar sein.
        </p>

        {/* Progress Indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-cabin text-gray-500">
            <span>Fortschritt</span>
            <span>In Arbeit...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-1/3 animate-pulse"></div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm font-cabin text-gray-500">
            Wir arbeiten hart daran, diese Funktion für Sie bereitzustellen.
            Schauen Sie bald wieder vorbei!
          </p>
        </div>
      </div>
    </div>
  );
}
