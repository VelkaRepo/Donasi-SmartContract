'use client';

import { getContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import Link from "next/link";

type CampaignCardProps = {
  campaignAddress: string;
};

export default function CampaignCard({ campaignAddress }: CampaignCardProps) {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: campaignAddress,
  });

  const { data: CampaignName, isPending: isLoadingName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: CampaignDescription, isPending: isLoadingDescription } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: Goal, isPending: isLoadingGoal } = useReadContract({
    contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: balance, isPending: isLoadingBalance } = useReadContract({
    contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  const { data: status, isPending: isLoadingStatus } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  const totalBalance = balance ? parseInt(balance.toString()) : 0;
  const totalGoal = Goal ? parseInt(Goal.toString()) : 1;
  const balancePercentage =
    status === 1 && totalBalance === 0
      ? 100
      : Math.min((totalBalance / totalGoal) * 100, 100);

  if (isLoadingName || isLoadingDescription || isLoadingGoal || isLoadingBalance || isLoadingStatus) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-100 rounded-md">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-slate-200 rounded-lg shadow relative">
      {/* Campaign Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{CampaignName || "Untitled Campaign"}</h3>
        {status === 1 && totalBalance === 0 && (
          <span className="text-red-600 text-xs font-semibold">
            Withdrawn
          </span>
        )}
      </div>

      {/* Campaign Description */}
      <p className="text-gray-600 mb-4">{CampaignDescription || "No description available"}</p>

      {/* Progress Bar */}
      <div className="relative w-full h-6 bg-gray-200 rounded-full">
        <div
          className="h-6 bg-blue-600 rounded-full"
          style={{ width: `${balancePercentage}%` }}
        />
        <p className="absolute top-0 right-0 text-gray-600 text-xs p-1">
          {balancePercentage.toFixed(2)}%
        </p>
      </div>

      {/* Goal and Balance */}
      <p className="text-sm text-gray-500 mt-2">
        <strong>Raised:</strong> $
        {status === 1 && totalBalance === 0 ? totalGoal : totalBalance}{" "}
        / <strong>Goal:</strong> ${totalGoal}
      </p>

      {/* View Campaign Button */}
      <Link href={`/campaign/${campaignAddress}`} passHref={true}>
        <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-4">
          View Campaign
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </p>
      </Link>
    </div>
  );
}
