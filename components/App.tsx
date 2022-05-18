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

import Browse from '../screens/Browse'
import MyBooks from '../screens/MyBooks'
import Settings from '../screens/Settings'
import BookDetailPage from '../screens/BookDetail'

/**
 * Update the status bar color scheme
 */
// window
//   ?.matchMedia('(prefers-color-scheme: dark)')
//   .addEventListener('change', async (status) => {
//     try {
//       await StatusBar.setStyle({
//         style: status.matches ? Style.Dark : Style.Light,
//       })
//     } catch {}
//   })

const TabLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/browse">
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
              <IonLabel>Browse</IonLabel>
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
