import React, { useEffect, useState } from "react";
import { getDocs, addDoc, collection, query, where, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

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

interface CategoryPostsProps {
  category: string;
}

export const CategoryPosts = (props: CategoryPostsProps) => {
  const { category } = props;
  const uNavigate = useNavigate();
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [likesCount, setLikesCount] = useState<{ [key: string]: number }>({});
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: CommentData[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [customUsername, setCustomUsername] = useState<{ [key: string]: string }>({});

  const likesRef = collection(db, "like");
  const commentsRef = collection(db, "comments");

  const addLike = async (postId: string) => {
    if (!user?.uid) return;
    await addDoc(likesRef, { userId: user.uid, postId });
    setUserLikes((prev) => ({ ...prev, [postId]: true }));
    setLikesCount((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
  };

  const removeLike = async (postId: string) => {
    if (!user?.uid) return;
    const q = query(likesRef, where("userId", "==", user.uid), where("postId", "==", postId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    setUserLikes((prev) => ({ ...prev, [postId]: false }));
    setLikesCount((prev) => ({ ...prev, [postId]: prev[postId] > 0 ? prev[postId] - 1 : 0 }));
  };

  const addComment = async (postId: string) => {
    if (!user?.uid) return;
    const commentText = newComment[postId];
    if (!commentText) return;

    const usernameToDisplay = customUsername[postId]?.trim() || user.displayName || "Anonymous";

    const newCommentRef = await addDoc(commentsRef, {
      postId,
      userId: user.uid,
      username: usernameToDisplay,
      commentText,
      timestamp: new Date(),
    });

    setComments((prev) => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        { id: newCommentRef.id, userId: user.uid, username: usernameToDisplay, commentText },
      ],
    }));

    setNewComment((prev) => ({ ...prev, [postId]: "" }));
    setCustomUsername((prev) => ({ ...prev, [postId]: "" })); // Clear custom username after posting
  };

  const fetchComments = async (postId: string) => {
    const q = query(commentsRef, where("postId", "==", postId));
    const querySnapshot = await getDocs(q);
    const commentsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentData[];
    setComments((prev) => ({ ...prev, [postId]: commentsData }));
  };

  const handlePostClick = (postId: string) => {
    uNavigate(`/post/${postId}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("category", "==", category));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as PostData[];

      setPosts(postsData);

      // Fetch likes and comments count for each post
      postsData.forEach(async (post) => {
        const likesSnapshot = await getDocs(query(likesRef, where("postId", "==", post.id)));
        setLikesCount((prev) => ({ ...prev, [post.id]: likesSnapshot.size }));
        fetchComments(post.id); // Fetch comments for each post
      });
    };

    fetchPosts();
  }, [category, user]);

  return (
    <div className="post-return-container">
      <h2>My posts</h2>
      <div className="post-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              className="overall-post"
              key={post.id}
            >
              <h3 className="post-title">{post.title}</h3>
              <div 
                className="post-content main-des-content"
                
              >
                {post.img && <img className="post-img" src={post.img} alt={post.title || "Post image"} />}
                <p className="post-des">
                  {post.description.slice(0, 70).split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                  <span className="des-span">......see more</span>
                </p>
              </div>
              <hr className="post-hr"/>

              <div className="comment-like-container">
                <div className="like-container">
                  <button className="like-btn" onClick={() => userLikes[post.id] ? removeLike(post.id) : addLike(post.id)}>
                    {userLikes[post.id] ? "👎" : "👍"}
                  </button>
                  <p className="like-count">Likes: {likesCount[post.id] || 0}</p>
                </div>

                {/* Comment form */}
                <div className="comment-btn-container">
                  <div className="comment-container">
                    <input
                      className="comment-input cmnt-input"
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment[post.id] || ""}
                      onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    />
                    <input
                      className="custom-name cmnt-input"
                      type="text"
                      placeholder="Custom username (Optional)"
                      value={customUsername[post.id] || ""}
                      onChange={(e) => setCustomUsername((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    />
                  </div>
                  <button className="comment-btn" onClick={() => addComment(post.id)}>Comment</button>
                </div>
              </div>
              

              {/* Display comments */}
              <div className="display-comments">
                {comments[post.id]?.length > 0 &&
                  comments[post.id].slice(0, 2).map((comment, index) => ( // Limit to 2 comments
                    <div className="comment-display-div" key={comment.id}>
                      <span className="comment-text">
                        <strong>{comment.username}</strong>: {comment.commentText}
                      </span>
                    </div>
                  ))}
              </div>
             
            </div>
          ))
        ) : (
          <p>No posts found in this category.</p>
        )}
      </div>
    </div>
  );
};
