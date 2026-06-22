import { site } from "@/config/site";

export function AnnouncementBar() {
  return (
    <div className="bg-fo-green-900 px-4 py-[9px] text-center text-[0.85rem] font-medium text-[#eafbef]">
      {site.announcement}
    </div>
  );
}
