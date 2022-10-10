import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonApp,
} from '@ionic/react'
import React from 'react'
import { book, list, search, settings } from 'ionicons/icons'
import { IonReactRouter } from '@ionic/react-router'
import { Redirect, Route } from 'react-router-dom'

import Browse from './screens/Browse'
import MyBooks from './screens/MyBooks'
import Settings from './screens/Settings'
import BookDetailPage from './screens/BookDetail'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
// import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import '~/lib/theme/variables.css'

import { setupIonicReact } from '@ionic/react'

setupIonicReact()

const TabLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/browse">
              <Browse />
            </Route>
            <Route exact path="/overdrive-browse">
              <Browse />
            </Route>
            <Route
              exact
              path="/browse/book/:bookUrl"
              component={BookDetailPage}
            ></Route>
            <Route exact path="/my-books">
              <MyBooks />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>

            <Route exact path="/">
              <Redirect to="/browse" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="browse" href="/browse">
              <IonIcon icon={list} />
              <IonLabel>Browser</IonLabel>
            </IonTabButton>
            <IonTabButton tab="overdrive" href="/overdrive-browse">
              <IonIcon icon={list} />
              <IonLabel>Overdrive</IonLabel>
            </IonTabButton>
            <IonTabButton tab="my-books" href="/my-books">
              <IonIcon icon={book} />
              <IonLabel>My Books</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settings} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default TabLayout
