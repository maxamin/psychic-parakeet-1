import React, { useEffect, useState } from 'react';
import socketIO from "socket.io-client"
import { useParams } from "react-router-dom"

const socket = socketIO.connect("http://localhost:4000");

const Comments = () => {
    const { category, id } = useParams();
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);

    // To fetch the comments when the page is loaded to the browser
    useEffect(() => {
        socket.emit("fetchComments", { category, id });
    }, [category, id])

    // Listen to the comments event
    useEffect(() => {
        socket.on(
            "comments",
            (data) => setCommentList(data));
    }, []);

    const addComment = (e) => {
        e.preventDefault();

        // send the comment the task category, items is and the user ID
        socket.emit("addComment", {
            comment,
            category,
            id,
            userId: localStorage.getItem("userID"),
        })
        // console.log({ comment, userId: localStorage.getItem("userId"), });
        setComment("")
    }
    return (
        <div className='comment__container'>
            <form className='comment__form' onSubmit={addComment}>
                <label htmlFor='comment'>Add a Comment</label>
                <textarea
                    placeholder='Type your comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    id="comment"
                    name="comment"
                    required
                ></textarea>
                <button className='commentBtn'>Submit</button>
            </form>

            {/* Display all the available comments */}
            <div className='comments__section'>
                <h2>Existing Comments</h2>
                {commentList.map((comment) => (
                    <div key={comment.id}>
                        <p>
                            <span style={{ fontWeight: "bold" }}>{comment.text}</span>by{" "}{comment.name}
                        </p>
                    </div>
                ))};
                <div></div>
            </div>
        </div>
    );
};

export default Comments