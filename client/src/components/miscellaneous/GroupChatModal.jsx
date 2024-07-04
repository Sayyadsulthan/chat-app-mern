import { useDisclosure } from '@chakra-ui/hooks';
import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserbadgeItem from '../UserAvatar/UserbadgeItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();

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
            const { data } = await axios.get(`${serverUrl}/api/user?search=${search}`, config);
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
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;
            const { data } = await axios.post(
                `${serverUrl}/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );

            setChats([data, ...chats]);
            // used to clode the Modal
            onClose();
            toast({
                title: 'New Group chat created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        } catch (error) {
            toast({
                title: 'Failed to create chat',
                description: error.response.data,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
    };
    const handleGroup = (userToAdd) => {
        // check if the user is not exist or  not added in the selected users
        if (!selectedUsers.includes(userToAdd)) {
            // add user to selected users array
            return setSelectedUsers([...selectedUsers, userToAdd]);
        }

        // if user already exist show warning message
        toast({
            title: 'user already added',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top',
        });
    };

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
    };
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display={'flex'}
                        justifyContent={'center'}
                        fontFamily={'Work sans'}
                        fontSize={'35px'}
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
                        {/* <Lorem count={2} /> */}
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {/* selected users */}

                        <Box width={'100%'} display={'flex'} flexWrap={'wrap'}>
                            {selectedUsers.map((u) => (
                                <UserbadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>

                        {/* Render Searched users */}

                        {loading ? (
                            <Spinner />
                        ) : (
                            searchResult
                                .slice(0, 4)
                                .map((user) => (
                                    <UserListItem
                                        user={user}
                                        key={user._id}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GroupChatModal;
