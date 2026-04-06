export default function SkeletonCard() {
  return (
    <div
      className="max-w-4xl mx-auto rounded-2xl overflow-hidden"
      style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow-lg)' }}
    >
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="skeleton" style={{ height: '420px' }} />

        <div className="p-8 space-y-4">
          <div className="skeleton h-8 rounded-full w-3/4" />
          <div className="skeleton h-4 rounded-full w-1/2" />

          <div className="flex gap-2 flex-wrap pt-2">
            {[80, 64, 72, 56].map((w, i) => (
              <div key={i} className="skeleton h-8 rounded-full" style={{ width: `${w}px` }} />
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <div className="skeleton h-4 rounded-full w-full" />
            <div className="skeleton h-4 rounded-full w-full" />
            <div className="skeleton h-4 rounded-full w-5/6" />
            <div className="skeleton h-4 rounded-full w-4/6" />
          </div>

          <div className="pt-2">
            <div className="skeleton h-3 rounded-full w-20 mb-3" />
            <div className="flex gap-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="skeleton rounded-full" style={{ width: 48, height: 48 }} />
                  <div className="skeleton h-2.5 rounded-full w-12" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2 flex-wrap">
            {[120, 140, 130].map((w, i) => (
              <div key={i} className="skeleton h-10 rounded-full" style={{ width: `${w}px` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
