import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Route, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import TestCmp from '../components/TestCmp';
import { RootState } from '../store';
import { QueueState } from '../store/queue/queue.slice';
import SocketContext from '../store/SocketContext';

const TestPage: FC<RouteComponentProps> = ({ match }) => {
    const { filter: queueFilter } = useSelector((state: RootState) => state.queue) as QueueState;
    const { requestQuestionaire, startFindingCall, rejectQuestionaire, endCall } =
        useContext(SocketContext);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="light">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Test Page</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color="light" className="text-center">
                <h1 className="mt-3 text-lg font-bold text-red-600">
                    Welcome to Test Page
                </h1>
                <Link to={`${match.url}/1`}>go to nested route</Link>

                {/* <h1>Finding Queue: {queue}</h1>
                <h1>Caller: {callInfo?.callerInfo.displayName}</h1> */}
                <IonButton onClick={startFindingCall.bind(null, queueFilter)}>Finding Call</IonButton>
                <IonButton onClick={requestQuestionaire}>Request Questionaire</IonButton>
                <IonButton onClick={rejectQuestionaire}>Reject Questionaire</IonButton>
                {/* <IonButton onClick={submitAnswers}>Submit Answer</IonButton> */}
                <IonButton onClick={endCall}>End Call</IonButton>
                {/* Route Defined */}
                <Route path="/test/1" component={TestCmp} />
            </IonContent>
        </IonPage>
    );
};

export default TestPage;

/* 
	Giải thích: 
	- Nếu ta đặt route bên trong <RouteOutlet> thì nó sẽ là page
	và chỉ có thể switch qua lại giữa 1 page
	- Nếu đặt route bên ngoài <RouteOutlet> => Route sẽ được render bên bên ParentComponent nếu thoả điều kiện path
*/

/* 
    const callSocket = manager.socket('/call'); // Call API (Init khi đã đăng nhập)

    callSocket.emit('initCall')


    mainSocket.on('appToClient', (data) => console.log('appToClient', data));
    mainSocket.emit('joinCounter', 'Xin chào đây là data đến từ client', (res: any) => console.log(res));
    mainSocket.on('joinCounter', (res: any) => console.log(res));
    mainSocket.emit('joinDto', { id: 'asads' }, (err: any) => console.log(err));
    mainSocket.emit('joinRoom', 'asdad');
    mainSocket.on('counter', (data: any) => console.log(data));
*/
