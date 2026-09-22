export function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="nebula nebula-one" />
      <div className="nebula nebula-two" />
      <svg
        className="sky-stars"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 195 }, (_, index) => {
          const x = (index * 719 + 83) % 1600;
          const y = (index * index * 17 + index * 131 + 43) % 1000;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={index % 11 === 0 ? 1.6 : 0.7}
              opacity={0.18 + (index % 6) * 0.1}
            />
          );
        })}
        {[
          [181, 226],
          [1310, 371],
          [1040, 130],
          [430, 830],
          [1390, 770],
        ].map(([x, y]) => (
          <path
            key={x}
            d={`M${x - 5} ${y}h10 M${x} ${y - 5}v10`}
            stroke="currentColor"
            strokeWidth="0.6"
          />
        ))}
      </svg>
      <div className="sky-vignette" />
    </div>
  );
}

export function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 2 19.5 12.5 30 16 19.5 19.5 16 30 12.5 19.5 2 16 12.5 12.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="m16 8 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="currentColor" />
    </svg>
  );
}

export function ConstellationArt({ viewed }: { viewed: string[] }) {
  const illuminated = viewed.length;
  return (
    <svg
      className="constellation-art"
      viewBox="0 0 1000 760"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="art-tone" x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#8a8bc6" />
          <stop offset=".5" stopColor="#e2cda5" />
          <stop offset="1" stopColor="#909ad1" />
        </linearGradient>
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <g className="celestial-orbits" fill="none" stroke="url(#art-tone)">
        <ellipse
          cx="502"
          cy="390"
          rx="250"
          ry="266"
          transform="rotate(-28 502 390)"
        />
        <ellipse
          cx="502"
          cy="390"
          rx="268"
          ry="280"
          transform="rotate(-28 502 390)"
          strokeDasharray="1 12"
        />
        <path d="M502 80v32m0 556v32M191 390h30m565 0h30M286 178l18 18m402 403 18 18M718 178l-18 18M304 600l-18 18" />
      </g>
      <g
        className="ribbon-art"
        fill="none"
        stroke="url(#art-tone)"
        style={{ opacity: 0.24 + illuminated * 0.14 }}
      >
        <path d="M310 471C174 381 254 169 410 204C473 218 501 295 508 342C522 293 590 223 672 267C801 336 721 522 570 574C439 620 315 598 311 505C306 409 472 373 599 420C720 466 738 599 638 637C550 671 499 591 529 548C561 502 622 550 607 586" />
        <path d="M314 474C198 365 268 193 406 224C469 239 488 316 504 365C533 297 591 247 662 284C770 341 706 498 563 552C444 597 337 581 333 507C329 436 475 400 588 441C692 479 714 583 634 613C573 636 529 590 548 560" />
        <path d="M400 206c-50-47-95-54-106-25 26-5 36 9 37 37m339 51c35-44 68-39 68-11-22-5-33 8-36 25M568 575l-39 56-5-45m-92-5-12 36 41-30" />
        <path d="M387 297l7 18 18 7-18 7-7 18-7-18-18-7 18-7ZM628 344l5 13 13 5-13 5-5 13-5-13-13-5 13-5Z" />
      </g>
      <path
        className="connection-glow"
        d="M310 471.2 480 235.6 720 372.4"
        fill="none"
        stroke="#c7d9ff"
        strokeWidth="5"
        filter="url(#line-glow)"
      />
      <path
        d="M310 471.2 480 235.6 720 372.4"
        fill="none"
        stroke="#aabbd9"
        strokeOpacity=".65"
        strokeWidth="1.5"
      />
      {viewed.includes("year-1-memory-1") &&
        viewed.includes("year-1-memory-2") && (
          <path
            d="M310 471.2 480 235.6"
            className="lit-connection"
            fill="none"
            stroke="#f9e4b9"
            strokeWidth="2"
          />
        )}
      {viewed.includes("year-1-memory-2") &&
        viewed.includes("year-1-memory-3") && (
          <path
            d="M480 235.6 720 372.4"
            className="lit-connection"
            fill="none"
            stroke="#f9e4b9"
            strokeWidth="2"
          />
        )}
      <g fill="#d8c7a7">
        <circle cx="410" cy="204" r="2.5" />
        <circle cx="570" cy="574" r="3" />
        <circle cx="638" cy="637" r="2" />
        <circle cx="294" cy="181" r="2" />
      </g>
    </svg>
  );
}
