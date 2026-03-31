<?php

namespace App\Enums;

enum TeamRole: string
{
    case Owner = 'owner';
    case Admin = 'admin';
    case Principal = 'principal';
    case HoD = 'hod';
    case Admission = 'admission';
    case Accounts = 'accounts';
    case Faculty = 'faculty';
    case Member = 'member';

    /**
     * Get the display label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::HoD => 'Head of Department',
            self::Accounts => 'Accounts',
            default => ucfirst($this->value),
        };
    }

    /**
     * Get all the permissions for this role.
     *
     * @return array<string>
     */
    public function permissions(): array
    {
        return match ($this) {
            self::Owner, self::Principal => [
                'team:update',
                'team:delete',
                'member:add',
                'member:update',
                'member:remove',
                'invitation:create',
                'invitation:cancel',
                'settings:manage',
            ],
            self::Admin, self::HoD => [
                'team:update',
                'member:add',
                'invitation:create',
                'invitation:cancel',
            ],
            self::Admission => [
                'student:manage',
                'admission:process',
            ],
            self::Accounts => [
                'fee:manage',
                'payment:collect',
            ],
            self::Faculty, self::Member => [],
        };
    }

    /**
     * Determine if the role has the given permission.
     */
    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions());
    }

    /**
     * Get the hierarchy level for this role.
     * Higher numbers indicate higher privileges.
     */
    public function level(): int
    {
        return match ($this) {
            self::Owner => 10,
            self::Principal => 9,
            self::Admin => 8,
            self::HoD => 7,
            self::Admission => 5,
            self::Accounts => 5,
            self::Faculty => 3,
            self::Member => 1,
        };
    }

    /**
     * Check if this role is at least as privileged as another role.
     */
    public function isAtLeast(TeamRole $role): bool
    {
        return $this->level() >= $role->level();
    }

    /**
     * Get the roles that can be assigned to team members (excludes Owner).
     *
     * @return array<array{value: string, label: string}>
     */
    public static function assignable(): array
    {
        return collect(self::cases())
            ->filter(fn (self $role) => $role !== self::Owner)
            ->map(fn (self $role) => ['value' => $role->value, 'label' => $role->label()])
            ->values()
            ->toArray();
    }
}
