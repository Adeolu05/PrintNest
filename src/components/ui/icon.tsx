import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function makeIcon(path: React.ReactNode, viewBox = "0 0 24 24") {
  function Icon({ className, size = 20, ...rest }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={cn("shrink-0", className)}
        {...rest}
      >
        {path}
      </svg>
    );
  }
  return Icon;
}

export const ArrowRightIcon = makeIcon(
  <>
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </>,
);

export const SparklesIcon = makeIcon(
  <>
    <path d="M9.94 7.06 12 2l2.06 5.06L19 9l-4.94 1.94L12 16l-2.06-5.06L5 9z" />
    <path d="M19 14v4M17 16h4" />
    <path d="M5 16v3M3.5 17.5h3" />
  </>,
);

export const UploadIcon = makeIcon(
  <>
    <path d="M12 3v12" />
    <path d="m7 8 5-5 5 5" />
    <rect x="3" y="15" width="18" height="6" rx="2" />
  </>,
);

export const PaletteIcon = makeIcon(
  <>
    <path d="M12 21a9 9 0 1 1 9-9c0 1.66-1.34 3-3 3h-2a2 2 0 0 0-1.6 3.2A2 2 0 0 1 12 21Z" />
    <circle cx="7.5" cy="11.5" r="1" fill="currentColor" />
    <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
    <circle cx="16" cy="11" r="1" fill="currentColor" />
  </>,
);

export const StoreIcon = makeIcon(
  <>
    <path d="m3 9 1.5-5h15L21 9" />
    <path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
    <path d="M3 9a3 3 0 1 0 6 0 3 3 0 1 0 6 0 3 3 0 1 0 6 0" />
  </>,
);

export const WhatsAppIcon = makeIcon(
  <>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </>,
);

export const InstagramIcon = makeIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </>,
);

export const TikTokIcon = makeIcon(
  <>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </>,
);

export const XSocialIcon = makeIcon(
  <>
    <path d="M4 4l16 16" />
    <path d="M20 4 4 20" />
  </>,
);

export const CheckIcon = makeIcon(<path d="m5 13 4 4 10-10" />);

export const CheckCircleIcon = makeIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m8 12 3 3 5-6" />
  </>,
);

export const ShieldIcon = makeIcon(
  <>
    <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </>,
);

export const TruckIcon = makeIcon(
  <>
    <rect x="2" y="7" width="11" height="9" rx="1" />
    <path d="M13 10h4l3 3v3h-7" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </>,
);

export const GlobeIcon = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </>,
);

export const HeartIcon = makeIcon(
  <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
);

export const StarIcon = makeIcon(
  <path d="M12 2.5 14.6 8l6 .9-4.3 4.2 1 6L12 16.3 6.7 19l1-6L3.4 8.9 9.4 8z" />,
);

export const MenuIcon = makeIcon(
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>,
);

export const XIcon = makeIcon(
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </>,
);

export const HomeIcon = makeIcon(
  <>
    <path d="m4 11 8-7 8 7" />
    <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
  </>,
);

export const ImageIcon = makeIcon(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m4 18 5-5 4 4 3-3 4 4" />
  </>,
);

export const PackageIcon = makeIcon(
  <>
    <path d="m3 7 9-4 9 4-9 4-9-4Z" />
    <path d="M3 7v10l9 4 9-4V7" />
    <path d="M12 11v10" />
  </>,
);

export const SettingsIcon = makeIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </>,
);

export const LayoutIcon = makeIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="M3 12h6" />
  </>,
);

export const ChevronDownIcon = makeIcon(<path d="m6 9 6 6 6-6" />);

export const ChevronRightIcon = makeIcon(<path d="m9 6 6 6-6 6" />);

export const PlayIcon = makeIcon(<path d="M8 5v14l11-7L8 5Z" />);

export const ZapIcon = makeIcon(
  <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
);

export const TrendingUpIcon = makeIcon(
  <>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M14 7h7v7" />
  </>,
);

export const QuoteIcon = makeIcon(
  <>
    <path d="M9 7H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2H4" />
    <path d="M19 7h-4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2h-1" />
  </>,
);

export const PlusIcon = makeIcon(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
);

export const ExternalLinkIcon = makeIcon(
  <>
    <path d="M14 5h5v5" />
    <path d="M19 5 9 15" />
    <path d="M19 13v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
  </>,
);
