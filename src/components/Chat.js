import React, { useEffect, useState, useRef } from "react";
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
import backIcon from '../icons/undo.png';
import sendMssg from '../icons/send-message.png';



const Chat = (props) => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesRef = collection(db, "messages");
    const messagesContainerRef = useRef(null);


    useEffect(() => {
        console.log(auth)
        const getMessages = async () => {
            const queryMessages = query(messagesRef, where('room', '==', props.roomName), orderBy('createdAt'));
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

        };

        getMessages();
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;

    }, [props.roomName]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            // Scroll to the end of the container when messages update
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessageHandler = async () => {
        if (newMessage === "") return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room: props.roomName,
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

    return (
        <div className="chat-app" onSubmit={ submitHandler }>
            <div className="chat-container">
                <div className="header-container">
                    <div className="header">
                        <img src={ chatIcon } alt="" className="chat-icon" />
                        <h1>{ props.roomName.toUpperCase() }'s room</h1>
                    </div>
                    <hr />
                </div>

                <div className="messages" ref={ messagesContainerRef }>
                    { messages.map((message) => {
                        const isCurrentUser =
                            auth.currentUser.displayName
                                .toString()
                                .toLowerCase()
                                .replace(' ', '') ===
                            message.user.toString().toLowerCase().replace(' ', '');
                        if (isCurrentUser) {
                            return <div className="message-left" key={ message.id }>
                                <span className="user">{ message.user }: </span>
                                <div className="user-text">
                                    <div className="text-left">
                                        <span >{ message.text }</span>
                                    </div>
                                </div>
                                <span className="message-time">  { message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString() : "" }</span>

                            </div>
                        }
                        return <div className="message-right" key={ message.id }>
                            <div className="user-text">
                                <span className="message-time">  { message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString() : "" }</span>
                                <div className="text-right">
                                    <span >{ message.text }</span>
                                </div>
                            </div>
                            <span className="user"> :{ message.user }</span>

                        </div>
                    }


                    ) }
                </div>

                <form className="new-message-form">
                    <hr />
                    <div className="new-message-input-container">
                        <input
                            type="text"
                            className="new-message-input"
                            placeholder="Write Something"
                            onChange={ messageChangeHandler }
                            value={ newMessage }
                        />
                        <img src={ sendMssg } alt="" className="send-button" onClick={ sendMessageHandler } />
                    </div>

                </form>
            </div>

        </div>
    );
};

export default Chat;
