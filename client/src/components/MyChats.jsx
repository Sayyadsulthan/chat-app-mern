import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const {
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        loadingState,
        setLoadingState,
    } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    'Content-type': 'Application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;
            const { data } = await axios.get(`${serverUrl}/api/chat`, config);

            setChats(data);
            setLoadingState(false);
        } catch (error) {
            console.log(error.stack);
        }
    };

    useEffect(() => {
        // parsing the value from string if user logged in
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChats();
    }, [fetchAgain]);
    // useEffect(() => {
    //     // console.log('local storage: ', JSON.parse(localStorage.getItem('userInfo')));
    //     setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    //     fetchChats();
    // }, [loadingState]);

    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir={'column'}
            alignItems={'center'}
            p={3}
            bg={'white'}
            w={{ base: '100%', md: '31%' }}
            borderRadius={'lg'}
            borderWidth={'1px'}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '28px', md: '30px' }}
                display={'flex'}
                w={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display={'flex'}
                        fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                        rightIcon={<AddIcon />}
                    >
                        new Group Chats
                    </Button>
                </GroupChatModal>
            </Box>
            {/* To render all chats */}
            <Box
                display={'flex'}
                flexDir={'column'}
                p={3}
                bg={'#F8F8F8'}
                w={'100%'}
                h={'100%'}
                borderRadius={'lg'}
                overflowY={'hidden'}
            >
                {chats ? (
                    <Stack overflowY={'scroll'}>
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor={'pointer'}
                                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                                color={selectedChat === chat ? 'white' : 'black'}
                                px={3}
                                py={2}
                                borderRadius={'lg'}
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

export default MyChats;
