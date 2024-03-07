import Avatar from "@/components/Avatar";
import AcceptFriendForm from "./AcceptFriendForm";
import DeclineFriendForm from "./DeclineFriendForm";

const FriendRequestItem = ({ src, email, id }: { id: string; src: string; email: string }) => {
  return (
    <li className="flex gap-2 items-center">
      <Avatar src={src} />
      <p>{email}</p>
      <div className="flex gap-2">
        <AcceptFriendForm senderId={id} />
        <DeclineFriendForm senderId={id} />
      </div>
    </li>
  );
};

export default FriendRequestItem;
