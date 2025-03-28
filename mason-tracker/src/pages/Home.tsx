import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { ApiService, DogWalkingRecord } from '../services/ApiService';
import StorageService from '../services/StorageService';
import EventService from '../services/EventService';
import './Home.css';

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [todayRecord, setTodayRecord] = useState<DogWalkingRecord | null>(null);
  const [weeklyRecords, setWeeklyRecords] = useState<DogWalkingRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserName();
    loadData();
    
    // Listen for name changes
    const nameChangeListener = () => {
      loadUserName();
    };
    EventService.addNameChangeListener(nameChangeListener);
    
    return () => {
      EventService.removeNameChangeListener(nameChangeListener);
    };
  }, []);

  const loadUserName = () => {
    const name = StorageService.getUserName();
    setUserName(name || '');
  };

  const loadData = async () => {
    try {
      const [today, weekly] = await Promise.all([
        ApiService.getTodayRecord(),
        ApiService.getWeeklyRecords()
      ]);
      setTodayRecord(today);
      setWeeklyRecords(weekly);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    }
  };

  const handleWalkedChange = async (checked: boolean) => {
    if (!userName) return;
    
    try {
      const updatedRecord = await ApiService.createOrUpdateRecord({
        walked: checked,
        pooped: checked ? (todayRecord?.pooped || false) : false,
        date: new Date().toISOString().split('T')[0],
        walkedBy: userName
      });
      setTodayRecord(updatedRecord);
      await loadData();
    } catch (err) {
      setError('Failed to update walk status. Please try again.');
      console.error(err);
    }
  };

  const handlePoopedChange = async (checked: boolean) => {
    if (!userName) return;
    
    try {
      const updatedRecord = await ApiService.createOrUpdateRecord({
        walked: todayRecord?.walked || false,
        pooped: checked,
        date: new Date().toISOString().split('T')[0],
        walkedBy: userName
      });
      setTodayRecord(updatedRecord);
      await loadData();
    } catch (err) {
      setError('Failed to update poop status. Please try again.');
      console.error(err);
    }
  };

  const handleFedChange = async (checked: boolean) => {
    if (!userName) return;
    
    try {
      const updatedRecord = await ApiService.createOrUpdateRecord({
        fed: checked,
        date: new Date().toISOString().split('T')[0],
        walkedBy: userName
      });
      setTodayRecord(updatedRecord);
      await loadData();
    } catch (err) {
      setError('Failed to update fed status. Please try again.');
      console.error(err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mason Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!userName ? (
          <IonCard>
            <IonCardContent>
              <div className="ion-text-center ion-text-danger">
                <p>Please set your name in the Settings tab to track walks</p>
              </div>
            </IonCardContent>
          </IonCard>
        ) : (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Today's Status</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonLabel>Fed</IonLabel>
                    <IonCheckbox
                      checked={todayRecord?.fed || false}
                      onIonChange={e => handleFedChange(e.detail.checked)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Walked</IonLabel>
                    <IonCheckbox
                      checked={todayRecord?.walked || false}
                      onIonChange={e => handleWalkedChange(e.detail.checked)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Pooped</IonLabel>
                    <IonCheckbox
                      checked={todayRecord?.pooped || false}
                      onIonChange={e => handlePoopedChange(e.detail.checked)}
                      disabled={!todayRecord?.walked}
                    />
                  </IonItem>
                </IonList>
                {error && (
                  <div className="ion-text-center ion-text-danger">
                    <p>{error}</p>
                  </div>
                )}
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Weekly History</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {weeklyRecords.map(record => (
                    <IonItem key={record.date}>
                      <IonLabel>
                        <h2>{new Date(record.date).toLocaleDateString()}</h2>
                        <p>
                          {record.fed ? 'Fed' : 'Not fed'} • 
                          {record.walked ? ' Walked' : ' Not walked'} • 
                          {record.pooped ? ' Pooped' : ' No poop'} • 
                          {record.walkedBy ? ` By ${record.walkedBy}` : ''}
                        </p>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
