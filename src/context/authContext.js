import React, {createContext, useState, useEffect} from 'react';
import { getCurrentUser } from '../services/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUser = async () => {
        const currentUser = await getCurrentUser();
        if(currentUser) {
          setUser(currentUser);
            setUserId(currentUser.uid);
        }
        setLoading(false)
      }
        fetchUser()
    }, []);

  const authData = {
    user,
      userId,
      setUser,
      loading
  };

  return (
      <AuthContext.Provider value={authData}>
        {loading ? <div>Loading ...</div> :  children}
    </AuthContext.Provider>
  )
}
