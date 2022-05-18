import { IonLabel, IonItem, IonThumbnail, IonImg } from '@ionic/react'
import React from 'react'
import { OpenEBook } from '../interfaces'

const ListItem: React.FC<{ book: OpenEBook }> = ({ book }) => {
  return (
    <IonItem routerLink={`/browse/book/${encodeURIComponent(book.url)}`}>
      {/* <IonThumbnail slot="start"> */}
      <IonImg
        src={book.imageUrl}
        style={{
          maxWidth: '20%',
          marginTop: 10,
          marginBottom: 10,
          marginRight: 10,
        }}
      />
      {/* </IonThumbnail> */}
      <IonLabel>
        <h3>{book.title}</h3>
        <p>{book.authors?.join(', ')}</p>
        {/* <p>
          <IonSkeletonText animated style={{ width: '60%' }} />
        </p> */}
      </IonLabel>
    </IonItem>
  )
}

export default ListItem
