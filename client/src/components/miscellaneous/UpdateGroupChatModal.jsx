import { ViewIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Spinner,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserbadgeItem from '../UserAvatar/UserbadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // getting and setting the value to state using hooks
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groupChatName, setGroupChatName] = useState('');
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();
    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: 'Only admin can remove someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;

            const { data } = await axios.put(
                `${serverUrl}/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    user: user1._id,
                },
                config
            );
            // check if the logged user is removed from the group
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: 'User already exist in Group!',

                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        // checking the logged in user is the admin or not
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only admin can add some one',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;

            const { data } = await axios.put(
                `${serverUrl}/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    user: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;

            const { data } = await axios.put(
                `${serverUrl}/api/chat/rename`,
                { chatId: selectedChat._id, chatName: groupChatName },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            setGroupChatName('');
            setRenameLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;
            const { data } = await axios.get(`${serverUrl}/api/user?search=${query}`, config);

            setSearchResult(data.data);
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load the chat Result',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton icon={<ViewIcon />} display={'flex'} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'35px'}
                        fontFamily={'Work sans'}
                        display={'flex'}
                        justifyContent={'center'}
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'} pb={3}>
                            {selectedChat.users.map((u) => (
                                <UserbadgeItem
                                    user={u}
                                    key={u._id}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>

                        <FormControl display={'flex'}>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => {
                                    setGroupChatName(e.target.value);
                                }}
                            />

                            <Button
                                variant={'solid'}
                                colorScheme={'teal'}
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl display={'flex'}>
                            <Input
                                placeholder='Add user to Group'
                                mb={3}
                                // value={groupChatName}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size={'lg'} />
                        ) : (
                            searchResult.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
