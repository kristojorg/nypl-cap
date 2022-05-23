import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react'
import { LOANS_ENDPOINT } from '~/lib/constants'
import useSWR from 'swr'
import { fetchLoans } from '~/lib/fetching/fetch'
import ListLoader from '~/components/ListLoader'
import ListItem from '~/components/ListItem'
import { useUser } from '~/lib/storage'
import useLoanDownloads from '~lib/downloads'

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

  if (!user?.token)
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              height: '100%',
            }}
          >
            <p>You are not signed in. Please go to settings and sign in.</p>
          </div>
        </IonContent>
      </IonPage>
    )

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              height: '100%',
            }}
          >
            <p>You have no books on loan.</p>
          </div>
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
