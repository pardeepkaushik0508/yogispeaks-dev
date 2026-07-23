import { MessageCircle } from 'lucide-react';
import { siteContact } from '@/data/homepage';

export function WhatsAppButton() {
  return (
    <a
      href={siteContact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <MessageCircle className="size-7 fill-current" aria-hidden="true" />
    </a>
  );
}
