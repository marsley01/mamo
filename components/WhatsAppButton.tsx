'use client';

interface WhatsAppButtonProps {
  productName: string;
  price: number;
  className?: string;
  children?: React.ReactNode;
}

export default function WhatsAppButton({ productName, price, className = '', children }: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/254725907608?text=${encodeURIComponent(
    `Hi! I want to order: ${productName} - KES ${price.toLocaleString()}. Please confirm availability and delivery.`
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 btn-gold ${className}`}
      aria-label={`Order ${productName} via WhatsApp`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z" />
      </svg>
      {children || 'Order via WhatsApp'}
    </a>
  );
}