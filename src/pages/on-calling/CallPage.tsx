import { IonHeader, IonPage } from '@ionic/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PageContentCmp from '../../components/container/PageContentCmp';
import { PATHS } from '../../router/paths';
import CallQuestionPage from '../call-question/CallQuestionPage';
import CallResultPage from '../call-result/CallResultPage';
import OnCallingPage from './OnCallingPage';
import './Animate.css';
import CallMatchingRevealPage from '../call-matching-reveal/CallMatchingRevealPage';
import AvatarToolbarCmp from '../../components/toolbar/AvatarToolbarCmp';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { CallState, increaseTimer } from '../../store/call/call.slice';
import { useSelector } from 'react-redux';
import Peer from 'simple-peer';
import SocketContext from '../../store/SocketContext';

const CallPage: React.FC<RouteComponentProps> = () => {
    const dispatch: AppDispatch = useDispatch();
    const { peering } = useContext(SocketContext);

    /* State */
    const { isMuted, isCalling, isInitializer, otherSignal, isCallEnded } = useSelector(
        (state: RootState) => state.call,
    ) as CallState;
    /* Effect */
    useEffect(() => {
        const _ = setInterval(() => {
            dispatch(increaseTimer());
        }, 1000);
        return () => clearInterval(_);
    }, [dispatch]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [myStream, setMyStream] = useState<MediaStream>();
    const [myPeer, setMyPeer] = useState<Peer.Instance>();
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
            setMyStream(stream);
        });
    }, []);

    useEffect(() => {
        if (!myStream) return;
        const peer = new Peer({
            initiator: isInitializer,
            trickle: true,
            stream: myStream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
                    { urls: 'stun:openrelay.metered.ca:80' },
                    {
                        urls: 'turn:openrelay.metered.ca:80',
                        username: 'openrelayproject',
                        credential: 'openrelayproject',
                    },
                    {
                        urls: 'turn:openrelay.metered.ca:443',
                        username: 'openrelayproject',
                        credential: 'openrelayproject',
                    },
                    {
                        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
                        username: 'openrelayproject',
                        credential: 'openrelayproject',
                    },
                ],
            },
        });
        setMyPeer(peer);
        peer.on('signal', (signal) => {
            peering({ signal });
        });
        peer.on('stream', (stream) => {
            if (!videoRef.current) return;
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        });
    }, [isCalling, isInitializer, myStream, peering]);

    useEffect(() => {
        if (!otherSignal || !myPeer) return;
        myPeer.signal(otherSignal);
    }, [otherSignal, myPeer]);

    useEffect(() => {
        if (!isCallEnded || !myStream) return;
        myStream.getTracks().forEach((track) => track.stop());
    }, [isCallEnded, myStream]);

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <AvatarToolbarCmp isBackBtn={false} />
            </IonHeader>
            <PageContentCmp title="Đàm thoại ẩn danh">
                <video playsInline ref={videoRef} autoPlay muted={isMuted} style={{ display: 'none' }} />
                <BrowserRouter>
                    <TransitionGroup component={null}>
                        <CSSTransition key="transition" classNames="fade" timeout={300}>
                            <Switch>
                                <Route path={`/${PATHS.CALL}/${PATHS.ON_CALLING}`} component={OnCallingPage}/>
                                <Route
                                    path={`/${PATHS.CALL}/${PATHS.CALL_MATCHING_REVEAL}`}
                                    component={CallMatchingRevealPage}/>
                                <Route path={`/${PATHS.CALL}/${PATHS.CALL_QUESTION}`} component={CallQuestionPage} />
                                <Route path={`/${PATHS.CALL}/${PATHS.CALL_RESULT}`} component={CallResultPage} />
                                <Redirect exact from={`/${PATHS.CALL}`} to={`${PATHS.CALL}/${PATHS.CALL_MATCHING_REVEAL}`} />
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                </BrowserRouter>
            </PageContentCmp>
        </IonPage>
    );
};

export default CallPage;
