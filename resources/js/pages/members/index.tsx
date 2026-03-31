import { Head, router } from '@inertiajs/react';
import { ChevronDown, Mail, ShieldAlert, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import CancelInvitationModal from '@/components/cancel-invitation-modal';
import InviteMemberModal from '@/components/invite-member-modal';
import RemoveMemberModal from '@/components/remove-member-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { index as membersIndex } from '@/routes/members';
import { update as updateMember } from '@/routes/teams/members';
import type {
    RoleOption,
    Team,
    TeamInvitation,
    TeamMember,
    TeamPermissions,
} from '@/types';

type Props = {
    team: Team;
    members: TeamMember[];
    invitations: TeamInvitation[];
    permissions: TeamPermissions;
    availableRoles: RoleOption[];
};

export default function MembersIndex({
    team,
    members,
    invitations,
    permissions,
    availableRoles,
}: Props) {
    const getInitials = useInitials();

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
    const [cancelInvitationDialogOpen, setCancelInvitationDialogOpen] = useState(false);
    const [invitationToCancel, setInvitationToCancel] = useState<TeamInvitation | null>(null);

    const updateMemberRole = (member: TeamMember, newRole: string) => {
        router.visit(updateMember([team.slug, String(member.id)]), {
            data: { role: newRole },
            preserveScroll: true,
        });
    };

    const confirmRemoveMember = (member: TeamMember) => {
        setMemberToRemove(member);
        setRemoveMemberDialogOpen(true);
    };

    const confirmCancelInvitation = (invitation: TeamInvitation) => {
        setInvitationToCancel(invitation);
        setCancelInvitationDialogOpen(true);
    };

    return (
        <>
            <Head title="Staff & Faculty" />

            <div className="container mx-auto p-6 space-y-8 max-w-6xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Staff & Faculty Directory</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage institutional personnel, administrative access, and role hierarchies.</p>
                    </div>
                    {permissions.canCreateInvitation && (
                        <Button data-test="invite-member-button" onClick={() => setInviteDialogOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" /> Invite Staff
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Active Staff Table */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b">
                            <h3 className="font-semibold leading-none tracking-tight">Active Faculty & Administration</h3>
                            <p className="text-sm text-muted-foreground">Current verified members with access to the platform.</p>
                        </div>
                        <div className="p-0">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b bg-muted/30">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Personnel</th>
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Assigned Role</th>
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Contact</th>
                                            <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {members.map((member) => (
                                            <tr key={member.id} className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted">
                                                <td className="p-4 px-6 align-middle">
                                                    <div className="flex items-center gap-3 w-48">
                                                        <Avatar className="h-9 w-9 border border-border">
                                                            {member.avatar ? (
                                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                            ) : null}
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                {getInitials(member.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="font-medium truncate">{member.name}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 px-6 align-middle">
                                                    {member.role !== 'owner' && permissions.canUpdateMember ? (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" size="sm" className="h-8">
                                                                    {member.role_label}
                                                                    <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-50" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                {availableRoles.map((role) => (
                                                                    <DropdownMenuItem key={role.value} onSelect={() => updateMemberRole(member, role.value)}>
                                                                        {role.label}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    ) : (
                                                        <Badge 
                                                            variant={member.role === 'owner' || member.role === 'principal' ? 'default' : 'secondary'} 
                                                            className={member.role === 'faculty' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                                                        >
                                                            {member.role_label}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="p-4 px-6 align-middle text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3.5 w-3.5 opacity-70" />
                                                        <span className="truncate w-48">{member.email}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 px-6 align-middle text-right">
                                                    {member.role !== 'owner' && permissions.canRemoveMember ? (
                                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => confirmRemoveMember(member)}>
                                                            <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
                                                            Revoke Access
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic px-3 font-medium">Protected Instance</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Pending Invitations Table */}
                    {invitations.length > 0 && (
                        <div className="rounded-xl border border-orange-100 dark:border-orange-900/30 bg-card text-card-foreground shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                            <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b border-orange-100/50 dark:border-orange-900/30">
                                <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-orange-500" /> Pending Invitations
                                </h3>
                                <p className="text-sm text-muted-foreground">Awaiting registration completion from these accounts.</p>
                            </div>
                            <div className="p-0">
                                <table className="w-full caption-bottom text-sm">
                                    <tbody className="[&_tr:last-child]:border-0 border-t">
                                        {invitations.map((invitation) => (
                                            <tr key={invitation.code} className="border-b transition-colors hover:bg-muted/50 disabled">
                                                <td className="p-4 px-6 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                                                            <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                        </div>
                                                        <div className="font-medium">{invitation.email}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 px-6 align-middle">
                                                    <Badge variant="outline" className="text-muted-foreground/80 border-dashed">{invitation.role_label} (Pending)</Badge>
                                                </td>
                                                <td className="p-4 px-6 align-middle text-right">
                                                    {permissions.canCancelInvitation && (
                                                        <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/50" onClick={() => confirmCancelInvitation(invitation)}>
                                                            <X className="mr-1.5 h-3.5 w-3.5" /> Cancel Invite
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {permissions.canCreateInvitation && (
                <InviteMemberModal team={team} availableRoles={availableRoles} open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
            )}

            <RemoveMemberModal team={team} member={memberToRemove} open={removeMemberDialogOpen} onOpenChange={setRemoveMemberDialogOpen} />

            <CancelInvitationModal team={team} invitation={invitationToCancel} open={cancelInvitationDialogOpen} onOpenChange={setCancelInvitationDialogOpen} />
        </>
    );
}

MembersIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Staff & Faculty', href: membersIndex().url },
    ],
});
