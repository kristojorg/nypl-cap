import {
  OPDSFeed,
  OPDSEntry,
  OPDSArtworkLink,
  AcquisitionFeed,
  OPDSCollectionLink,
  OPDSFacetLink,
  OPDSLink,
  SearchLink,
  CompleteEntryLink,
  OPDSCatalogRootLink,
  OPDSAcquisitionLink,
  OPDSShelfLink,
} from 'opds-feed-parser'
import {
  CollectionData,
  LaneData,
  Book,
  LinkData,
  FacetGroupData,
  OPDS1,
  OpenEBook,
} from '../../interfaces'
import {
  AxisNowWebpubMediaType,
  ReadOnlineMediaType,
  TrackOpenBookRel,
} from '../../../types/opds1'
import createDomPurify from 'dompurify'

let DOMPurify: any
if (typeof window !== 'undefined') {
  DOMPurify = createDomPurify()
} else {
  const { JSDOM } = require('jsdom')
  DOMPurify = createDomPurify(new JSDOM().window)
}

/**
 * Parses OPDS 1.x Feed or Entry into a Collection or Book
 */

/**
 * Type guards. Used for filtering links or narrowing the
 * type of a value to something more specific.
 */
function isFacetLink(link: OPDSLink): link is OPDSFacetLink {
  return link instanceof OPDSFacetLink
}
function isCatalogRootLink(link: OPDSLink): link is OPDSCatalogRootLink {
  return link instanceof OPDSCatalogRootLink
}
function isAcquisitionLink(link: OPDSLink): link is OPDSAcquisitionLink {
  return link instanceof OPDSAcquisitionLink
}
function isArtworkLink(link: OPDSLink): link is OPDSArtworkLink {
  return link instanceof OPDSArtworkLink
}
function isCollectionLink(link: OPDSLink): link is OPDSCollectionLink {
  return link instanceof OPDSCollectionLink
}
function isSearchLink(link: OPDSLink): link is SearchLink {
  return link instanceof SearchLink
}
function isRelatedLink(link: OPDSLink) {
  return link.rel === 'related'
}
function isTrackOpenBookLink(link: OPDSLink) {
  return link.rel === TrackOpenBookRel
}
function isSupportedOpenEBookLink(link: OPDSLink): link is OPDSAcquisitionLink {
  /**
   * We should make this filter to only Adobe books for now
   */
  return isAcquisitionLink(link)
  // if (isAcquisitionLink(link)) {
  //   if (
  //     link.type === AxisNowWebpubMediaType ||
  //     link.indirectAcquisitions?.[0]?.type === AxisNowWebpubMediaType
  //   ) {
  //     return true
  //   }
  //   console.error('Invalid book!')
  //   return false
  // }
  // return false
}

/**
 * Utils
 */
const resolve = (base: string, relative: string) =>
  new URL(relative, base).toString()

function buildFulfillmentLink(link: OPDSAcquisitionLink, feedUrl: string) {
  return {
    url: resolve(feedUrl, link.href),
    contentType: AxisNowWebpubMediaType as ReadOnlineMediaType,
  }
}

function findRevokeUrl(links: OPDSLink[]) {
  return links.find((link) => link.rel === OPDS1.RevokeLinkRel)?.href ?? null
}

/**
 * Converters
 */

export function entryToBook(entry: OPDSEntry, feedUrl: string): OpenEBook {
  const authors = entry.authors
    .map((author) => {
      return author.name
    })
    .filter((name) => name !== undefined)

  const contributors = entry.contributors.map((contributor) => {
    return contributor.name
  })

  let imageUrl, imageThumbLink
  const artworkLinks = entry.links.filter(isArtworkLink)
  if (artworkLinks.length > 0) {
    imageThumbLink = artworkLinks.find(
      (link) => link.rel === 'http://opds-spec.org/image/thumbnail'
    )
    if (imageThumbLink) {
      imageUrl = resolve(feedUrl, imageThumbLink.href)
    } else {
      console.log(
        `WARNING: missing tumbnail image for ${entry.title}. Defaulting to use full image`
      )
      imageUrl = resolve(feedUrl, artworkLinks[0].href)
    }
  }

  const detailLink = entry.links.find(
    (link) => link instanceof CompleteEntryLink
  )
  const detailUrl = resolve(feedUrl, detailLink!.href)

  const categories = entry.categories
    .filter((category) => !!category.label)
    .map((category) => category.label)

  const relatedLinks = entry.links.filter(isRelatedLink)
  const relatedLink = relatedLinks.length > 0 ? relatedLinks[0] : null

  const trackOpenBookLink = entry.links.find(isTrackOpenBookLink)

  const acquisitionLink = entry.links.find(isSupportedOpenEBookLink)

  let availability, holds, copies, borrowLink, fulfillmentLink

  if (acquisitionLink) {
    ;({ availability, holds, copies } = acquisitionLink)
    // if the acquisition link is a borrow link, assign it as such,
    // otherwise, construct a fulfillment link
    if (isBorrowLink(acquisitionLink)) {
      borrowLink = acquisitionLink
    } else {
      fulfillmentLink = buildFulfillmentLink(acquisitionLink, feedUrl)
    }
  }

  const revokeUrl = findRevokeUrl(entry.links)

  const book: Book = {
    id: entry.id,
    title: entry.title,
    series: entry.series,
    authors: authors,
    contributors: contributors,
    subtitle: entry.subtitle,
    summary: entry.summary.content && DOMPurify.sanitize(entry.summary.content),
    imageUrl: imageUrl,
    availability: {
      ...availability,
      // we type cast status because our internal types
      // are stricter than those in OPDSFeedParser.
      status: availability?.status as 'available',
    },
    holds: holds,
    copies: copies,
    publisher: entry.publisher,
    published: entry.issued && formatDate(entry.issued),
    categories: categories,
    language: entry.language,
    url: detailUrl,
    relatedUrl: relatedLink?.href ?? null,
    trackOpenBookUrl: trackOpenBookLink?.href ?? null,
    raw: entry.unparsed,
  }

  // it's a borrowable book
  if (borrowLink) {
    return {
      ...book,
      status: 'borrowable',
      borrowUrl: borrowLink.href,
    }
  }

  // it's fulfillable
  return {
    ...book,
    status: 'fulfillable',
    // FIXME: refactor fulfillmentLinks array into a single object https://jira.nypl.org/browse/OE-479
    fulfillmentLinks: fulfillmentLink ? [fulfillmentLink] : [],
    revokeUrl: revokeUrl,
  }
}

function isBorrowLink(link: OPDSAcquisitionLink) {
  if (link.rel === OPDSAcquisitionLink.BORROW_REL) {
    return true
  }
  return false
}

function entryToLink(entry: OPDSEntry, feedUrl: string): LinkData | null {
  const links = entry.links
  if (links.length > 0) {
    const href = resolve(feedUrl, links[0].href)
    return {
      id: entry.id,
      text: entry.title,
      url: href,
    }
  }
  console.error(
    'Attempting to create Link with undefined url. entry is: ',
    entry
  )
  return null
}

function dedupeBooks(books: OpenEBook[]): OpenEBook[] {
  // using Map because it preserves key order
  const bookIndex = books.reduce((index, book) => {
    index.set(book.id, book)
    return index
  }, new Map<any, OpenEBook>())

  return Array.from(bookIndex.values())
}

function formatDate(inputDate: string): string {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const date = new Date(inputDate)
  const day = date.getUTCDate()
  const monthIndex = date.getUTCMonth()
  const month = monthNames[monthIndex]
  const year = date.getUTCFullYear()

  return `${month} ${day}, ${year}`
}

function OPDSLinkToLinkData(
  feedUrl: string,
  link: OPDSLink | null = null
): LinkData | null {
  if (!link || !link.href) {
    return null
  }

  return {
    url: resolve(feedUrl, link.href),
    text: link.title,
    type: link.rel,
  }
}

export function feedToCollection(
  feed: OPDSFeed,
  feedUrl: string
): CollectionData {
  const collection = {
    id: feed.id,
    title: feed.title,
    url: feedUrl,
    raw: feed.unparsed,
  }
  const books: OpenEBook[] = []
  const navigationLinks: LinkData[] = []
  let lanes: LaneData[] = []
  const laneTitles: any[] = []
  const laneIndex: {
    title: any
    url: string
    books: OpenEBook[]
  }[] = []
  let facetGroups: FacetGroupData[] = []
  let nextPageUrl: string | undefined = undefined
  let catalogRootLink: OPDSLink | undefined = undefined
  let parentLink: OPDSLink | undefined = undefined
  let shelfUrl: string | undefined = undefined
  let links: OPDSLink[] = []

  feed.entries.forEach((entry) => {
    if (feed instanceof AcquisitionFeed) {
      if (entry.links.some(isSupportedOpenEBookLink)) {
        const book = entryToBook(entry, feedUrl)
        const collectionLink = entry.links.find(isCollectionLink)
        if (collectionLink) {
          const { title, href } = collectionLink

          if (laneIndex[title as any]) {
            laneIndex[title as any].books.push(book)
          } else {
            laneIndex[title as any] = {
              title,
              url: resolve(feedUrl, href),
              books: [book],
            }
            // use array of titles to preserve lane order
            laneTitles.push(title)
          }
        } else {
          books.push(book)
        }
      }
    } else {
      const link = entryToLink(entry, feedUrl)
      if (link) navigationLinks.push(link)
    }
  })

  lanes = laneTitles.reduce((result, title) => {
    const lane = laneIndex[title]
    lane.books = dedupeBooks(lane.books)
    result.push(lane)
    return result
  }, lanes)
  let facetLinks: OPDSFacetLink[] = []

  if (feed.links) {
    facetLinks = feed.links.filter(isFacetLink)

    const nextPageLink = feed.links.find((link) => {
      return link.rel === 'next'
    })
    if (nextPageLink) {
      nextPageUrl = resolve(feedUrl, nextPageLink.href)
    }

    catalogRootLink = feed.links.find(isCatalogRootLink)

    parentLink = feed.links.find((link) => link.rel === 'up')

    const shelfLink = feed.links.find((link) => link instanceof OPDSShelfLink)
    if (shelfLink) {
      shelfUrl = shelfLink.href
    }

    links = feed.links
  }

  facetGroups = facetLinks.reduce<FacetGroupData[]>((result, link) => {
    const groupLabel = link.facetGroup
    const label = link.title
    const href = resolve(feedUrl, link.href)
    const active = link.activeFacet
    const facet = { label, href, active }
    const newResult: FacetGroupData[] = []
    let foundGroup = false
    result.forEach((group) => {
      if (group.label === groupLabel) {
        const facets = group.facets.concat(facet)
        newResult.push({ label: groupLabel, facets })
        foundGroup = true
      } else {
        newResult.push(group)
      }
    })
    if (!foundGroup) {
      const facets = [facet]
      newResult.push({ label: groupLabel, facets })
    }
    return newResult
  }, [])

  function notNull<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined
  }
  const filteredLinks = links
    .map((link) => OPDSLinkToLinkData(feedUrl, link))
    // we have to filter out the null values in order for typescript to accept this
    .filter(notNull)

  const searchDataUrl = findSearchLink(feed)?.href ?? null

  return {
    ...collection,
    lanes,
    books,
    navigationLinks,
    facetGroups,
    nextPageUrl,
    catalogRootLink: OPDSLinkToLinkData(feedUrl, catalogRootLink),
    parentLink: OPDSLinkToLinkData(feedUrl, parentLink),
    shelfUrl,
    links: filteredLinks,
    searchDataUrl,
  }
}

export function findSearchLink(feed: OPDSFeed) {
  return feed.links.find(isSearchLink)
}
