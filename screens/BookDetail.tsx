import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
  useIonLoading,
} from '@ionic/react'
import * as React from 'react'
import { fetchBook } from '~/lib/fetching/fetch'
import { RouteComponentProps } from 'react-router'
import useSWR, { Fetcher, mutate } from 'swr'
import { useUser } from '~/lib/storage'
import { OpenEBook } from '~/lib/interfaces'
import { LOANS_ENDPOINT, ROOT_LANE_URL } from '~/lib/constants'
import useDownload from '~lib/downloads'

interface BookDetailProps
  extends RouteComponentProps<{
    bookUrl: string
  }> {}

const fetchBookWithToken: Fetcher<
  OpenEBook,
  [url: string, token?: string]
> = async (url, token) => {
  const headers: RequestInit['headers'] = {}
  if (token) {
    headers['Authorization'] = token
  }
  return await fetchBook(url, ROOT_LANE_URL, {
    headers,
  })
}

async function mutateLoans(token: string) {
  await mutate([LOANS_ENDPOINT, token])
}

const BookDetailPage: React.FC<BookDetailProps> = ({ match }) => {
  const bookUrl = decodeURIComponent(match.params.bookUrl)
  const [user] = useUser()
  const [present, dismiss] = useIonLoading()

  const { data, mutate, isValidating } = useSWR(
    [bookUrl, user?.token],
    fetchBookWithToken
  )
  const { isDownloaded, download, removeDownload } = useDownload(data)

  async function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    await mutate()
    event.detail.complete()
  }

  if (!data)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <IonSpinner />
            <p>Loading...</p>
          </div>
        </IonContent>
      </IonPage>
    )

  async function borrow() {
    if (data?.status !== 'borrowable') {
      console.error('Cannot borrow book that is not borrowable')
      return
    }
    if (!user?.token) {
      console.error('Cannot borrow book without a token')
      return
    }
    present({ message: 'Borrowing...' })
    const borrowUrl = data.borrowUrl
    const headers: RequestInit['headers'] = {
      Authorization: user.token,
    }
    await mutate(
      fetchBook(borrowUrl, ROOT_LANE_URL, {
        headers,
        method: 'PUT',
      }),
      {
        revalidate: false,
      }
    )

    mutateLoans(user.token)
    dismiss()
  }

  async function returnBook() {
    if (data?.status !== 'fulfillable') {
      console.error('Cannot borrow book that is not borrowable')
      return
    }
    if (!user?.token) {
      console.error('Cannot borrow book without a token')
      return
    }
    const revokeUrl = data.revokeUrl
    if (!revokeUrl) {
      console.error('Cannot return book without a revokeUrl')
      return
    }
    present({ message: 'Returning...' })
    const headers: RequestInit['headers'] = {
      Authorization: user.token,
    }
    await removeDownload()

    const book = await fetchBook(revokeUrl, ROOT_LANE_URL, {
      headers,
      method: 'PUT',
    })
    await mutateLoans(user.token)
    await mutate(book, { revalidate: false })
    dismiss()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{data.title}</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{data.title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div style={{ padding: 16 }}>
          <IonImg src={data.imageUrl} style={{ maxWidth: '40%' }} />
          <p>
            <strong>Authors: </strong>
            {data.authors?.join(', ')}
          </p>
          {data.status === 'fulfillable' && !isDownloaded && (
            <p>Download to read book</p>
          )}
          {data.status === 'fulfillable' && isDownloaded && (
            <div style={{ display: 'flex' }}>
              <p>Book is downloaded</p>
              <IonButton color="danger" fill="clear" onClick={removeDownload}>
                Remove Download
              </IonButton>
            </div>
          )}
          <IonButton
            fill="solid"
            onClick={data.status === 'borrowable' ? borrow : returnBook}
          >
            {data.status === 'borrowable' ? 'Borrow' : 'Return'}
          </IonButton>
          {data.status === 'fulfillable' && !isDownloaded && (
            <IonButton onClick={download} fill="solid" color="tertiary">
              Download
            </IonButton>
          )}
          {data.status === 'fulfillable' && isDownloaded && (
            <IonButton fill="solid" color="tertiary">
              Read Book
            </IonButton>
          )}
          {data.summary && (
            <>
              <h2>Summary</h2>
              <p dangerouslySetInnerHTML={{ __html: data.summary }} />
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default BookDetailPage
