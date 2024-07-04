export const getSender = (loggedUser, users) => {
    // usere  is anm array
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, msg, ind, userId) => {
    return (
        ind < messages.length - 1 &&
        (messages[ind + 1].sender._id !== msg.sender._id ||
            messages[ind + 1].sender._id === undefined) &&
        messages[ind].sender._id !== userId
    );
};

export const isLastMessage = (messages, ind, userId) => {
    return (
        ind === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameSenderMargin = (messages, msg, ind, userId) => {
    // TO SET THE MARGIN PROPERTY
    // if the message sender is not equals the logged user &&
    //  the messages && next message sender is same
    if (
        ind < messages.length - 1 &&
        messages[ind + 1].sender._id === msg.sender._id &&
        messages[ind].sender._id !== userId
    ) {
        return 33;
    }
    // if the message sender is not equals the logged user &&
    //  the messages && next message sender is not same
    else if (
        (ind < messages.length - 1 &&
            messages[ind + 1].sender._id !== msg.sender._id &&
            messages[ind].sender._id !== userId) ||
        (ind === messages.length - 1 && messages[ind].sender._id !== userId)
    ) {
        return 0;
    }
    // else state ment
    else {
        return 'auto';
    }
};

export const isSameUser = (messages, msg, ind) => {
    return ind > 0 && messages[ind - 1].sender._id === msg.sender._id;
};
