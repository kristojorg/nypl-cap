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
import { ME_ENDPOINT } from '~/lib/constants'
import { useUser } from '~/lib/storage'
import * as React from 'react'

/**
 * 23333999999931/3787
 */

const Settings: React.FC = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setLoading] = React.useState(false)
  const [user, setUser] = useUser()

  async function signIn() {
    if (!username || !password) {
      console.error('Username or password is empty')
      return
    }
    setLoading(true)
    const token = btoa(`${username}:${password}`)
    const header = `Basic ${token}`
    const resp = await fetch(ME_ENDPOINT, {
      headers: {
        Authorization: header,
      },
    })
    if (resp.status === 200) {
      console.log('success', await resp.json())
      setUser({ token: header })
    } else {
      console.error('fail', await resp.json())
    }
    setLoading(false)
  }

  function signOut() {
    setUser(undefined)
  }

  if (user) {
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
          <p>You are logged in</p>
          <IonButton
            expand="block"
            style={{ margin: 16 }}
            onClick={signOut}
            disabled={isLoading}
          >
            Log out
          </IonButton>
        </IonContent>
      </IonPage>
    )
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
