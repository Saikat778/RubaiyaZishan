import React from "react";
import { CategoryPosts } from "./post";

export const Poems = () => {
  return (
   <div>
      <div className='backgroundImg'>
         <img src='/images/76289.jpg' className='bg_img'/>
      </div>
      <CategoryPosts category="poem" />
   </div>
   );
};