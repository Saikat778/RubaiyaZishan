import React from "react";
import { CategoryPosts } from "./post";

export const Reviews = () => {
  return (
  <>
    <div className='backgroundImg'>
      <img src='/images/76289.jpg' className='bg_img'/>
    </div>
    <CategoryPosts category="review" />
  </>
);
};