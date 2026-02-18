import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';

export interface Group {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  centerLocation: string;
  meetingDay: string;
  meetingTime: string;
  members: GroupMember[];
  maxMembers: number;
  createdAt: Date;
  status: 'active' | 'pending' | 'full';
}

export interface GroupMember {
  userId: string;
  name: string;
  phoneNumber: string;
  joinedAt: Date;
  status: 'active' | 'pending';
  loanAmount?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userGroup: Group | null;
  allGroups: Group[];
  login: (phoneNumber: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  approveSignup: () => void;
  approveLoanType: () => void;
  createGroup: (groupData: Omit<Group, 'id' | 'leaderId' | 'leaderName' | 'members' | 'createdAt' | 'status'>) => void;
  joinGroup: (groupId: string) => void;
  approveGroupMember: (groupId: string, userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userGroup, setUserGroup] = useState<Group | null>(null);
  const [allGroups, setAllGroups] = useState<Group[]>([
    // Mock groups for testing
    {
      id: 'group-1',
      name: 'Sampaguita Group',
      leaderId: 'leader-1',
      leaderName: 'Maria Santos',
      centerLocation: 'Barangay Hall, Brgy. San Jose',
      meetingDay: 'Tuesday',
      meetingTime: '9:00 AM',
      members: [
        {
          userId: 'leader-1',
          name: 'Maria Santos',
          phoneNumber: '09171234567',
          joinedAt: new Date(),
          status: 'active',
        },
      ],
      maxMembers: 15,
      createdAt: new Date(),
      status: 'active',
    },
    {
      id: 'group-2',
      name: 'Gumamela Group',
      leaderId: 'leader-2',
      leaderName: 'Ana Cruz',
      centerLocation: 'Community Center, Brgy. Santa Maria',
      meetingDay: 'Thursday',
      meetingTime: '2:00 PM',
      members: Array.from({ length: 12 }, (_, i) => ({
        userId: `member-${i}`,
        name: `Member ${i + 1}`,
        phoneNumber: `0917000000${i}`,
        joinedAt: new Date(),
        status: 'active' as const,
      })),
      maxMembers: 15,
      createdAt: new Date(),
      status: 'active',
    },
    {
      id: 'group-3',
      name: 'Rosal Group',
      leaderId: 'leader-3',
      leaderName: 'Linda Reyes',
      centerLocation: 'Covered Court, Brgy. San Pedro',
      meetingDay: 'Wednesday',
      meetingTime: '10:00 AM',
      members: Array.from({ length: 15 }, (_, i) => ({
        userId: `member-${i}`,
        name: `Member ${i + 1}`,
        phoneNumber: `0917000000${i}`,
        joinedAt: new Date(),
        status: 'active' as const,
      })),
      maxMembers: 15,
      createdAt: new Date(),
      status: 'full',
    },
  ]);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string, pin: string) => {
    try {
      const mockUser: User = {
        id: '1',
        firstName: 'Maria',
        lastName: 'Santos',
        phoneNumber,
        address: 'Sample Address',
        isApproved: false,
        isVerified: true,
        loanTypeApproved: false,
        hasSubmittedLoanType: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const signup = async (data: any) => {
    try {
      const mockUser: User = {
        id: '1',
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        isApproved: false,
        isVerified: false,
        loanTypeApproved: false,
        hasSubmittedLoanType: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...userData };
    });
  };

  const approveSignup = () => {
    console.log('[AuthContext] approveSignup called, current user:', user);
    setUser(prevUser => {
      if (!prevUser) {
        console.log('[AuthContext] No user to approve');
        return null;
      }
      const updatedUser = { ...prevUser, isApproved: true };
      console.log('[AuthContext] User approved, new user:', updatedUser);
      return updatedUser;
    });
  };

  const approveLoanType = () => {
    console.log('[AuthContext] approveLoanType called, current user:', user);
    setUser(prevUser => {
      if (!prevUser) {
        console.log('[AuthContext] No user to approve loan type');
        return null;
      }
      const updatedUser = { ...prevUser, loanTypeApproved: true };
      console.log('[AuthContext] Loan type approved, new user:', updatedUser);
      return updatedUser;
    });
  };

  const createGroup = (groupData: Omit<Group, 'id' | 'leaderId' | 'leaderName' | 'members' | 'createdAt' | 'status'>) => {
    if (!user) {
      console.log('[AuthContext] createGroup - No user logged in');
      return;
    }

    console.log('[AuthContext] createGroup called with data:', groupData);

    const newGroup: Group = {
      ...groupData,
      id: `group-${Date.now()}`,
      leaderId: user.id,
      leaderName: `${user.firstName} ${user.lastName}`,
      members: [
        {
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          phoneNumber: user.phoneNumber,
          joinedAt: new Date(),
          status: 'active',
        },
      ],
      createdAt: new Date(),
      status: 'active',
    };

    console.log('[AuthContext] New group created:', newGroup);

    setAllGroups(prev => [...prev, newGroup]);
    setUserGroup(newGroup);

    console.log('[AuthContext] User is now group leader of:', newGroup.name);
  };

  const joinGroup = (groupId: string) => {
    if (!user) {
      console.log('[AuthContext] joinGroup - No user logged in');
      return;
    }

    console.log('[AuthContext] joinGroup called for groupId:', groupId);

    const group = allGroups.find(g => g.id === groupId);
    if (!group) {
      console.log('[AuthContext] Group not found:', groupId);
      return;
    }

    if (group.members.length >= group.maxMembers) {
      console.log('[AuthContext] Group is full:', group.name);
      return;
    }

    const newMember: GroupMember = {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      phoneNumber: user.phoneNumber,
      joinedAt: new Date(),
      status: 'pending', // Requires leader approval
    };

    console.log('[AuthContext] Adding member to group:', newMember);

    setAllGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, members: [...g.members, newMember] }
          : g
      )
    );

    console.log('[AuthContext] Join request sent to group:', group.name);
  };

  const approveGroupMember = (groupId: string, userId: string) => {
    console.log('[AuthContext] approveGroupMember called for groupId:', groupId, 'userId:', userId);

    setAllGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.map(m =>
                m.userId === userId ? { ...m, status: 'active' as const } : m
              ),
            }
          : g
      )
    );

    // Update userGroup if it's the current user's group
    if (userGroup?.id === groupId) {
      setUserGroup(prev =>
        prev
          ? {
              ...prev,
              members: prev.members.map(m =>
                m.userId === userId ? { ...m, status: 'active' as const } : m
              ),
            }
          : null
      );
    }

    console.log('[AuthContext] Member approved in group');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    userGroup,
    allGroups,
    login,
    logout,
    signup,
    updateUser,
    approveSignup,
    approveLoanType,
    createGroup,
    joinGroup,
    approveGroupMember,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
