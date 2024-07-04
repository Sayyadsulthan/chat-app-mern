import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Text } from '@chakra-ui/layout';
import { FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import { ThreeDots } from 'react-loader-spinner';

// import socket tio for realtime message
import io from 'socket.io-client';
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();
    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;

            const { data } = await axios.get(
                `${serverUrl}/api/messages/${selectedChat._id}`,
                config
            );
            setMessages(data);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: 'Failed to fetch the messages',
                position: 'top-right',
                duration: 3000,
                status: 'error',
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const serverUrl = import.meta.env.VITE_API_URL;
                const { data } = await axios.post(
                    `${serverUrl}/api/messages`,
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );

                // emitting an event to backend that will emit the other event
                socket.emit('new message', data);
                setMessages([...messages, data]);
                setNewMessage('');
                // setSelectedChat(selectedChat);
            } catch (error) {
                toast({
                    title: 'Error Occured',
                    description: 'Failed to send the message',
                    position: 'top-right',
                    duration: 3000,
                    status: 'error',
                    isClosable: true,
                });
            }
        }
    };

    useEffect(() => {
        const serverUrl = import.meta.env.VITE_API_URL;
        socket = io(`${serverUrl}`);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // give notification if the user on other chat or chat not exist
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    // this will be used in rerender the fetching chat at MyChats
                    setFetchAgain(!fetchAgain);
                }
            } else {
                // if use on the same chat then add to the messages array
                setMessages([...messages, newMessageReceived]);
            }
        });
    });
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        // typing indicator image
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
            // return;
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        pb={3}
                        px={3}
                        fontFamily={'Work sans'}
                        fontSize={{ base: '28px', md: '30px' }}
                        w={'100%'}
                        display={'flex'}
                        justifyContent={{ base: 'space-between' }}
                        alignItems={'center'}
                    >
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat('')}
                        />

                        {/* to show the eye button on chat  selected chat*/}
                        {!selectedChat.isGroupChat ? (
                            <>
                                {/* this method will help to find the user name from chats One - One */}
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {/* this will used show the group chat */}
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display={'flex'}
                        flexDir={'column'}
                        justifyContent={'flex-end'}
                        p={3}
                        w={'100%'}
                        h={'100%'}
                        borderRadius={'lg'}
                        overflowY={'hidden'}
                        bg={'#E8E8E8'}
                    >
                        {/* Message here */}
                        {loading ? (
                            <Spinner
                                size={'xl'}
                                w={20}
                                h={20}
                                alignSelf={'center'}
                                margin={'auto'}
                            />
                        ) : (
                            <div className='messages'>
                                {/*Message */}
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping ? (
                                <div>
                                    <ThreeDots
                                        visible={true}
                                        height='20'
                                        width='80'
                                        color='#4fa94d'
                                        radius='9'
                                        ariaLabel='three-dots-loading'
                                        wrapperStyle={{}}
                                        wrapperClass=''
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Input
                                variant={'filled'}
                                bg='#E0E0E0'
                                placeholder='Enter a message....'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} h={'100%'}>
                    {' '}
                    <Text fontSize={'3x1'} pb={3} fontFamily={'Work sans'}>
                        Click on a user to Start Chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
