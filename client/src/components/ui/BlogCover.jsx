import { useEffect, useState } from 'react';
import clsx from 'clsx';

/**
 * Hand-made generative cover art so the site never depends on stock photos.
 * Six themes keep the library varied while staying inside the brand palette.
 */
export default function BlogCover({
  theme = 'lime',
  coverImage = '',
  title = '',
  className,
  category,
  showLabel = true,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [coverImage]);

  if (coverImage && !imageFailed) {
    return (
      <div className={clsx('relative overflow-hidden bg-paper', className)}>
        <img
          src={coverImage}
          alt={`Cover for ${title}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
        />
        {showLabel && (
          <span className="absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-[0.22em] text-white/80 drop-shadow">
            inkfluence ✳
          </span>
        )}
      </div>
    );
  }

  const safeTheme = ['lime', 'ink', 'paper', 'orbit', 'bloom', 'grid'].includes(theme)
    ? theme
    : 'lime';

  const labelColor =
    safeTheme === 'lime' || safeTheme === 'paper' || safeTheme === 'bloom' || safeTheme === 'grid'
      ? 'text-ink/45'
      : 'text-white/55';

  return (
    <div
      className={clsx('relative overflow-hidden', className)}
      role="img"
      aria-label={`Abstract cover artwork for ${title || 'an Inkfluence story'}`}
    >
      <svg
        viewBox="0 0 480 300"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden="true"
      >
        {safeTheme === 'lime' && (
          <>
            <rect width="480" height="300" fill="#b9ff66" />
            <circle cx="62" cy="248" r="86" fill="none" stroke="#191a23" strokeOpacity=".16" />
            <circle cx="62" cy="248" r="66" fill="none" stroke="#191a23" strokeOpacity=".16" strokeDasharray="3 7" />
            <circle cx="165" cy="207" r="48" fill="#191a23" />
            <circle cx="150" cy="195" r="5" fill="#b9ff66" />
            <circle cx="181" cy="195" r="5" fill="#b9ff66" />
            <path d="M148 215c5 9 12 13 18 13s13-4 18-13" fill="none" stroke="#b9ff66" strokeWidth="4" strokeLinecap="round" />
            <g transform="rotate(-9 305 174)">
              <rect x="245" y="108" width="150" height="124" rx="12" fill="#fbfbf8" stroke="#191a23" strokeWidth="2" />
              <rect x="263" y="128" width="46" height="8" rx="4" fill="#191a23" />
              <rect x="263" y="148" width="112" height="5" rx="2.5" fill="#191a23" opacity=".25" />
              <rect x="263" y="160" width="96" height="5" rx="2.5" fill="#191a23" opacity=".25" />
              <rect x="263" y="172" width="104" height="5" rx="2.5" fill="#191a23" opacity=".25" />
              <rect x="263" y="192" width="52" height="18" rx="9" fill="#191a23" />
            </g>
            <g fill="#191a23">
              <path d="M402 36c1.3 12 7.3 18 19.3 19.3-12 1.3-18 7.3-19.3 19.3-1.3-12-7.3-18-19.3-19.3 12-1.3 18-7.3 19.3-19.3Z" />
              <path d="M422 88c.7 6.7 4 10 10.7 10.7-6.7.7-10 4-10.7 10.7-.7-6.7-4-10-10.7-10.7 6.7-.7 10-4 10.7-10.7Z" opacity=".55" />
            </g>
            <circle cx="432" cy="228" r="4" fill="#191a23" opacity=".5" />
            <circle cx="64" cy="53" r="5" fill="#191a23" opacity=".35" />
          </>
        )}

        {safeTheme === 'ink' && (
          <>
            <rect width="480" height="300" fill="#191a23" />
            <circle cx="346" cy="240" r="92" fill="none" stroke="#b9ff66" strokeOpacity=".35" />
            <circle cx="346" cy="240" r="70" fill="none" stroke="#b9ff66" strokeOpacity=".35" strokeDasharray="4 8" />
            <path d="M97 45c2.5 24 14.5 36 38.5 38.5-24 2.5-36 14.5-38.5 38.5-2.5-24-14.5-36-38.5-38.5C82.5 81 94.5 69 97 45Z" fill="#b9ff66" />
            <path d="M228 51c1.1 10.5 6.4 15.9 16.9 17-10.5 1.1-15.8 6.5-16.9 17-1.1-10.5-6.4-15.9-16.9-17 10.5-1.1 15.8-6.5 16.9-17Z" fill="#b9ff66" opacity=".65" />
            <g transform="rotate(7 292 148)">
              <rect x="222" y="96" width="140" height="100" rx="12" fill="#fbfbf8" />
              <rect x="240" y="116" width="40" height="7" rx="3.5" fill="#191a23" />
              <rect x="240" y="134" width="100" height="4" rx="2" fill="#191a23" opacity=".25" />
              <rect x="240" y="145" width="86" height="4" rx="2" fill="#191a23" opacity=".25" />
              <rect x="240" y="156" width="94" height="4" rx="2" fill="#191a23" opacity=".25" />
              <circle cx="330" cy="168" r="10" fill="#b9ff66" />
            </g>
            <circle cx="392" cy="70" r="26" fill="#b9ff66" />
            <circle cx="383" cy="64" r="3.5" fill="#191a23" />
            <circle cx="401" cy="64" r="3.5" fill="#191a23" />
            <path d="M382 77c4 6 10 8 14 8s10-2 14-8" fill="none" stroke="#191a23" strokeWidth="3" strokeLinecap="round" />
            <circle cx="55" cy="228" r="4" fill="#b9ff66" />
          </>
        )}

        {safeTheme === 'paper' && (
          <>
            <rect width="480" height="300" fill="#f3f3f3" />
            <g fill="#191a23" opacity=".16">
              {Array.from({ length: 12 }).map((_, row) =>
                Array.from({ length: 18 }).map((__, column) => (
                  <circle key={`${row}-${column}`} cx={18 + column * 27} cy={18 + row * 26} r="1.4" />
                ))
              )}
            </g>
            <path d="M255 300V165c0-58 47-105 105-105s105 47 105 105v135" fill="#191a23" />
            <circle cx="360" cy="150" r="48" fill="#b9ff66" />
            <circle cx="347" cy="139" r="5" fill="#191a23" />
            <circle cx="373" cy="139" r="5" fill="#191a23" />
            <path d="M344 158c4 8 11 12 16 12s12-4 16-12" fill="none" stroke="#191a23" strokeWidth="4" strokeLinecap="round" />
            <path d="M103 53c2 19 11.5 28.5 30.5 30.5-19 2-28.5 11.5-30.5 30.5-2-19-11.5-28.5-30.5-30.5 19-2 28.5-11.5 30.5-30.5Z" fill="#191a23" />
            <circle cx="81" cy="211" r="38" fill="#b9ff66" />
            <circle cx="81" cy="211" r="51" fill="none" stroke="#191a23" strokeOpacity=".25" strokeDasharray="3 6" />
            <path d="M49 216c9 13 21 19 32 19s23-6 32-19" fill="none" stroke="#191a23" strokeWidth="4" strokeLinecap="round" />
            <circle cx="69" cy="203" r="4" fill="#191a23" />
            <circle cx="93" cy="203" r="4" fill="#191a23" />
          </>
        )}

        {safeTheme === 'orbit' && (
          <>
            <rect width="480" height="300" fill="#191a23" />
            <g fill="none" stroke="#b9ff66" strokeOpacity=".55">
              <ellipse cx="250" cy="160" rx="190" ry="88" transform="rotate(-18 250 160)" />
              <ellipse cx="250" cy="160" rx="150" ry="60" transform="rotate(-18 250 160)" strokeDasharray="3 7" />
              <ellipse cx="250" cy="160" rx="240" ry="118" transform="rotate(-18 250 160)" strokeOpacity=".25" />
            </g>
            <circle cx="108" cy="205" r="40" fill="#b9ff66" />
            <circle cx="383" cy="87" r="12" fill="#fbfbf8" />
            <path d="M250 78c2 20 12 30 32 32-20 2-30 12-32 32-2-20-12-30-32-32 20-2 30-12 32-32Z" fill="#fbfbf8" />
            <circle cx="250" cy="160" r="55" fill="#b9ff66" opacity=".1" />
            <circle cx="250" cy="160" r="7" fill="#b9ff66" />
            <path d="M105 185c5 8 13 12 20 12s15-4 20-12" fill="none" stroke="#191a23" strokeWidth="4" strokeLinecap="round" />
            <circle cx="94" cy="180" r="4" fill="#191a23" />
            <circle cx="118" cy="180" r="4" fill="#191a23" />
            <path d="M62 62c1 9 5.5 13.5 14.5 14.5C67.5 77.5 63 82 62 91c-1-9-5.5-13.5-14.5-14.5C56.5 75.5 61 71 62 62Z" fill="#b9ff66" opacity=".7" />
          </>
        )}

        {safeTheme === 'bloom' && (
          <>
            <rect width="480" height="300" fill="#dcffa3" />
            <g transform="translate(360 152)">
              {Array.from({ length: 8 }).map((_, index) => (
                <ellipse
                  key={index}
                  cx="0"
                  cy="-76"
                  rx="31"
                  ry="64"
                  fill="#191a23"
                  transform={`rotate(${index * 45})`}
                  opacity={index % 2 ? '.9' : '1'}
                />
              ))}
              <circle r="42" fill="#b9ff66" stroke="#191a23" strokeWidth="2" />
              <circle cx="-13" cy="-7" r="4" fill="#191a23" />
              <circle cx="13" cy="-7" r="4" fill="#191a23" />
              <path d="M-14 9c4 7 9 10 14 10s10-3 14-10" fill="none" stroke="#191a23" strokeWidth="3.5" strokeLinecap="round" />
            </g>
            <path d="M70 48c2 18 11 27 29 29-18 2-27 11-29 29-2-18-11-27-29-29 18-2 27-11 29-29Z" fill="#191a23" />
            <circle cx="95" cy="238" r="42" fill="none" stroke="#191a23" strokeOpacity=".3" />
            <circle cx="95" cy="238" r="55" fill="none" stroke="#191a23" strokeOpacity=".3" strokeDasharray="3 6" />
            <path d="M168 244c24-10 52-8 70 4" fill="none" stroke="#191a23" strokeWidth="2" strokeLinecap="round" opacity=".4" />
            <circle cx="248" cy="68" r="5" fill="#191a23" opacity=".5" />
          </>
        )}

        {safeTheme === 'grid' && (
          <>
            <rect width="480" height="300" fill="#f3f3f3" />
            <g stroke="#191a23" strokeOpacity=".08">
              {Array.from({ length: 13 }).map((_, index) => (
                <line key={`v${index}`} x1={index * 40} y1="0" x2={index * 40} y2="300" />
              ))}
              {Array.from({ length: 8 }).map((_, index) => (
                <line key={`h${index}`} x1="0" y1={index * 40} x2="480" y2={index * 40} />
              ))}
            </g>
            <rect x="54" y="55" width="90" height="90" rx="12" fill="#b9ff66" transform="rotate(-7 99 100)" />
            <circle cx="354" cy="150" r="86" fill="#191a23" />
            <circle cx="328" cy="126" r="8" fill="#b9ff66" />
            <circle cx="380" cy="126" r="8" fill="#b9ff66" />
            <path d="M318 165c8 16 22 24 36 24s28-8 36-24" fill="none" stroke="#b9ff66" strokeWidth="6" strokeLinecap="round" />
            <path d="M216 43c2 17 10.5 25.5 27.5 27.5-17 2-25.5 10.5-27.5 27.5-2-17-10.5-25.5-27.5-27.5 17-2 25.5-10.5 27.5-27.5Z" fill="#191a23" />
            <path d="M91 194v54h54" fill="none" stroke="#191a23" strokeWidth="2" strokeDasharray="4 5" />
            <circle cx="91" cy="248" r="6" fill="#191a23" />
            <circle cx="145" cy="248" r="4" fill="#b9ff66" stroke="#191a23" />
          </>
        )}
      </svg>
      {showLabel && (
        <span
          className={clsx(
            'pointer-events-none absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-[0.22em]',
            labelColor
          )}
        >
          inkfluence ✳ {category || 'stories'}
        </span>
      )}
    </div>
  );
}
