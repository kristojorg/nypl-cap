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
import { ROOT_LANE_URL } from '~/lib/constants'
import useSWR from 'swr'
import { fetchCollection } from '~/lib/fetching/fetch'
import ListLoader from '~/components/ListLoader'
import ListItem from '~/components/ListItem'

const Browse: React.FC = () => {
  const { data, mutate, isValidating } = useSWR(ROOT_LANE_URL, fetchCollection)

  async function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    await mutate()
    event.detail.complete()
  }

  if (!data)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Browse</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Browse</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <ListLoader />
        </IonContent>
      </IonPage>
    )

  const testLane = data.lanes[7]

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Browse</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Browse</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonListHeader>{testLane.title}</IonListHeader>
        <IonList>
          {testLane.books.map((book) => (
            <ListItem key={book.id} book={book} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Browse
