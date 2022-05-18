/* eslint-disable camelcase */

/**
 * Typings for OPDS 1.2. This is a working document and it
 * is not complete. It currently focuses on typing of links
 * and the AuthDocument. The Feed and Entry are pretty well
 * typed by opds-feed-parser.
 */

/**
 * Link Relations
 */
export const AuthDocLinkRelation = "http://opds-spec.org/auth/document";
export const AcquisitionLinkRel = "http://opds-spec.org/acquisition";
export const BorrowLinkRel = "http://opds-spec.org/acquisition/borrow";
export const RevokeLinkRel = "http://librarysimplified.org/terms/rel/revoke";
export const TrackOpenBookRel =
  "http://librarysimplified.org/terms/rel/analytics/open-book";
export type AnyLinkRelation =
  | typeof AuthDocLinkRelation
  | typeof AcquisitionLinkRel
  | typeof BorrowLinkRel
  | typeof RevokeLinkRel
  | typeof TrackOpenBookRel
  | AuthDocLinkRelations
  | "related";

/**
 * Link Roles
 */

export type AnyLinkRole = string;

/**
 * Media Types
 */

export const BaseDocumentMediaType =
  "application/atom+xml;profile=opds-catalog;kind=acquisition";
export const HTMLMediaType = "text/html";
export const AuthDocMediaType = "application/opds-authentication+json";

/**
 * Indirect Acquisition Types
 */

/**
 * This type indicates that you must fetch the associated href, which will
 * return an OPDS entry that will contain a direct link for the next type
 * in the chain.
 */
export const OPDSEntryMediaType =
  "application/atom+xml;type=entry;profile=opds-catalog";
/**
 * This means the content is encrypted with Adobe DRM. These files can't be
 * decrypted by us, so just download them and let the user open it in an app
 * that can deal with it.
 */
export const AdobeDrmMediaType = "application/vnd.adobe.adept+xml";
// there was an issue with incorrect Adept media types being sent.
export const IncorrectAdobeDrmMediaType = "vnd.adobe/adept+xml";
// this is not yet supported, but the description is here:
// https://github.com/NYPL-Simplified/Simplified/wiki/OPDSForDistributors#bearer-token-propagation
export const BearerTokenMediaType =
  "application/vnd.librarysimplified.bearer-token+json";

export type IndirectAcquisitionType =
  | typeof OPDSEntryMediaType
  | typeof AdobeDrmMediaType
  | typeof BearerTokenMediaType;

/**
 * Direct Acquisition Types
 * These are the final types that resources can be.
 */
export const EpubMediaType = "application/epub+zip";
export const KepubMediaType = "application/kepub+zip";
export const PdfMediaType = "application/pdf";
export const MobiPocketMediaType = "application/x-mobipocket-ebook";
export const Mobi8Mediatype = "application/x-mobi8-ebook";
export const AudiobookMediaType = "application/audiobook+json";
export const ExternalReaderMediaType =
  'text/html;profile="http://librarysimplified.org/terms/profiles/streaming-media"';
export const OverdriveAudiobookMediaType =
  "application/vnd.overdrive.circulation.api+json;profile=audiobook";
export const OverdriveEbookMediaType =
  "application/vnd.overdrive.circulation.api+json;profile=ebook";
export const AxisNowWebpubMediaType =
  "application/vnd.librarysimplified.axisnow+json";
export const AccessRestrictionAudiobookMediaType =
  'application/audiobook+json;profile="http://www.feedbooks.com/audiobooks/access-restriction"';

export type ReadOnlineMediaType = typeof AxisNowWebpubMediaType;

export type DownloadMediaType =
  | typeof EpubMediaType
  | typeof KepubMediaType
  | typeof PdfMediaType
  | typeof MobiPocketMediaType
  | typeof Mobi8Mediatype;

export type UnsupportedMediaType =
  | DownloadMediaType
  | typeof AccessRestrictionAudiobookMediaType
  | typeof AudiobookMediaType
  | typeof OverdriveAudiobookMediaType;

export type AnyMediaType =
  | ReadOnlineMediaType
  | typeof HTMLMediaType
  | typeof BaseDocumentMediaType
  | typeof AuthDocMediaType;

export interface Link {
  href: string;
  rel?: AnyLinkRelation;
  title?: string;
  type?: AnyMediaType;
  role?: AnyLinkRole;
}

/**
 * Auth Document
 */
export const CatalogRootRel = "start";
export const ShelfLinkRel = "http://opds-spec.org/shelf";
type AuthDocLinkRelations =
  | typeof CatalogRootRel
  | typeof ShelfLinkRel
  | "navigation"
  | "logo"
  | "register"
  | "help"
  | "privacy-policy"
  | "terms-of-service"
  | "about"
  | "alternate"
  | "authenticate";

export interface AuthDocumentLink extends Link {
  rel: AuthDocLinkRelations;
}

export const CleverAuthType =
  "http://librarysimplified.org/authtype/OAuth-with-intermediary";
export const FirstbookAuthType =
  "http://librarysimplified.org/authtype/OAuth-Client-Credentials";

export type OpenEBooksAuthType =
  | typeof FirstbookAuthType
  | typeof CleverAuthType;

// https://drafts.opds.io/authentication-for-opds-1.0
export interface AuthMethod<
  T extends OpenEBooksAuthType,
  L extends Link = Link
> {
  type: T;
  description?: string;
  // https://drafts.opds.io/authentication-for-opds-1.0#312-links
  links?: L[];
}

export interface CleverAuthMethod extends AuthMethod<typeof CleverAuthType> {}

export interface FirstbookAuthMethod
  extends AuthMethod<typeof FirstbookAuthType> {
  labels: {
    login: string;
    password: string;
  };
}

export type ServerAuthMethod = CleverAuthMethod | FirstbookAuthMethod;

export interface Announcement {
  id: string;
  content: string;
}

export interface AuthDocument {
  id: string;
  title: string;
  // used to display text prompt to authenticating user
  description?: string;
  links?: AuthDocumentLink[];
  authentication: ServerAuthMethod[];
  announcements?: Announcement[];
  web_color_scheme?: {
    primary?: string;
    secondary?: string;
    background?: string;
    foreground?: string;
  };
}

/**
 * Circ Manager
 */
export type ProblemDocument = {
  detail: string;
  title: string;
  type?: string;
  status?: number;
};
