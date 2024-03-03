import { Button } from "@/components/ui/button";
import redis from "@/lib/db";

export default async function Page() {
  const data = await redis.set("key", "value");
  return (
    <div>
      <Button>
        <a>123</a>
      </Button>
    </div>
  );
}
