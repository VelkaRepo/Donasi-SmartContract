'use client';

import { useReadContract } from "thirdweb/react";
import { client } from "./client";
import { baseSepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";
import CampaignCard from "./components/CampaignCard";

export default function Home() {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  const { data: campaigns, isPending: isLoadingCampaigns } = useReadContract({
    contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name, uint256 creationtime)[])",
    params: [],
  });

  console.log(campaigns);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8 flex-grow">
        <div className="py-10">
          <h1 className="text-4xl font-bold mb-4">Campaigns:</h1>
          <div className="grid grid-cols-3 gap-4">
            {isLoadingCampaigns && <p>Loading campaigns...</p>}
            {!isLoadingCampaigns &&
              campaigns &&
              campaigns.map((campaign: any) => (
                <CampaignCard
                  key={campaign.campaignAddress}
                  campaignAddress={campaign.campaignAddress}
                />
              ))}
            {!isLoadingCampaigns && campaigns?.length === 0 && <p>No Campaigns</p>}
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-gray-400 py-6">
  <div className="container mx-auto px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
      {/* Left Section: Group Information */}
      <div className="text-center lg:text-left">
        <h2 className="text-lg font-semibold text-white">Kelompok Tugas</h2>
        <ul className="mt-2 space-y-1">
          <li>Dionisius Lucky N - <span className="font-medium text-white">NIM: 8803202204</span></li>
          <li>Alfian Yuda S - <span className="font-medium text-white">NIM: 8803202201</span></li>
        </ul>
      </div>

      {/* Right Section: Course Information */}
      <div className="text-center lg:text-right">
        <p className="text-sm">
          <span className="font-medium text-white">Mata Kuliah:</span> Digital Aset (UAS)
        </p>
        <p className="mt-1 text-sm">© 2024 - Crowdfunding Project</p>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}
