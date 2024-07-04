import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@chakra-ui/layout';
import { ChatState } from '../../Context/ChatProvider';
import SideDrawer from '../../components/miscellaneous/SideDrawer';
import MyChats from '../../components/MyChats';
import ChatBox from '../../components/ChatBox';
const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: '100%' }}>
            {user && <SideDrawer />}
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '91.5vh',
                    padding: '10',
                }}
                m={3}
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    );
};

export default ChatPage;
