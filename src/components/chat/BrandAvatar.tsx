import { brand } from "~/brand.config";
import { brandInitials } from "~/lib/initials";

/**
 * The assistant's face, in one place.
 *
 * There were three near-identical copies of this fallback chain and they had
 * drifted: the hero welcome bubble and the live transcript both fell straight
 * from "Release avatar" to INITIALS, while the static showcase directly below
 * them used `brand.media.logo` unconditionally. One page therefore showed the
 * customer's icon in the demo transcript and a flat "DC" in the hero, for the
 * same assistant.
 *
 * Precedence: the Release's uploaded avatar, then the brand mark, then
 * initials — which are meant to be the last resort for a brand with no usable
 * logo, not the common case.
 */
export function BrandAvatar({
  avatarUrl,
  size,
  className = "",
}: {
  avatarUrl?: string | null;
  /** Tailwind size classes for the ring, e.g. "h-7 w-7". */
  size: string;
  className?: string;
}) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="" aria-hidden="true" className="h-full w-full object-cover" />
      ) : brand.media.markLogo || (brand.media.logo && brand.media.logoIsMark) ? (
        // ONLY a mark. `object-contain` keeps a wordmark undistorted but does
        // not make it legible: Applied BioCode's logo is 1248x138, so at 70%
        // of a 36px circle it renders ~25px wide and under 3px tall — a smear,
        // and the showcase's 16px version read as barcode stripes.
        //
        // A wordmark is a horizontal lockup; there is no crop or scale of one
        // that works in a small circle. Initials do, which is why they are the
        // fallback rather than a last-ditch one.
        <img
          src={brand.media.markLogo || brand.media.logo}
          alt=""
          aria-hidden="true"
          className={brand.media.markLogo ? "h-full w-full object-cover" : "h-[70%] w-[70%] object-contain"}
        />
      ) : (
        <span className="text-[11px] font-bold text-df-green-dark" aria-hidden="true">
          {brandInitials(brand.identity.siteName)}
        </span>
      )}
    </span>
  );
}
