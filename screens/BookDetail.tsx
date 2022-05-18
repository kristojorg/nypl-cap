import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react'
import ExploreContainer from '../components/ExploreContainer'
import { fetchBook } from '../fetching/fetch'
import { RouteComponentProps } from 'react-router'
import useSWR from 'swr'

interface BookDetailProps
  extends RouteComponentProps<{
    bookUrl: string
  }> {}

const BookDetailPage: React.FC<BookDetailProps> = ({ match }) => {
  const bookUrl = decodeURIComponent(match.params.bookUrl)

  const { data, mutate, isValidating } = useSWR(bookUrl, fetchBook)

  async function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    await mutate()
    event.detail.complete()
  }

  console.log(data)

  if (!data)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Book Detail</IonTitle>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <ExploreContainer name="Book Detail" />
        </IonContent>
      </IonPage>
    )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Book Detail</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ padding: 16 }}>
          <IonImg src={data.imageUrl} style={{ maxWidth: '40%' }} />
          <h1>{data.title}</h1>
          <p>
            <strong>Authors: </strong>
            {data.authors?.join(', ')}
          </p>
          <IonButton color="primary" strong fill="solid">
            Borrow
          </IonButton>
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
