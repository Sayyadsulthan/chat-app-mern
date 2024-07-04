import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import React from 'react';

const UserbadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius={'lg'}
            m={1}
            mb={2}
            variant={'solid'}
            fontSize={12}
            background={'purple'}
            color={'white'}
            cursor={'pointer'}
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon pl={1} />
        </Box>
    );
};

export default UserbadgeItem;
