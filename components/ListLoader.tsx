import {
  IonSkeletonText,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonAvatar,
  IonThumbnail,
} from '@ionic/react'

const items = [1, 2, 3, 4, 5, 6, 7]

const ListLoader = () => {
  return (
    <>
      <IonList>
        <IonListHeader>
          <IonLabel>
            <IonSkeletonText animated style={{ width: '40%', height: 20 }} />
          </IonLabel>
        </IonListHeader>
      </IonList>
      {items.map((item) => (
        <LoadingItem key={item} />
      ))}
    </>
  )
}

const LoadingItem = () => {
  return (
    <IonItem>
      <IonThumbnail slot="start">
        <IonSkeletonText animated />
      </IonThumbnail>
      <IonLabel>
        <h3>
          <IonSkeletonText animated style={{ width: '50%' }} />
        </h3>
        <p>
          <IonSkeletonText animated style={{ width: '80%' }} />
        </p>
        <p>
          <IonSkeletonText animated style={{ width: '60%' }} />
        </p>
      </IonLabel>
    </IonItem>
  )
}
export default ListLoader
