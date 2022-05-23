import OPDSParser, { OPDSFeed, OPDSEntry } from 'opds-feed-parser'
import { entryToBook, feedToCollection } from './opds1/parse'
// import parseSearchData from "./opds1/parseSearchData";
import {
  handleCMError,
  handleFetchError,
  handleParsingError,
  json,
  text,
} from './chainableFetchHandlers'
import { FulfillableBook, OpenEBook } from '~lib/interfaces'
import { Fetcher } from 'swr'

const parser = new OPDSParser()

/**
 * Fetchers
 */

export const fetchBook = (
  info: RequestInfo,
  catalogUrl: string,
  init?: RequestInit
) =>
  fetch(info, init)
    .then(handleCMError(info))
    .then(text)
    .then(parser.parse)
    .catch(handleParsingError(info))
    .then(validate(OPDSEntry, info))
    .then(entry2Book(catalogUrl))

export const fetchCollection = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init)
    .catch(handleFetchError(input))
    .then(handleCMError(input))
    .then(text)
    .then(parser.parse)
    .catch(handleParsingError(input))
    .then(validate(OPDSFeed, input))
    .then(feed2Collection(input))

// export const fetchSearchData = (url: string) =>
//   fetch(url)
//     .catch(handleFetchError(url))
//     .then(handleCMError(url))
//     .then(text)
//     .then(text => parseSearchData(text, url));

export const fetchFullfillment = (info: RequestInfo, opt?: RequestInit) =>
  fetch(info, opt)
    .catch(handleFetchError(info))
    .then(handleCMError(info))
    .then(json)

export const validate =
  <T extends typeof OPDSEntry | typeof OPDSFeed>(type: T, info: RequestInfo) =>
  async (feed: OPDSFeed | OPDSEntry) => {
    const url = typeof info === 'string' ? info : info.url
    if (feed instanceof type) {
      return feed as unknown as T extends typeof OPDSFeed ? OPDSFeed : OPDSEntry
    }
    throw new Error(
      `OPDS ERROR: Network response was expected to be an OPDS 1 ${type.name}, but was not parseable as such. Url: ${url}`
    )
  }

export const entry2Book = (catalogUrl: string) => async (entry: OPDSEntry) =>
  entryToBook(entry, catalogUrl)

export const feed2Collection =
  (info: RequestInfo) => async (feed: OPDSFeed) => {
    const url = typeof info === 'string' ? info : info.url
    return feedToCollection(feed, url)
  }

/**
 * Utilities
 */

/**
 * Used to log at any stage in the promise chain:
 *
 *  fetch(url)
 *    .catch(handleFetchError(url))
 *    .then(text)
 *    .then(log)      // logs the text
 *    .then(parseEntry)
 *    ...
 */
export const log = async <T>(val: T) => {
  console.log(val)
  return val
}

// we only need the books out of a collection for loans,
// so this is a utility to extract those.
export const fetchLoans: Fetcher<
  FulfillableBook[],
  [url: string, token: string]
> = async (url, token) => {
  const collection = await fetchCollection(url, {
    headers: { Authorization: token },
  })
  return collection.books as FulfillableBook[]
}
