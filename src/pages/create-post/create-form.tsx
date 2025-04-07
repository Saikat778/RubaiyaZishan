import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup"
import {addDoc, collection} from "firebase/firestore"
import { db } from "../../config/firebase";
import { useState } from "react";

// addDoc to add a new record in the database
// collection specifies in which table we want to insert the data

type Category = "story" | "poem" | "review" | "academic";

interface CreateFormData {
   title: string;
   description: string;
   category: Category;
   img?: string;
}

export const CreateForm = () => {
   const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

   const schema = yup.object().shape({
      title: yup.string().required("Title kothay baby?").test("word-count", "Title should not exceed 15 words", (value) => {
            return (value?.trim().split(/\s+/).length || 0) <= 15;
         }),
      description: yup.string().required("Post koiiii").test("word-count", "Description should not exceed 10000 words", (value) => {
            return (value?.trim().split(/\s+/).length || 0) <= 10000;
         }),
      category: yup.string().oneOf(["story", "poem", "review", "academic"], "Invalid category")
         .required("Please category ta deo"),
      img: yup.string().url("Invalid image URL"),
   });
   const {register, handleSubmit, formState: {errors},} = useForm<CreateFormData> ({
      resolver: yupResolver(schema),
   })

   const postsRef = collection(db, "posts");

   const onCreatePost = async (data:CreateFormData) => {
      await addDoc(postsRef,{
         ...data,
         // title: data.title,
         // description: data.description,
      });
      setSubmissionMessage("Your post has been successfully created!");
   }

   const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
   };

   return (
      <div className="form-div">
         <form className="post-form" onSubmit={handleSubmit(onCreatePost)}>
            <input className="input-title" placeholder="Title" {...register("title")}/>
            <p>{errors.title?.message}</p>
            <textarea className="input-des" placeholder="Splash your brain here Rubaiya" onInput={handleInput} {...register("description")} style={{overflow:"hidden", resize:"none"}}/>
            <p>{errors.description?.message}</p>
            <div className="cat-div">
               <select className="input-cat" {...register("category")}>
                  <option value="">Select a category</option>
                  <option value="story">Story</option>
                  <option value="poem">Poem</option>
                  <option value="review">Review</option>
                  <option value="academic">Academic</option>
               </select>
               <input className="input-img" placeholder="image url link" {...register("img")}/>
            </div>
            <input className="submit-btn" type="submit" />
         </form>
         {submissionMessage && <p>{submissionMessage}</p>}
      </div>
   );
};