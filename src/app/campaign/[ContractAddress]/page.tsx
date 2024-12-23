"use client";

import { client } from "@/app/client";
import { TierCard } from "@/app/components/TierCard";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export default function CampaignPage() {
  const account = useActiveAccount();
  const { ContractAddress } = useParams(); // Corrected parameter
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: ContractAddress as string,
  });

  const { data: name } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: deadline } = useReadContract({
    contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });

  const deadlineDate = deadline
    ? new Date(parseInt(deadline.toString()) * 1000)
    : null;

  const { data: goal } = useReadContract({
    contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: balance } = useReadContract({
    contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  const { data: tiers } = useReadContract({
    contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  const { data: owner } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: status } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  const balancePercentage =
    status === 1 && parseInt(balance?.toString() || "0") === 0
      ? 100 // Always show 100% if status is Successful and balance is 0
      : goal && balance
      ? Math.min(
          (parseInt(balance.toString()) / parseInt(goal.toString())) * 100,
          100
        )
      : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">{name || "Loading..."}</h1>
          <p className="text-sm mt-2">
            Owned by:{" "}
            <span className="font-semibold">{owner || "Loading..."}</span> |
            Deadline:{" "}
            {deadlineDate ? deadlineDate.toLocaleDateString() : "Loading..."}
          </p>
          {status !== undefined && (
            <p
              className={`mt-4 inline-block px-4 py-2 text-sm rounded ${
                status === 0
                  ? "bg-green-500"
                  : status === 1
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            >
              {status === 0 ? "Active" : status === 1 ? "Successful" : "Failed"}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex-grow bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-2 text-gray-700">{description || "Loading..."}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold">Goal and Progress</h2>
            <div className="relative w-full h-8 bg-gray-300 rounded-full overflow-hidden shadow mt-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                style={{
                  width: `${balancePercentage}%`,
                  transition: "width 0.5s ease",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white font-semibold">
                  {balancePercentage.toFixed(2)}%
                </p>
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              $
              {status === 1 && parseInt(balance?.toString() || "0") === 0
                ? goal?.toString() || "0"
                : balance?.toString() || "0"}{" "}
              raised of ${goal?.toString() || "0"}
            </p>

            {/* Note: Fund withdrawn only if status is Successful and balance is 0 */}
            {status === 1 && parseInt(balance?.toString() || "0") === 0 && (
              <p className="text-red-600 mt-4 font-semibold">
                Fund has been withdrawn by the owner.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiers?.map((tier, index) => (
                <TierCard
                  key={index}
                  tier={tier}
                  contract={contract}
                  index={index}
                  isEditing={isEditing}
                />
              ))}
              {isEditing && (
                <button
                  className="p-6 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Add Tier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Left Section: Group Information */}
            <div className="text-center lg:text-left">
              <h2 className="text-lg font-semibold text-white">
                Kelompok Tugas
              </h2>
              <ul className="mt-2 space-y-1">
                <li>
                  Dionisius Lucky N -{" "}
                  <span className="font-medium text-white">
                    NIM: 8803202204
                  </span>
                </li>
                <li>
                  Alfian Yuda S -{" "}
                  <span className="font-medium text-white">
                    NIM: 8803202201
                  </span>
                </li>
              </ul>
            </div>

            {/* Right Section: Course Information */}
            <div className="text-center lg:text-right">
              <p className="text-sm">
                <span className="font-medium text-white">Mata Kuliah:</span>{" "}
                Digital Aset (UAS)
              </p>
              <p className="mt-1 text-sm">© 2024 - Crowdfunding Project</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
