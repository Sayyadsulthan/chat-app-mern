import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

export const ChatState = () => {
    return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [notification, setNotification] = useState([]);
    const history = useNavigate();
    useEffect(() => {
        // const userInfo = JSON.parse(localStorage.getItem('User'));
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        setUser(userInfo);
        if (!userInfo) {
            history('/');
        }
    }, [history]);

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                loadingState,
                setLoadingState,
                notification,
                setNotification,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;
