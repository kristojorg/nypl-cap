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
  useIonLoading,
} from '@ionic/react'
import { LOANS_ENDPOINT, ME_ENDPOINT } from '~/lib/constants'
import { useUser } from '~/lib/storage'
import * as React from 'react'
import { mutate } from 'swr'

/**
 * 23333999999931/3787
 */

const Settings: React.FC = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [user, setUser] = useUser()
  const [present, dismiss] = useIonLoading()

  async function signIn() {
    if (!username || !password) {
      console.error('Username or password is empty')
      return
    }
    present({ message: 'Logging in...' })
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
    dismiss()
  }

  async function signOut() {
    setUser(undefined)
    mutate(LOANS_ENDPOINT)
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
          <IonButton expand="block" style={{ margin: 16 }} onClick={signOut}>
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
        <IonButton expand="block" style={{ margin: 16 }} onClick={signIn}>
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Settings
