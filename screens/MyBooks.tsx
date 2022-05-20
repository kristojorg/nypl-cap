import {
  IonContent,
  IonHeader,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRouterOutlet,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react'
import { LOANS_ENDPOINT, ROOT_LANE_URL } from '~/lib/constants'
import useSWR, { Fetcher } from 'swr'
import { fetchCollection } from '~/lib/fetching/fetch'
import ListLoader from '~/components/ListLoader'
import ListItem from '~/components/ListItem'
import { useUser } from '~/lib/storage'
import { OpenEBook } from '~/lib/interfaces'

// we only need the books out of a collection for loans,
// so this is a utility to extract those.
const fetchLoans: Fetcher<OpenEBook[], [url: string, token: string]> = async (
  url,
  token
) => {
  const collection = await fetchCollection(url, {
    headers: { Authorization: token },
  })
  return collection.books
}

const Browse: React.FC = () => {
  const [user] = useUser()
  const {
    data: books,
    mutate,
    isValidating,
  } = useSWR(user?.token ? [LOANS_ENDPOINT, user.token] : undefined, fetchLoans)

  async function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    await mutate()
    console.log('Refreshed')
    event.detail.complete()
  }

  if (!books && isValidating)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>My Books</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">My Books</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <ListLoader />
        </IonContent>
      </IonPage>
    )

  if (!books || books.length === 0)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>My Books</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">My Books</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <p>You have no books on loan.</p>
        </IonContent>
      </IonPage>
    )

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>My Books</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Books</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonList>
          {books.map((book) => (
            <ListItem key={book.id} book={book} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Browse
