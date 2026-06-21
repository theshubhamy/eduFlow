import { useCurrentUser } from "@/hooks/queries/useAuth";
import { useSwitchTeam } from "@/hooks/queries/useTeam";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, GraduationCapIcon } from "lucide-react";

export function TeamSwitcher() {
  const { state } = useSidebar();
  const { data } = useCurrentUser();
  const switchTeamMutation = useSwitchTeam();
  const teams = data?.teams || [];
  const currentTeam = data?.currentTeam;
  const isCollapsed = state === "collapsed";

  // Find the active team based on current user context
  const activeTeam = teams.find((t: any) => t.id === currentTeam?.id) || teams[0];

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-[#F8F9FA] hover:bg-[#F8F9FA] dark:data-[state=open]:bg-[#1E293B] dark:hover:bg-[#1E293B] transition-colors duration-150"
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B]">
                <GraduationCapIcon className="size-5" />
              </div>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Role: {activeTeam.role}
                  </span>
                </div>
              )}
              {!isCollapsed && (
                <ChevronsUpDownIcon className="ml-auto size-4 text-[#94A3B8]" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[200px]"
            align="start"
            side={isCollapsed ? "right" : "bottom"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Switch Schools / Teams
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {teams.map((team: any, index: number) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => switchTeamMutation.mutate(team.id)}
                className="gap-2 p-2 cursor-pointer hover:bg-[#F8F9FA] dark:hover:bg-[#1E293B]"
              >
                <div className="flex size-6 items-center justify-center rounded-md border border-[#E5E7EB] bg-white dark:border-[#334155] dark:bg-[#0F172A]">
                  <GraduationCapIcon className="size-3.5 text-[#2563EB]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">{team.name}</span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                    {team.role}
                  </span>
                </div>
                <DropdownMenuShortcut className="text-[#94A3B8]">⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
