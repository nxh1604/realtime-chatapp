import { fetchFriendRequests } from "@/lib/data";

export default async function Page() {
  const requests = await fetchFriendRequests();

  if (!requests) return <main>Empty friend requets...</main>;

  return (
    <main>
      {requests?.map((request) => (
        <div key={request}>{request}</div>
      ))}
    </main>
  );
}
