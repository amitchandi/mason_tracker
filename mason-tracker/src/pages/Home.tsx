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
  IonList,
  IonSpinner
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { ApiService, DogWalkingRecord } from '../services/ApiService';
import './Home.css';

const Home: React.FC = () => {
  const [todayRecord, setTodayRecord] = useState<DogWalkingRecord | null>(null);
  const [weeklyRecords, setWeeklyRecords] = useState<DogWalkingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [today, weekly] = await Promise.all([
        ApiService.getTodayRecord(),
        ApiService.getWeeklyRecords()
      ]);
      setTodayRecord(today);
      setWeeklyRecords(weekly);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWalkedChange = async (checked: boolean) => {
    try {
      const updatedRecord = await ApiService.createOrUpdateRecord(
        checked,
        todayRecord?.pooped || false
      );
      setTodayRecord(updatedRecord);
      await loadData(); // Reload weekly records
    } catch (err) {
      setError('Failed to update walk status. Please try again.');
      console.error(err);
    }
  };

  const handlePoopedChange = async (checked: boolean) => {
    try {
      const updatedRecord = await ApiService.createOrUpdateRecord(
        todayRecord?.walked || false,
        checked
      );
      setTodayRecord(updatedRecord);
      await loadData(); // Reload weekly records
    } catch (err) {
      setError('Failed to update poop status. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div className="ion-text-center">
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mason's Daily Walk</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && (
          <div className="ion-text-center ion-text-danger">
            {error}
          </div>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Today's Status</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
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
            {todayRecord?.walked && (
              <div className="ion-text-center">
                <p>Walked by: {todayRecord.walkedBy}</p>
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
                      {record.walked ? 'Walked' : 'Not walked'} • 
                      {record.pooped ? ' Pooped' : ' No poop'} • 
                      {record.walkedBy ? ` By ${record.walkedBy}` : ''}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
