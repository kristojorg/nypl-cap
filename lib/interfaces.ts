/* eslint-disable camelcase */

/**
 * OPDS 2.0 DATA TYPES
 * Currently only used for support of a Library Registry, which is
 * an OPDS 2 Feed of OPDS 2 Catalogs from which we extract the catalog root url
 */
import * as OPDS2 from '../types/opds2'
/**
 * OPDS 1.x DATA TYPES
 */
import * as OPDS1 from '../types/opds1'
export { OPDS2 }
export { OPDS1 }

export type LibraryRegistryBase = string
export type LibrariesConfig = Record<
  string,
  { title: string; authDocUrl: string } | undefined
>

export interface ComplaintData {
  type: string
  detail?: string
}

export type LibraryLinks = {
  helpWebsite?: OPDS1.Link
  helpEmail?: OPDS1.Link
  libraryWebsite?: OPDS1.Link
  tos?: OPDS1.Link
  about?: OPDS1.Link
  privacyPolicy?: OPDS1.Link
  registration?: OPDS1.Link
}

/**
 * The server representation has multiple IDPs nested into the one.
 * We will flatten that out before placing into LibraryData.
 */
export interface ClientCleverMethod extends OPDS1.CleverAuthMethod {
  id: string
}

export interface ClientFirstbookMethod extends OPDS1.FirstbookAuthMethod {
  id: string
}

// auth methods once they have been processed for the app
export type AppAuthMethod = ClientCleverMethod | ClientFirstbookMethod

export interface AuthCredentials<AppAuthMethod> {
  methodType: AppAuthMethod
  token: string
}

export interface FirstbookAuthCredentials
  extends AuthCredentials<ClientFirstbookMethod['id']> {
  basicToken: string
  expiresAt: string
}

export type CleverAuthCredentials = AuthCredentials<ClientCleverMethod['id']>

export type OpenEBooksAuthCredentials =
  | FirstbookAuthCredentials
  | CleverAuthCredentials

export type FirstbookJWTResponse = {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

export type FirstbookBearerJWT = {
  token: string
  expiresAt: string
}
export interface LibraryData {
  catalogUrl: string
  catalogName: string
  logoUrl: string | null
  colors: {
    primary: string
    secondary: string
  } | null
  headerLinks: OPDS1.Link[]
  libraryLinks: LibraryLinks
  authMethods: AppAuthMethod[]
  shelfUrl: string | null
}

/**
 * INTERNAL BOOK MODEL
 */

export type FulfillmentLink = {
  contentType: OPDS1.ReadOnlineMediaType
  url: string
}

export type BookMedium =
  | 'http://bib.schema.org/Audiobook'
  | 'http://schema.org/EBook'
  | 'http://schema.org/Book'

export type BorrowFulfillmentType = 'borrow'
export type ReturnFulfillmentType = 'return'

export type FulfillmentType = BorrowFulfillmentType | ReturnFulfillmentType

export type Book<Status = EmptyObject> = Readonly<
  Status & {
    id: string
    title: string
    series?: {
      name: string
      position?: number
    } | null
    authors?: string[]
    contributors?: string[]
    subtitle?: string
    summary?: string
    imageUrl?: string
    availability?: {
      status: 'available'
      since?: string
      until?: string
    }
    holds?: {
      total: number
      position?: number
    } | null
    copies?: {
      total: number
      available: number
    } | null
    url: string
    publisher?: string
    published?: string
    categories?: string[]
    language?: string
    relatedUrl: string | null
    raw?: any
    trackOpenBookUrl: string | null
  }
>

export type BorrowableBook = Book<{
  status: 'borrowable'
  borrowUrl: string
}>

export type FulfillableBook = Book<{
  status: 'fulfillable'
  fulfillmentLinks: readonly FulfillmentLink[]
  revokeUrl: string | null
}>

export type OpenEBook = BorrowableBook | FulfillableBook

/**
 * INTERNAL COLLECTION MODEL
 */
export interface LaneData {
  title: string
  url: string
  books: OpenEBook[]
}

export interface FacetData {
  label: string
  href: string
  active: boolean
}

export interface FacetGroupData {
  label: string
  facets: FacetData[]
}

export interface CollectionData {
  id: string
  url: string
  title: string
  lanes: LaneData[]
  books: OpenEBook[]
  navigationLinks: LinkData[]
  facetGroups?: FacetGroupData[]
  nextPageUrl?: string
  catalogRootLink?: LinkData | null
  parentLink?: LinkData | null
  shelfUrl?: string
  links?: LinkData[] | null
  searchDataUrl: string | null
  raw?: any
}

export interface SearchData {
  url: string
  description: string
  shortName: string
  template: string
}

export interface LinkData {
  text?: string
  url: string
  id?: string | null
  type?: string
}

/**
 * Utils
 */

type PickAndRequire<T, K extends keyof T> = { [P in K]-?: NonNullable<T[P]> }

/** Utility to make certain keys of a type required */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  PickAndRequire<T, K>

export type NextLinkConfig = {
  href: string
  as?: string
}

export type EmptyObject = Record<never, unknown>

export type FetchMethods = 'GET' | 'PUT'

export type FetchOptions = {
  method: FetchMethods
  token?: string
}

export type ThemeBrandColors = {
  primary: string
  secondary: string
}
