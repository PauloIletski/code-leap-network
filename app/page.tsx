"use client";

import {Post, UsePost, User} from "./types/types";
import { useEffect, useState } from "react";
import DeleteIcon from "./icons/delete";
import EditIcon from "./icons/edit";
import EditModal from "./utils/editModal";
import WarningModal from "./utils/warningModal";
import timeAgo from "./utils/timeAgo";



export default function Home() {
  const [usernamefield, setUsernamefield] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [actualuser, setActualuser] = useState({} as User);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [warningMessage, setWarningMessage] = useState(false);

  const isFilledField = usernamefield.trim().length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernamefield(e.target.value);
  };

  async function handleSubmitUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const userResponse = await fetch(`/api/users/username/${usernamefield}`);

    if (userResponse.ok) {
      const response = await userResponse.json();
      const userData: User = response.user;
      console.log("User data fetched:", userData);
      setActualuser(userData);
      setLoading(false);
      return;
    }

    await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: usernamefield.trim() }),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setActualuser(data.user[0]);
        } else {
          console.error("Failed to create user");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function handleSubmitPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;


    if(title.trim() === "" || content.trim() === "") {
      
      setWarningMessage(true);
      return;
     
    }
    else{
      setWarningMessage(false);
    }
    
    const postData:UsePost={
      title,
      content,
      user_id: actualuser.id
    }

    await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    form.reset()
  }
 
  function handleOpenModal(post: Post) {
    setSelectedPost(post);
    setIsModalOpen(true);
  }

  function handleOpenWarningModal(post: Post) {
    setSelectedPost(post);
    setIsWarningModalOpen(true);
  }

  function handleCloseWarningModal() {
    setSelectedPost(null);
    setIsWarningModalOpen(false);
  }

  function handleCloseModal() {
    setSelectedPost(null);
    setIsModalOpen(false);
  }

  async function handleUpdatePost(updatedPost: Post) {
    const response = await fetch(`/api/posts/update/${updatedPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updatedPost.title,
        content: updatedPost.content,
      }),
    });

    if (response.ok) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.created_at === updatedPost.created_at ? {...post, ...updatedPost} : post
        )
      );

      handleCloseModal();
    } else {
      console.error("Failed to update post");
    }

  }

  async function handleDeletePost(postId: number) {
    await fetch(`/api/posts/delete?id=${postId}`, {
      method: "DELETE",
    });

    
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

    handleCloseWarningModal();
  }

  useEffect(() =>{
    const fetchPosts = async () =>{
      try{
        const response = await fetch("/api/posts/read");
        if(response.ok){
          const data = await response.json();
          setPosts(data.data);
        }else{
          console.error("Failed to fetch posts");
        }
      }catch(error){
        console.error("Error fetching posts:", error);
      }
    
    }
    fetchPosts();
  },[]);
   

  return !actualuser.id ? (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="bg-white border-radius-md shadow-md p-8 dark:bg-zinc-900 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50">
          Welcome to CodeLeap Network!
        </h1>

        <p className="mt-4 text-zinc-700 dark:text-zinc-300">
          Please enter your username
        </p>
        <form onSubmit={handleSubmitUser}>
          <fieldset className="mt-4">
            <input
              required 
              onChange={handleChange}
              type="text"
              name="username"
              placeholder="John Doe"
              className="w-full border border-zinc-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
            />
          </fieldset>

          <button
            className={
              isFilledField && !loading
                ? "mt-4 float-right bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                : "mt-4 float-right bg-gray-400 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
            }
            type="submit"
          >
            {loading ? "Wait..." : "Enter"}
          </button>
        </form>
      </main>
    </div>
  ) : (
    <div className="flex min-h-screen items-start mt-10 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="bg-white w-full mx-4 h-full md:w-1/2 xl:w-1/3 border-radius-md shadow-md dark:bg-zinc-900 dark:border-zinc-800">
        <div className="w-full  p-8 bg-[#7695EC] h-2 text-white rounded-t-md">
          Code Leap Network
        </div>
        <h1 className="text-xl font-bold text-center m-4 text-zinc-900 dark:text-zinc-50">
          Welcome back, {actualuser.username}!
        </h1>
        <div className="border border-black mx-4 rounded-xl ">
          <form className="p-4 " onSubmit={handleSubmitPost}>
            <p>What&apos;s on your mind?</p>
            <fieldset className="mt-4">
              <label htmlFor="title" className=" text-sm text-black">
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Hello world"
                className="w-full border border-zinc-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
              />
            </fieldset>
            <fieldset className="mt-4">
              <label htmlFor="content" className=" text-sm text-black">
                Content
              </label>
              <textarea
                
                id="content"
                name="content"
                placeholder="Content here"
                className="w-full border border-zinc-300 rounded-md p-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
              />
            </fieldset>
            {warningMessage && (
              <p className="text-red-500 text-sm mt-2">Please fill in all fields.</p>
            )}
            <button
              className={
                "mt-4  flex justify-self-end bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
              }
              type="submit"
            >
              Create
            </button>
          </form>
          
        </div>
        {
            posts.map((post) => (
              <div key={post.created_at} className="m-4">
               <div className="bg-[#7695EC] flex flex-row justify-between gap-4 text-white w-full p-2 rounded-t-md mb-2">
                  <span className="font-bold align-middle flex self-center"> 
                    {post.title} 
                  </span>
                  
                    {post.user_id === actualuser.id && (
                      <div>
                        <button className="cursor-pointer mr-2" onClick={() => handleOpenModal(post)}>
                          <EditIcon/>
                        </button>
                        <button className="cursor-pointer" onClick={()=>handleOpenWarningModal(post)}>
                          <DeleteIcon/>
                        </button>
                      </div>
                    )}
                  
                </div>
              <div key={post.created_at} className="border border-zinc-300 rounded-md p-4 m-4 dark:border-zinc-700">
                <div className="flex flex-col justify-between items-start mb-2">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{post.title}</h2>
                  <div className="flex justify-between items-center w-full gap-4">
                    <span className="text-sm text-zinc-600 dark:text-zinc-500">@{post.users?.username}</span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{timeAgo(post.created_at?.toString())}</span>
                  </div>
                </div>
                <p className="text-zinc-800 dark:text-zinc-300 mb-2">{post.content}</p>
                
              </div>
              </div>
            ))
          }
      </main>
      <EditModal
        isOpen={isModalOpen}
        post={selectedPost}
        onClose={handleCloseModal}
        onSave={handleUpdatePost}
      />
      <WarningModal
       isOpen={isWarningModalOpen}
        post={selectedPost as Post}
        onClose={handleCloseWarningModal}
        onDelete={() => handleDeletePost(selectedPost!.id)}
      />
      
    </div>
  );
}
