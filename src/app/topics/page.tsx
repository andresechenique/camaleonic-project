"use client";

import { FormEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Topic } from "@/interfaces";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TopicService } from "@/services";

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getTopics();
  }, []);

  const getTopics = async () => {
    try {
      const items = await TopicService.getTopics();
      setTopics(items);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  const createTopic = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await TopicService.createTopic(
        formData.get("title"),
        formData.get("description"),
        Number(formData.get("points"))
      );
      console.log(res);
      setTopics((prev) => [...prev, res]);
      setOpenCreate(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      await TopicService.deleteTopic(id);
      setTopics((prev) => prev.filter((topic) => topic._id !== id));
      setOpenDeleteId(null);
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
  };

  const updateTopic = async (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const response = await TopicService.updateTopic(
        id,
        formData.get("title"),
        formData.get("description"),
        Number(formData.get("points"))
      );
      setTopics((prev) =>
        prev.map((topic) => (topic._id === id ? response.data : topic))
      );
      setOpenEditId(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    }
  };

  return (
    <div className="col-span-12 flex flex-col gap-4 p-4 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold ">Topics</h2>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger>Add Topic</DialogTrigger>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Add new topic</DialogTitle>
              <form className="flex flex-col gap-2" onSubmit={createTopic}>
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
                />
                <input
                  type="text"
                  placeholder="Description"
                  name="description"
                  className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
                />
                <input
                  type="number"
                  placeholder="Interest Points"
                  name="points"
                  className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
                />
                {error && <div className=" text-red-400 text-xs">{error}</div>}
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-800 rounded-lg"
                >
                  Add
                </button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-2">
        {topics.map((topic) => (
          <div
            key={topic._id}
            className="flex p-4 rounded-lg border border-gray-700 items-center justify-between"
          >
            <div>{topic.title}</div>
            <div>{topic.description}</div>
            <div>{topic.points}</div>
            <Dialog
              open={openEditId === topic._id}
              onOpenChange={(isOpen) =>
                setOpenEditId(isOpen ? topic._id : null)
              }
            >
              <DialogTrigger>Edit</DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Edit topic</DialogTitle>
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={(e) => updateTopic(e, topic._id)}
                  >
                    <input
                      defaultValue={topic.title}
                      type="text"
                      placeholder="Title"
                      name="title"
                      className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
                    />
                    <input
                      defaultValue={topic.description}
                      type="text"
                      placeholder="Description"
                      name="description"
                      className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
                    />
                    <input
                      defaultValue={topic.points}
                      type="number"
                      placeholder="Interest Points"
                      name="points"
                      className="bg-gray-700 rounded-lg p-3 .placeholder-white min-w-64"
                    />
                    {error && (
                      <div className=" text-red-400 text-xs">{error}</div>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-800 rounded-lg"
                    >
                      Update
                    </button>
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog
              open={openDeleteId === topic._id}
              onOpenChange={(isOpen) =>
                setOpenDeleteId(isOpen ? topic._id : null)
              }
            >
              <DialogTrigger>Delete Topic</DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Delete topic</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this topic?
                  </DialogDescription>
                  <button
                    className="px-6 py-2 bg-red-800 rounded-lg"
                    onClick={() => deleteTopic(topic._id)}
                  >
                    Delete
                  </button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
