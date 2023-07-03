import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { AppDispatch } from '../store';
import { logoutThunk, setTokenThunk } from '../store/auth/auth.thunk';

const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) dispatch(setTokenThunk(userAuth));
            else dispatch(logoutThunk());
        });
    }, [dispatch]);
};

export default useAuth;
