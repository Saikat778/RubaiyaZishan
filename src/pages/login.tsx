import {auth, provider} from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {

   const navigate = useNavigate();
   const signInWithGoogle = async () => {
      const result = await signInWithPopup(auth, provider);
      navigate('/');
   }
   return (
   
   <div className="content login">
      <div className='backgroundImg'>
            <img src='/images/76289.jpg' className='bg_img'/>
      </div>
      <p className="sign-in_text">Sign in with google to continue</p>
      <button className="btn-signin button-17" onClick={signInWithGoogle}>Sign in with Google</button>
   </div>
   )
}