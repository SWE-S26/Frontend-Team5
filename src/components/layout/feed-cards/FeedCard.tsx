import Button from "@/components/ui/Button";
import React from "react";
import { MdOutlineEdit } from "react-icons/md";

export default function FeedCard() {
  return (
    <div>
      <Button icon={<MdOutlineEdit className="text-lg" />}>Edit</Button>
    </div>
  );
}
