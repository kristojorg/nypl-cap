export const AUTH_DOC_URL =
  'https://qa-circulation.librarysimplified.org/QANYPL/authentication_document'
export const LIBRARY_SLUG = 'QANYPL'
export const ROOT_LANE_URL = new URL(
  `/${LIBRARY_SLUG}/groups`,
  AUTH_DOC_URL
).toString()

export const STANDARD_EBOOKS_CATALOG_URL = 'https://standardebooks.org/opds/all'

/**
 * Uncomment to switch to Open eBooks.
 */
// export const AUTH_DOC_URL =
//   'https://qa-circulation.openebooks.us/USOEI/authentication_document'
// export const LIBRARY_SLUG = 'USOEI'
// export const ROOT_LANE_URL = new URL(
//   `/${LIBRARY_SLUG}/groups/406`,
//   AUTH_DOC_URL
// ).toString()

export const LOANS_ENDPOINT = new URL(
  `/${LIBRARY_SLUG}/loans`,
  AUTH_DOC_URL
).toString()
export const ME_ENDPOINT = new URL('/patrons/me', AUTH_DOC_URL).toString()
