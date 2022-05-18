import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { ROOT_LANE_URL } from '../constants';
import useSWR, { Fetcher } from "swr"
import { fetchCollection } from '../fetching/fetch';



const Browse: React.FC = () => {
  const {data} = useSWR(ROOT_LANE_URL, fetchCollection)

  console.log(data)
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
        <ExploreContainer name="Browse" />
      </IonContent>
    </IonPage>
  );
};

export default Browse;
