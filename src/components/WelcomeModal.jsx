export default function WelcomeModal({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-6 sm:pb-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-violet-600 to-pink-500 px-6 pt-8 pb-6 text-center">
          <div className="text-5xl mb-3">👶</div>
          <h1 className="text-white text-2xl font-bold">Venky and Aaru Baby Names</h1>
          <p className="text-white/80 text-sm mt-1">
            Venky &amp; Aaru's little one arrives in a week!
          </p>
        </div>

        {/* Steps */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-gray-600 text-sm text-center">Help choose the perfect name in 3 easy steps:</p>

          <div className="space-y-3">
            {[
              { icon: '✍️', text: 'Submit up to 3 boy & 3 girl names (with optional meanings)' },
              { icon: '🗳️', text: "Vote for your favourite name from others' suggestions" },
              { icon: '🏆', text: 'Watch the live rankings update in real time' },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <p className="text-gray-700 text-sm leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <button
            onClick={onDismiss}
            className="w-full bg-violet-600 text-white font-semibold rounded-2xl py-4 text-base transition active:scale-95"
          >
            Let's Pick a Name! 🎉
          </button>
        </div>
      </div>
    </div>
  )
}
