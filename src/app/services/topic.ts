import axios from "axios"

async function getTopics() {
    const res = await axios.get("/api/topic");
    return res.data;
}

async function createTopic(title: FormDataEntryValue | null, description: FormDataEntryValue | null, points: number) {
    const res = await axios.post("/api/topic", {
        title,
        description,
        points
      });
      return res.data;
}

async function updateTopic(id: string, title: FormDataEntryValue | null, description: FormDataEntryValue | null, points: number) {
    const res = await axios.put(`/api/topic/${id}`, {
        id,
        title,
        description,
        points
      });
    return res.data;
}

async function deleteTopic(id: string) {
    const res = await axios.delete(`/api/topic/${id}`);
    return res.data;
}

export const TopicService = {
    getTopics,
    createTopic,
    updateTopic,
    deleteTopic
}