import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { setupInterceptor } from './https';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { store } from './store';
import { SocketContextProvider } from './store/SocketContext';
import { UIEffectProvider } from './store/UIEffectContext';

setupInterceptor(store);
if (!process.env.REACT_APP_FIREBASE_VAPID_KEY) throw new Error('REACT_APP_FIREBASE_VAPID_KEY is missing');
if (!process.env.REACT_APP_PREMIUM_PRICE) throw new Error('REACT_APP_PREMIUM_PRICE is missing');
if (!process.env.REACT_APP_PROFILE_MIN_AGE || !process.env.REACT_APP_PROFILE_MAX_AGE)
    throw new Error('REACT_APP_PROFILE_MIN_AGE or REACT_APP_PROFILE_MAX_AGE is missing');
if (!process.env.REACT_APP_CALL_LIMIT_FROM || !process.env.REACT_APP_CALL_LIMIT_TO)
    throw new Error('REACT_APP_CALL_LIMIT_FROM or REACT_APP_CALL_LIMIT_TO is missing');

ReactDOM.render(
    <StrictMode>
        <Provider store={store}>
            <SocketContextProvider>
                <UIEffectProvider>
                    <App />
                </UIEffectProvider>
            </SocketContextProvider>
        </Provider>
    </StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
