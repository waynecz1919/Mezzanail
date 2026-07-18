import type { Metadata } from "next";
import { RewardsSite } from "@/components/rewards-site";

export const metadata: Metadata = { title: "Membership & Rewards", description: "Explore Mezzanail Nail Studio membership privileges, birthday benefits and member rewards." };
export default function Page() { return <RewardsSite />; }
