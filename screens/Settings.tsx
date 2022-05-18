import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import * as React from 'react'
import ExploreContainer from '../components/ExploreContainer'

const Tab3: React.FC = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
          <IonLabel>Username</IonLabel>
          <IonInput
            value={username}
            placeholder="Enter Input"
            onIonChange={(e) => setUsername(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>Password</IonLabel>
          <IonInput
            value={password}
            placeholder="Enter Input"
            onIonChange={(e) => setPassword(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonButton expand="block" style={{ margin: 16 }}>
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Tab3
