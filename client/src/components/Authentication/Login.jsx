import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useNavigate();
    const toast = useToast();

    const postDetails = async () => {
        if (!password || !email)
            return toast({
                title: data.message,
                position: 'top-right',
                duration: 3000,
                status: 'error',
                isClosable: true,
            });

        setLoading(true);
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        };
        const serverUrl = import.meta.env.VITE_API_URL;
        try {
            const { data } = await axios.post(`${serverUrl}/api/user/login`, {
                email,
                password,
                config,
            });

            if (data.success) {
                // if the response has success as true setting token to localstorage item
                localStorage.setItem('User', JSON.stringify(data.data.token));
                localStorage.setItem('userInfo', JSON.stringify(data.data));
                toast({
                    title: 'Login Successfull..',
                    position: 'top-right',
                    duration: 3000,
                    status: 'success',
                    isClosable: true,
                });
                setLoading(false);
                return history('/chat');
            } else {
                toast({
                    title: data.message,
                    position: 'top-right',
                    duration: 3000,
                    status: 'error',
                    isClosable: true,
                });
                setLoading(false);
            }
        } catch (err) {
            toast({
                title: err.message,
                position: 'top-right',
                duration: 3000,
                status: 'error',
                isClosable: true,
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing={'5px'}>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter Your Email."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        value={password}
                        type={show ? 'text' : 'password'}
                        placeholder="Enter Password."
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <InputRightElement width={'4.5rem'}>
                        <Button
                            /*height={'1.5rem'} */ /*size={'sm'} */ onClick={(e) => setShow(!show)}
                        >
                            {show ? 'Hide ' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button onClick={postDetails} isLoading={loading} colorScheme="blue" width={'100%'}>
                Login
            </Button>
            <Button
                colorScheme="red"
                width={'100%'}
                onClick={() => {
                    setEmail('asulthan088@gmail.com');
                    setPassword('1111');
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
};

export default Login;
