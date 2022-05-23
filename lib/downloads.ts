/**
 * We need an api that:
 *  - Takes a loans feed
 *  - clears out any downloads not found in the loans feed
 *  - offers an api to download new loans
 *  - offers an api to delete downloads
 *  - indicates download progress when downloading
 */

import { OpenEBook } from '~lib/interfaces'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'

import * as React from 'react'
import { useUser } from '~lib/storage'
import { useIonLoading } from '@ionic/react'

export default function useDownload(book: OpenEBook | undefined) {
  /**
   * Check to see which loans are already downloaded
   */
  const [user] = useUser()
  const [isDownloaded, setDownloaded] = React.useState<boolean>(false)
  const [present, dismiss] = useIonLoading()

  /**
   * Check if the download exists whenever the record changes
   */
  React.useEffect(() => {
    book?.id &&
      doesDownloadExist(book.id).then((exists) => {
        setDownloaded(exists)
      })
  }, [book?.id])

  if (!book || book.status === 'borrowable')
    return {
      isDownloaded: false,
      download: async () => {},
      removeDownload: async () => {},
    }

  async function download() {
    if (!user?.token) {
      console.error('Cannot download without token')
      return
    }
    if (!book || book.status === 'borrowable') {
      console.error('Cannot download without a book')
      return
    }

    present({ message: 'Downloading...' })

    try {
      const response = await fetch(book.fulfillmentLinks[0].url, {
        headers: {
          Authorization: user.token,
        },
      })
      if (!response.ok) {
        dismiss()
        throw Error(response.status + ' ' + response.statusText)
      }
      const blob = await response.blob()
      await Filesystem.writeFile({
        path: idToPath(book.id),
        data: await blob.text(),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        recursive: true,
      })
      const doesExist = await doesDownloadExist(book.id)
      if (doesExist) {
        setDownloaded(true)
      } else {
        throw new Error('Something went wrong.')
      }
      dismiss()
    } catch (e) {
      console.error('Something went wrong', e)
      dismiss()
    }
  }

  async function removeDownload() {
    if (!book) return
    await Filesystem.deleteFile({
      path: idToPath(book.id),
      directory: Directory.Documents,
    })
    setDownloaded(false)
  }

  return { isDownloaded, download, removeDownload }
}

async function doesDownloadExist(id: string): Promise<boolean> {
  try {
    const result = await Filesystem.stat({
      directory: Directory.Documents,
      path: idToPath(id),
    })
    return true
  } catch {
    return false
  }
}

function idToPath(id: string) {
  return `${encodeURIComponent(id)}.epub.adobe`
}
