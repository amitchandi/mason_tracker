import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import { useState, useEffect } from 'react';
import StorageService from '../services/StorageService';
import EventService from '../services/EventService';

const Settings: React.FC = () => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = () => {
    const name = StorageService.getUserName();
    if (name) {
      setUserName(name);
    }
  };

  const handleNameChange = (value: string) => {
    setUserName(value);
    if (value.trim()) {
      StorageService.setUserName(value.trim());
      EventService.notifyNameChanged();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Your Name</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput
                value={userName}
                onIonChange={e => handleNameChange(e.detail.value || '')}
                placeholder="Enter your name to track walks"
                className={!userName ? 'ion-text-danger' : ''}
              />
            </IonItem>
            {!userName && (
              <div className="ion-text-center ion-text-danger">
                <p>Please enter your name to track walks</p>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Settings; 