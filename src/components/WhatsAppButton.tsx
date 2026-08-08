'use client'

export default function WhatsAppButton() {
  const phoneNumber = '919650715739' // update with your WhatsApp business number
  const message = encodeURIComponent('Hi Akyoto, I have a query about your security products.')

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed left-4 bottom-20 md:bottom-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/20 hover:scale-110 active:scale-95 transition-transform"
    >
      <svg
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="currentColor"
        className="text-white"
        aria-hidden="true"
      >
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.7 4.61 1.912 6.48L4 29l7.72-1.878A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.77 9.77 0 0 1-4.98-1.36l-.357-.212-4.583 1.115 1.13-4.463-.233-.367A9.78 9.78 0 0 1 5.2 15c0-5.965 4.84-10.818 10.804-10.818S26.808 9.035 26.808 15 21.968 24.818 16.004 24.818Zm5.406-7.35c-.296-.148-1.75-.864-2.022-.963-.271-.099-.469-.148-.667.148-.198.297-.766.963-.94 1.161-.173.198-.346.223-.642.075-.296-.148-1.25-.461-2.38-1.47-.879-.784-1.472-1.752-1.645-2.048-.173-.297-.019-.457.13-.605.133-.132.296-.346.444-.519.148-.173.198-.297.297-.494.099-.198.05-.371-.025-.519-.074-.148-.667-1.607-.914-2.202-.24-.577-.485-.5-.667-.51l-.567-.01c-.198 0-.519.074-.79.371-.272.297-1.037 1.014-1.037 2.472s1.062 2.868 1.21 3.066c.148.198 2.09 3.191 5.062 4.475.707.305 1.259.487 1.689.623.71.226 1.355.194 1.866.118.569-.085 1.75-.716 1.997-1.408.247-.692.247-1.285.173-1.408-.074-.124-.271-.198-.567-.346Z" />
      </svg>
    </a>
  )
}