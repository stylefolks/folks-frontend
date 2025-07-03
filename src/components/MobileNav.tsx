import { cn } from "@/lib/utils";
import BottomNav from "./navigation/BottomNav";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  loggedIn: boolean;
}

export default function MobileNav({ open, onClose, loggedIn }: MobileNavProps) {
  // 오버레이 클릭 시 닫힘, 내부 클릭 시 버블링 방지
  return (
    <>
      {/* 오버레이: open일 때만 보임 */}
      <div
        className={cn(
          "fixed inset-0 z-40 sm:hidden transition-opacity duration-300 bg-black",
          open ? "opacity-30 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 네비게이션 패널 */}
      <div
        className={cn(
          "fixed left-4 right-4 z-50 flex flex-col sm:hidden transition-opacity duration-300 bottom-4 rounded-lg shadow-lg bg-white overflow-hidden",
          open
            ? "opacity-80 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-1" />
        <div
          className={cn(
            "bg-background p-4 shadow-md transition-transform duration-300  border-l-0 border-r-0 border-b-0",
            open ? "translate-y-0" : "translate-y-full"
          )}
          // 내부 링크 클릭 시 닫힘
          onClick={e => {
            // a 태그 클릭 시 onClose 호출
            if ((e.target as HTMLElement).closest('a')) {
              onClose();
            }
          }}
        >
          <BottomNav loggedIn={loggedIn} />
        </div>
      </div>
    </>
  );
}
