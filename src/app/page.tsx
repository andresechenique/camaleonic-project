"use client"
import { useEffect, useState } from "react";
import { DataService } from "@/services";
import { Post, User } from "@/interfaces";
import { useSession } from "next-auth/react";

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const {data: session} = useSession()


useEffect(()=>{
  getUsers()
  getPosts()
}, [])

const getUsers = async () => {
  try {
    const res = await DataService.getUsers();
    setUsers(res);
  } catch (error) {
    console.log(error)
  }
}

const getPosts = async () => {
   try {
    const res = await DataService.getPosts();
    setPosts(res);
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      Hello {session?.user?.name}
      {users && users.map((user: User)=>(
        <div key={user.id}>{user.name}</div>
      ))}
      {posts && posts.map((post: Post)=>(
        <div key={post.id}>
          {post.title}
          {post.body}
        </div>
      ))}
    </div>
  );
}
