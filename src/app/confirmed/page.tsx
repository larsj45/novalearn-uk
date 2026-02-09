import Link from 'next/link'

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <span className="text-3xl font-bold text-[var(--navy)]">✦ NOVALEARN</span>
          </Link>
        </div>

        <div className="card text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-[var(--navy)] mb-2">Email Confirmed!</h1>
          <p className="text-gray-500 mb-6">
            Your account is ready. Start detecting AI-generated content with 99.9% accuracy.
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="btn-primary w-full py-3 rounded-xl block text-center"
            >
              Log In & Get Started
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">What you can do:</h3>
            <ul className="text-sm text-gray-500 space-y-2 text-left">
              <li>✦ 50 free AI detection analyses per month</li>
              <li>✦ 99.9% accuracy — verified by University of Maryland</li>
              <li>✦ Detect ChatGPT, Claude, Gemini & more</li>
              <li>✦ Section-by-section analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
