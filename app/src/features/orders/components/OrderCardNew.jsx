import { useState } from 'react';

export default function OrderCardNew({ order, isActive, onClick }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Generate order number from ID (first 13 chars)
  const orderNumber = `ORD-${order.id?.substring(0, 8).toUpperCase()}` || 'ORD-XXXXXXXX';

  // Get author info
  const authorName = order.author
    ? `${order.author.first_name} ${order.author.last_name}`
    : 'Unbekannt';
  const authorCompany = order.author?.company?.name || 'N/A';
  const authorInitials = order.author
    ? `${order.author.first_name?.[0] || ''}${order.author.last_name?.[0] || ''}`
    : '?';

  // Placeholder image or order image
  const orderImage = order.image_url || '/design-assets/alle_modelle_3.png';

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-xl cursor-pointer
        transition-all duration-200
        ${isActive
          ? 'border-2 border-primary shadow-soft'
          : 'border-2 border-border-inactive shadow-soft'
        }
        h-[226px] w-full max-w-[388px] overflow-hidden
      `}
    >
      {/* Bookmark Icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsBookmarked(!isBookmarked);
        }}
        className="absolute top-4 right-4 z-10 w-6 h-6"
      >
        <img
          src={isBookmarked
            ? '/design-assets/icons/bookmark_filled.svg'
            : '/design-assets/icons/bookmark.svg'
          }
          alt="Bookmark"
          className="w-full h-full"
        />
      </button>

      {/* Content Container */}
      <div className="p-5 h-full flex flex-col">
        {/* Order Number Label */}
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-cabin font-semibold text-text-gray">
            Order number
          </span>
        </div>

        {/* Order ID */}
        <h3 className="text-lg font-product-sans font-bold text-text-dark mb-2">
          {orderNumber}
        </h3>

        {/* Title */}
        <p className="text-sm font-abeezee text-[#474a58] mb-3 truncate">
          {order.title || 'Kein Titel'}
        </p>

        {/* Divider Line */}
        <div className="border-t border-gray-200 mb-3" />

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-auto">
          {/* Author Section */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-[47px] h-[47px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-base">
              {authorInitials}
            </div>

            {/* Author Info */}
            <div className="flex flex-col">
              <span className="text-xs font-cabin font-semibold text-text-gray mb-0.5">
                Author
              </span>
              <span className="text-base font-product-sans font-bold text-text-dark">
                {authorName}
              </span>
              <span className="text-sm font-cabin text-[#484a58]">
                {authorCompany}
              </span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Call Button */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-[38px] h-[38px] rounded-lg bg-purple-light flex items-center justify-center hover:bg-purple-100 transition-colors"
            >
              <img
                src="/design-assets/icons/vuesaxlinearcall.svg"
                alt="Call"
                className="w-6 h-6"
              />
            </button>

            {/* Message Button */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-[38px] h-[38px] rounded-lg bg-purple-light flex items-center justify-center hover:bg-purple-100 transition-colors relative"
            >
              <img
                src="/design-assets/icons/vuesaxlinearmessagetext.svg"
                alt="Message"
                className="w-6 h-6"
              />
              {/* Notification Badge */}
              {order.notes && order.notes.filter(n => n.type === 'comment').length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Order Image - Positioned absolutely in top right */}
      <div className="absolute top-4 right-12 w-[186px] h-[62px] pointer-events-none">
        <img
          src={orderImage}
          alt={order.title}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
