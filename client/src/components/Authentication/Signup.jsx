import React, { useState } from 'react';
import {
    Stack,
    HStack,
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useNavigate();

    const PostDetails = (pics) => {
        if (!pics) {
            return toast({
                title: 'Please select an Image!',
                position: 'top-right',
                duration: 3000,
                status: 'warning',
                isClosable: true,
            });
        }
        // console.log(pics.type);
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            setLoading(true);
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', 'chat_app'); // present file name
            data.append('cloud_name', 'sayyadprojects'); // cloud project name
            const url = import.meta.env.VITE_CLOUDINARY_URL;
            fetch(url, {
                method: 'POST',
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: 'Please select an Image!',
                position: 'top-right',
                duration: 3000,
                status: 'warning',
                isClosable: true,
            });
        }
    };

    const submitHandler = async () => {
        if ((!name, !email || !password || !confirmPassword)) {
            return toast({
                title: 'Please fill Required fields!',
                position: 'top-right',
                duration: 3000,
                status: 'warning',
                isClosable: true,
            });
        }

        if (password !== confirmPassword) {
            return toast({
                title: 'password & confirmpassword not natch!',
                position: 'top-right',
                duration: 3000,
                status: 'warning',
                isClosable: true,
            });
        }
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };
            const serverUrl = import.meta.env.VITE_API_URL;
            const { data } = await axios.post(
                `${serverUrl}/api/user/register`,
                { name, email, password, pic },
                config
            );

            localStorage.setItem('User', JSON.stringify(data.token));
            setLoading(false);
            toast({
                title: 'registration Successfull..',
                position: 'top-right',
                duration: 3000,
                status: 'success',
                isClosable: true,
            });
            history('/chat');
        } catch (err) {
            console.log(err.stack);
            toast({
                title: err.message,
                position: 'top-right',
                duration: 3000,
                status: 'error',
                isClosable: true,
            });
        }
    };
    return (
        <VStack spacing={'5px'}>
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter Your Name." onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter Your Email." onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Enter Password."
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <InputRightElement width={'4.5rem'}>
                        <Button
                            /*height={'1.5rem'} */ /*size={'sm'} */ onClick={(e) => setShow(!show)}
                        >
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Enter Password."
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <InputRightElement width={'4.5rem'}>
                        <Button
                            /*height={'1.5rem'} */ /*size={'sm'} */ onClick={(e) => setShow(!show)}
                        >
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Picture</FormLabel>
                <Input
                    type="file"
                    p={'1.5px'}
                    accept="image/*"
                    // onChange={(e) => PostDetails(e.target.files[0])}
                    onChange={(e) => PostDetails(e.target.files[0])}
                />
            </FormControl>

            <Button onClick={submitHandler} colorScheme="blue" width={'100%'} isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    );
};

export default Signup;
