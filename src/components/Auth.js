import React from 'react'
import { auth, provider } from '../firebase-config';
import { signInWithPopup } from 'firebase/auth';
import Cookies from 'universal-cookie';
import { ReactComponent as GoogleSvg } from '../icons/google.svg';
import chatImg2 from '../icons/chat-sign2.png';

import './Auth.css';

const cookies = new Cookies();

const Auth = (props) => {

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set('auth-token', result.user.refreshToken);
            props.setIsAuth(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='auth'>
            <div className="parent-container">
                <div className='chat-img'>
                    <img src={ chatImg2 } alt="" />
                </div>
                <div className="auth-container">
                    <div className='sign-in' onClick={ signInWithGoogle }>
                        <GoogleSvg className='google-logo' />
                        <button className='signin-button'> Login with Google </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Auth