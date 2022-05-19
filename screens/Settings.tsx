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
import { ME_ENDPOINT } from 'lib/constants'
import * as React from 'react'

const Settings: React.FC = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setLoading] = React.useState(false)

  async function signIn() {
    if (!username || !password) {
      console.error('Username or password is empty')
      return
    }
    setLoading(true)
    const token = `Basic ${Buffer.from(
      `${username}:${password}`,
      'base64'
    ).toString('base64')}`
    const resp = await fetch(ME_ENDPOINT, {
      headers: {
        Authentication: token,
      },
    })
    if (resp.status === 200) {
      console.log('success', await resp.json())
    } else {
      console.error('fail', await resp.json())
    }
    setLoading(false)
  }

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
          <IonLabel>Barcode</IonLabel>
          <IonInput
            value={username}
            placeholder="Enter Barcode"
            onIonChange={(e) => setUsername(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>Pin</IonLabel>
          <IonInput
            value={password}
            placeholder="Enter Pin"
            type="password"
            onIonChange={(e) => setPassword(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonButton
          expand="block"
          style={{ margin: 16 }}
          onClick={signIn}
          disabled={isLoading}
        >
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Settings
