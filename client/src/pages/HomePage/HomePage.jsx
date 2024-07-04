import React, { useEffect } from 'react';
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import Login from '../../components/Authentication/Login';
import Signup from '../../components/Authentication/Signup';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';

const HomePage = ({}) => {
    const { setUser } = ChatState();
    const history = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('User'));
        // const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        setUser(userInfo);
        if (userInfo) {
            history('/chat');
        }
    }, [history]);

    return (
        <Container maxW={'xl'} centerContent>
            <Box
                w={'100%'}
                display={'flex'}
                justifyContent={'center'}
                p={3}
                bg={'white'}
                m={'40px 0px 15px 0px'}
                borderRadius={'lg'}
                borderWidth={'1px'}
            >
                <Text fontSize={'xx-large'} fontStyle={'Roboto'}>
                    Talk-A-Tive{' '}
                </Text>
            </Box>

            <Box bg={'white'} width={'100%'} p={4} borderRadius={'lg'} borderWidth={'1px'}>
                <Tabs isFitted variant="soft-rounded" w={'100%'} colorScheme={'green'}>
                    <TabList mb="1em">
                        <Tab>Login</Tab>
                        <Tab>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default HomePage;
