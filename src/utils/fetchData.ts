import { TimelineEvent } from "../types/timeline";

const API_URL = "https://api.zerosheets.com/v1/9zm";
const API_TOKEN = "cSW3vzqlbvi04mV2qVzxnIUo3pccGJab";

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
