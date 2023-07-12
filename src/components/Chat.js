import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";

import './Chat.css';

import chatIcon from '../icons/chat-icon.png';
import sendMssg from '../icons/send-message.png';


const Chat = ({ roomName }) => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [messagesCollection, setMessagesCollection] = useState();

    const messagesContainerRef = useRef(null);

    const getMessages = useCallback(async () => {
        const queryMessages = query(messagesCollection, where('room', '==', roomName), orderBy('createdAt'));
        const unsunscribe = await onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages);
        });
        return () => {
            unsunscribe();
        };

    }, [messagesCollection, roomName]);


    const sendMessageHandler = async () => {
        if (newMessage === "") return;

        await addDoc(messagesCollection, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room: roomName,
        });

        setNewMessage("");
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await sendMessageHandler();
    };

    const messageChangeHandler = (e) => {
        setNewMessage(e.target.value);
    };

    useEffect(() => {
        getMessages();
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;

    }, [roomName, getMessages]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            // Scroll to the end of the container when messages update
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (auth && auth.currentUser) {
            setCurrentUser(auth.currentUser.displayName
                .toString()
                .toLowerCase()
                .replace(' ', ''));
            setMessagesCollection(collection(db, "messages"));
        }
    }, []);

    return (
        <div className="chat-app" onSubmit={submitHandler}>
            <div className="chat-container">
                <div className="header-container">
                    <div className="header">
                        <img src={chatIcon} alt="" className="chat-icon" />
                        <h1>{roomName.toUpperCase()}'s room</h1>
                    </div>
                    <hr />
                </div>

                <div className="messages" ref={messagesContainerRef}>
                    {messages.map((message) => {
                        return currentUser === message.user.toString().toLowerCase().replace(' ', '') ?
                            (<div className="message-left" key={message.id}>
                                <span className="user">{message.user}: </span>
                                <div className="user-text">
                                    <div className="text-left">
                                        <span >{message.text}</span>
                                    </div>
                                </div>
                                <span className="message-time">  {message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString() : ""}</span>

                            </div>) : (
                                <div className="message-right" key={message.id}>
                                    <div className="user-text">
                                        <span className="message-time">  {message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString() : ""}</span>
                                        <div className="text-right">
                                            <span >{message.text}</span>
                                        </div>
                                    </div>
                                    <span className="user"> :{message.user}</span>

                                </div>
                            )
                    })}
                </div>

                <form className="new-message-form">
                    <hr />
                    <div className="new-message-input-container">
                        <input
                            type="text"
                            className="new-message-input"
                            placeholder="Write Something"
                            onChange={messageChangeHandler}
                            value={newMessage}
                        />
                        <img src={sendMssg} alt="" className="send-button" onClick={sendMessageHandler} />
                    </div>

                </form>
            </div>

        </div>
    );
};

export default Chat;
