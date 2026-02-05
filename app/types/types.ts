import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type User = {
  id: number;
  username: string;
  created_at: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at?: Timestamp;
  users?: User;
}

export type UsePost={
  title:string;
  content:string;
  user_id:number;
}