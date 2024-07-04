import { Box, Text } from '@chakra-ui/layout';
import {
    Avatar,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Tooltip,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';

import NotificationBadge, { Effect } from 'react-notification-badge';

const SideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loadig, setLoading] = useState(false);
    const [loadigChat, setLoadingChat] = useState();
    const toast = useToast();

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

    const history = useNavigate();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history('/');
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please enter something to search!!',
                position: 'top-right',
                duration: 3000,
                status: 'warning',
                isClosable: true,
            });
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-type': 'application/json',
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;
            const { data } = await axios.get(`${serverUrl}/api/user?search=${search}`, config);

            setSearchResult(data.data);
            setLoading(false);
            // setTimeout(() => setLoading(false), 5000);
        } catch (error) {
            toast({
                title: 'Failed to load the search..',
                position: 'top-right',
                duration: 3000,
                status: 'error',
                isClosable: true,
            });
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-type': 'application/json',
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;
            const { data } = await axios.post(`${serverUrl}/api/chat`, { userId }, config);

            // check if the data of chats received from server is exists or not
            // if not set or add to chats State
            if (!chats.find((c) => c._id) === data._id) setChats([data, ...chats]);
            // const filteredChat = chats.find((c) => c._id) === data._id;
            setSelectedChat(data);
            // setLoading(false);
            // setLoadingState(true);
            setLoadingChat(false);
        } catch (error) {
            // console.log(error);
            toast({
                title: 'Error while fetching the chats',
                position: 'top-right',
                duration: 3000,
                status: 'error',
                isClosable: true,
            });
            // setLoading(false);
            setChats(false);
        }
    };

    return (
        <>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bg={'white'}
                w={'100%'}
                p={'5px 10px'}
                borderRadius={'5px'}
            >
                <Tooltip label='search Users to Chat ' hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen}>
                        <i className='fas fa-search'></i>
                        <Text display={{ base: 'none', md: 'flex' }}>Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize={'2x1'} fontFamily={'work sans'}>
                    {' '}
                    Connecto Chat
                </Text>

                <Menu>
                    <MenuButton p={1}>
                        <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                        <BellIcon fontSize={'2xl'} m={1} />
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && 'No new Messages'}
                        {notification.map((notif) => (
                            <MenuItem
                                key={notif._id}
                                onClick={() => {
                                    // on click setti g selected chat will redirect or open the single chat model
                                    setSelectedChat(notif.chat);
                                    // removing the selected chat from notification
                                    setNotification(notification.filter((n) => n !== notif));
                                }}
                            >
                                {/* this will be used to show the notifications if group or single chat */}
                                {notif.chat.isGroupChat
                                    ? `New Message in ${notif.chat.chatName}`
                                    : `New Message from ${getSender(user, notif.chat.users)}`}
                                {/* getSender will return sender name */}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>

                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} />
                    </MenuButton>

                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'}>Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb={'2px'}>
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>

                        {loadig ? (
                            <ChatLoading />
                        ) : (
                            searchResult.map((user, ind) => (
                                <UserListItem
                                    key={ind}
                                    // key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadigChat && <Spinner ml={'auto'} display={'flex'} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;
