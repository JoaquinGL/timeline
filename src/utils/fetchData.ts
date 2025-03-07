import { TimelineEvent } from "../types/timeline";
import dotenv from "dotenv";
dotenv.config();

const API_URL = "https://api.zerosheets.com/v1/9zm";
const API_TOKEN = process.env.API_TOKEN;

const fetchData = async (): Promise<TimelineEvent[]> => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return response.json();
};

export default fetchData;
