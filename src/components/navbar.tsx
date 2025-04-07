import { Link, useLocation } from "react-router-dom" ;
import {auth} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export const Navbar = () => {
   const [user] = useAuthState(auth);

   const signUserOut = async () => {
      await signOut(auth);
   }


   return (
   <div className="nav-container">
      <h2 className="title">Rubaiya Zishan</h2>
      <div className="navbar">
         <Link to="/#home" className="links">Home</Link>
         <Link to="/#about" className="links">About Me</Link>
         <Link to="/#contact" className="links">Contact</Link>
         {!user? (
            <Link to="/login" className="links">Login</Link>
         ) :(
            user?.email === "saikat.starkish@gmail.com" ? (
               <Link to="/createpost" className="links"> Create Post</Link>
            ) : null
         )}

         {user && (
            <button onClick={signUserOut} className="btn-logOut">Log out</button>
         )}
      </div>


      <div>
         
      </div>
   </div>
   )
}