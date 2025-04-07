import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export interface PostData {
  id: string;
  title: string;
  description: string;
  category: string;
  img: string;
}

interface CommentData {
  id: string;
  userId: string;
  username: string;
  commentText: string;
}

export const PostDetails = () => {
  const { postId } = useParams(); // Retrieve postId from the route
  const [post, setPost] = useState<PostData | null>(null);
  const [user] = useAuthState(auth);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [userLikes, setUserLikes] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [customUsername, setCustomUsername] = useState<string>("");

  const likesRef = collection(db, "like");
  const commentsRef = collection(db, "comments");

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, "posts", postId || "");
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        setPost({ ...postDoc.data(), id: postDoc.id } as PostData);
      }
    };

    fetchPost();
  }, [postId]);

  // Fetch likes and user like status
  useEffect(() => {
    const fetchLikes = async () => {
      const likesSnapshot = await getDocs(query(likesRef, where("postId", "==", postId)));
      setLikesCount(likesSnapshot.size);
      if (user) {
        const userLikeSnapshot = await getDocs(
          query(likesRef, where("postId", "==", postId), where("userId", "==", user.uid))
        );
        setUserLikes(!userLikeSnapshot.empty);
      }
    };

    const fetchComments = async () => {
      const commentsSnapshot = await getDocs(query(commentsRef, where("postId", "==", postId)));
      const commentsData = commentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CommentData[];
      setComments(commentsData);
    };

    if (postId) {
      fetchLikes();
      fetchComments();
    }
  }, [postId, user]);

  // Add like
  const addLike = async () => {
    if (!user) return;
    await addDoc(likesRef, { userId: user.uid, postId });
    setUserLikes(true);
    setLikesCount((prev) => prev + 1);
  };

  // Remove like
  const removeLike = async () => {
    if (!user) return;
    const likeSnapshot = await getDocs(
      query(likesRef, where("userId", "==", user.uid), where("postId", "==", postId))
    );
    likeSnapshot.forEach(async (doc) => await deleteDoc(doc.ref));
    setUserLikes(false);
    setLikesCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Add comment
  const addComment = async () => {
    if (!user || !newComment.trim()) return;

    const usernameToDisplay = customUsername.trim() || user.displayName || "Anonymous";

    const newCommentRef = await addDoc(commentsRef, {
      postId,
      userId: user.uid,
      username: usernameToDisplay,
      commentText: newComment.trim(),
      timestamp: new Date(),
    });

    setComments((prev) => [
      ...prev,
      { id: newCommentRef.id, userId: user.uid, username: usernameToDisplay, commentText: newComment.trim() },
    ]);
    setNewComment("");
    setCustomUsername("");
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-details">
      <div className="backgroundImg">
        <img src="/images/76289.jpg" className="bg_img" />
      </div>
      <h2 className="single-post-title">{post.title}</h2>
      {post.img && <img src={post.img} alt={post.title} className="single-post-title"/>}
      <p className="main-des-content single-post-des">
        {post.description.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </p>

      <hr className="post-hr"/>
      {/* Like and Comments Section */}
      <div className="like-comment-section single-like-comment-section">
        {/* Like Section */}
        <div className="like-container single-post-like-container">
          <button className="like-btn" onClick={userLikes ? removeLike : addLike}>
            {userLikes ? "👎" : "👍"}
          </button>
          <p className="like-count">Likes: {likesCount}</p>
        </div>

        {/* Comment Form */}
        <div className="comment-form single-post-comment-form">
         <div className="comment-container single-post-comment-container">
            <input
               type="text"
               placeholder="Add a comment..."
               value={newComment}
               onChange={(e) => setNewComment(e.target.value)}
               className="comment-input cmnt-input"
            />
            <input
               type="text"
               placeholder="Custom username (Optional)"
               value={customUsername}
               onChange={(e) => setCustomUsername(e.target.value)}
               className="custom-name cmnt-input"
            />
            <button className="comment-btn single-post-comment-btn" onClick={addComment}>Comment</button>
         </div>
        </div>

        {/* Display Comments */}
        <div className="comments-display single-post-comments-display">
          {comments.map((comment) => (
            <div className="comment commnent-text" key={comment.id}>
              <strong>{comment.username}</strong>: {comment.commentText}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
