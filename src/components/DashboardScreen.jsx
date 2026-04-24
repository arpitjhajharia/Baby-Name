const MEDALS = ['🥇', '🥈', '🥉']

function toEntry(raw) {
  if (!raw) return null
  if (typeof raw === 'string') return { name: raw, meaning: '' }
  return raw
}

function RankRow({ rank, name, meaning, votes, maxVotes, color }) {
  const pct = maxVotes > 0 ? (votes / maxVotes) * 100 : 0
  const barColors = { boy: 'bg-sky-400', girl: 'bg-pink-400' }

  return (
    <div className="flex items-center gap-3 py-3">
      <span className="text-2xl w-8 text-center flex-shrink-0">{MEDALS[rank]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-0.5">
          <p className="text-gray-900 font-semibold text-base truncate">{name}</p>
          <span className="text-gray-500 text-sm ml-2 flex-shrink-0">
            {votes} {votes === 1 ? 'vote' : 'votes'}
          </span>
        </div>
        {meaning ? (
          <p className="text-gray-400 text-xs italic mb-1 truncate">{meaning}</p>
        ) : null}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColors[color]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function DashboardScreen({ allUsers }) {
  // Build a meaning lookup from all submitted names
  const meaningLookup = {}
  allUsers.forEach((user) => {
    ;[...(user.boyNames || []), ...(user.girlNames || [])].forEach((raw) => {
      const e = toEntry(raw)
      if (e?.name && e.meaning) {
        meaningLookup[e.name.trim().toLowerCase()] = e.meaning
      }
    })
  })

  const boyVotes = {}
  const girlVotes = {}
  allUsers.forEach((user) => {
    if (user.boyVote) boyVotes[user.boyVote.trim()] = (boyVotes[user.boyVote.trim()] || 0) + 1
    if (user.girlVote) girlVotes[user.girlVote.trim()] = (girlVotes[user.girlVote.trim()] || 0) + 1
  })

  const topBoy = Object.entries(boyVotes).sort((a, b) => b[1] - a[1]).slice(0, 3)
  const topGirl = Object.entries(girlVotes).sort((a, b) => b[1] - a[1]).slice(0, 3)
  const maxBoy = topBoy[0]?.[1] || 0
  const maxGirl = topGirl[0]?.[1] || 0
  const totalVoters = allUsers.filter((u) => u.hasVoted).length
  const totalSubmitters = allUsers.filter((u) => u.hasSubmitted).length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-violet-600 safe-top">
        <div className="px-6 pt-2 pb-5">
          <h1 className="text-white text-2xl font-bold">Name Rankings</h1>
          <p className="text-violet-200 text-sm mt-1">Live results · updates in real time</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-nav px-4 pt-4 space-y-4">
        {/* Stats bar */}
        <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center justify-around">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalSubmitters}</p>
            <p className="text-gray-500 text-xs mt-0.5">Families</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalVoters}</p>
            <p className="text-gray-500 text-xs mt-0.5">Voted</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {totalSubmitters > 0 ? Math.round((totalVoters / totalSubmitters) * 100) : 0}%
            </p>
            <p className="text-gray-500 text-xs mt-0.5">Turnout</p>
          </div>
        </div>

        {/* Boy Rankings */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-sky-50 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center">
              <img src="/Baby-Name/Boy.gif" alt="Boy" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sky-700 font-semibold text-sm">Top Boy Names</p>
              <p className="text-sky-500 text-xs">
                {topBoy.length > 0 ? `${topBoy.length} name${topBoy.length !== 1 ? 's' : ''} leading` : 'No votes yet'}
              </p>
            </div>
          </div>
          <div className="px-5 divide-y divide-gray-50">
            {topBoy.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Cast the first vote!</p>
            ) : (
              topBoy.map(([name, votes], i) => (
                <RankRow
                  key={name}
                  rank={i}
                  name={name}
                  meaning={meaningLookup[name.toLowerCase()] || ''}
                  votes={votes}
                  maxVotes={maxBoy}
                  color="boy"
                />
              ))
            )}
          </div>
        </div>

        {/* Girl Rankings */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-pink-50 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center">
              <img src="/Baby-Name/Girl.gif" alt="Girl" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-pink-700 font-semibold text-sm">Top Girl Names</p>
              <p className="text-pink-500 text-xs">
                {topGirl.length > 0 ? `${topGirl.length} name${topGirl.length !== 1 ? 's' : ''} leading` : 'No votes yet'}
              </p>
            </div>
          </div>
          <div className="px-5 divide-y divide-gray-50">
            {topGirl.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Cast the first vote!</p>
            ) : (
              topGirl.map(([name, votes], i) => (
                <RankRow
                  key={name}
                  rank={i}
                  name={name}
                  meaning={meaningLookup[name.toLowerCase()] || ''}
                  votes={votes}
                  maxVotes={maxGirl}
                  color="girl"
                />
              ))
            )}
          </div>
        </div>

        <div className="safe-bottom" />
      </div>
    </div>
  )
}
