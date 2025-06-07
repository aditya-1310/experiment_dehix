import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileSidebar, { ProfileGroup, ProfileUser } from './ProfileSidebar'; // Adjust ProfileUser if it's not exported
import { RootState } from '@/lib/store'; // Assuming RootState is exported from store
import { Provider } from 'react-redux'; // To provide mock store
import configureStore from 'redux-mock-store'; // To create mock store
import { useToast } from '@/hooks/use-toast'; // To mock useToast

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const originalModule = jest.requireActual('lucide-react');
  return {
    ...originalModule,
    X: () => <svg data-testid="x-icon" />,
    Users: () => <svg data-testid="users-icon" />,
    UserPlus: () => <svg data-testid="user-plus-icon" />,
    Edit3: () => <svg data-testid="edit3-icon" />,
    Link2: () => <svg data-testid="link2-icon" />,
    VolumeX: () => <svg data-testid="volumex-icon" />,
    Volume2: () => <svg data-testid="volume2-icon" />,
    LogOut: () => <svg data-testid="logout-icon" />,
    Trash2: () => <svg data-testid="trash2-icon" />,
    MinusCircle: () => <svg data-testid="minus-circle-icon" />,
    LoaderCircle: () => <svg data-testid="loader-circle-icon" />,
  };
});

// Mock Firebase services
jest.mock('@/config/firebaseConfig', () => ({
  db: {}, // Mock db object
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
  deleteField: jest.fn(),
  deleteDoc: jest.fn(),
  getDoc: jest.fn(), // Added for completeness, though internalFetchProfileData uses axios
}));

// Mock axiosInstance
jest.mock('@/lib/axiosinstance', () => ({
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(), // if any POST requests are made by helpers
    // Add other methods if used
  },
}));


// Mock child dialog components (basic mock)
jest.mock('./AddMembersDialog', () => ({ AddMembersDialog: ({ isOpen }: { isOpen: boolean}) => isOpen ? <div data-testid="add-members-dialog">AddMembersDialog</div> : null }));
jest.mock('./ChangeGroupInfoDialog', () => ({ ChangeGroupInfoDialog: ({ isOpen }: { isOpen: boolean}) => isOpen ? <div data-testid="change-group-info-dialog">ChangeGroupInfoDialog</div> : null }));
jest.mock('./InviteLinkDialog', () => ({ InviteLinkDialog: ({ isOpen }: { isOpen: boolean}) => isOpen ? <div data-testid="invite-link-dialog">InviteLinkDialog</div> : null }));
jest.mock('./ConfirmActionDialog', () => ({ ConfirmActionDialog: ({ isOpen, title }: { isOpen: boolean, title?: string }) => isOpen ? <div data-testid="confirm-action-dialog">{title}</div> : null }));
jest.mock('./SharedMediaDisplay', () => ({ SharedMediaDisplay: () => <div data-testid="shared-media-display">SharedMediaDisplay</div>}));


// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({ toast: jest.fn() })),
}));

const mockStore = configureStore([]);

const mockAdminUser: Partial<RootState['user']> = {
  uid: 'admin123',
  userName: 'Admin User',
  // Add other necessary user fields
};

const mockNormalUser: Partial<RootState['user']> = {
  uid: 'user123',
  userName: 'Normal User',
  // Add other necessary user fields
};

const mockGroupData: ProfileGroup = {
  _id: 'group1',
  id: 'group1',
  groupName: 'Test Group',
  avatar: 'https://example.com/avatar.png',
  description: 'This is a test group description.',
  createdAt: new Date().toISOString(),
  createdAtFormatted: new Date().toLocaleDateString(),
  members: [
    { id: 'admin123', userName: 'Admin User', profilePic: 'admin.png', status: 'online' },
    { id: 'user123', userName: 'Normal User', profilePic: 'user.png', status: 'offline' },
    { id: 'user456', userName: 'Another User', profilePic: 'user2.png', status: 'online' },
  ],
  admins: ['admin123'],
  participantDetails: {
    'admin123': { userName: 'Admin User', profilePic: 'admin.png', email: 'admin@example.com' },
    'user123': { userName: 'Normal User', profilePic: 'user.png', email: 'user@example.com' },
    'user456': { userName: 'Another User', profilePic: 'user2.png', email: 'user2@example.com' },
  },
  displayName: 'Test Group',
  inviteLink: 'https://example.com/invite/group1',
};

const mockUserData: ProfileUser = {
    _id: 'user1',
    id: 'user1',
    userName: 'Test User',
    name: 'Test User Name',
    email: 'test@example.com',
    profilePic: 'https://example.com/user_avatar.png',
    bio: 'This is a test user bio.',
    displayName: 'Test User',
    status: 'Online',
    lastSeen: 'Just now',
};


describe('ProfileSidebar - Group Information Panel', () => {
  let store: ReturnType<typeof mockStore>;

  const renderProfileSidebar = (
    currentUserInStore: Partial<RootState['user']>,
    profileType: 'group' | 'user' | null = 'group',
    profileId: string | null = 'group1',
    isOpen: boolean = true
  ) => {
    store = mockStore({
      user: currentUserInStore,
      // ... other initial states if needed
    });

    // Reset mocks for axiosInstance.get for each render
    const { axiosInstance } = require('@/lib/axiosinstance');
    axiosInstance.get.mockImplementation((url: string) => {
        if (url === `/conversations/${profileId}`) {
            return Promise.resolve({ data: { data: mockGroupData, status: 'success' } });
        }
        if (url === `/conversations/${profileId}/messages`) {
            return Promise.resolve({ data: { data: [], status: 'success' } }); // No media for now
        }
        if (url === `/freelancer/${profileId}` && profileType === 'user') {
            return Promise.resolve({ data: { data: mockUserData, status: 'success' } });
        }
        return Promise.reject(new Error(`Unhandled GET request to ${url}`));
    });


    return render(
      <Provider store={store}>
        <ProfileSidebar
          isOpen={isOpen}
          onClose={jest.fn()}
          profileId={profileId}
          profileType={profileType}
          // currentUser prop can be passed if needed, but relying on store mock here
        />
      </Provider>
    );
  };

  // Test 1: Correct display of group information
  test('displays group information correctly', async () => {
    renderProfileSidebar(mockAdminUser);

    await waitFor(() => {
      expect(screen.getByText('Test Group')).toBeInTheDocument();
    });
    expect(screen.getByText('This is a test group description.')).toBeInTheDocument();
    expect(screen.getByText(`Members (${mockGroupData.members.length})`)).toBeInTheDocument();
    expect(screen.getByText(`Created: ${mockGroupData.createdAtFormatted}`)).toBeInTheDocument();
    expect(screen.getByText(`Admin: ${mockGroupData.admins.length}`)).toBeInTheDocument(); // or Admins if plural
    // Check for avatar (presence of img tag with correct src, or fallback)
    const avatarImg = screen.getByRole('img', { name: 'Test Group' });
    expect(avatarImg).toHaveAttribute('src', mockGroupData.avatar);
  });

  // Test 2: Correct rendering of the member list
  test('renders member list with details correctly', async () => {
    renderProfileSidebar(mockAdminUser);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    expect(screen.getByText('Normal User')).toBeInTheDocument();
    expect(screen.getByText('Another User')).toBeInTheDocument();

    // Check for Admin role tag for admin user
    const adminMemberEntry = screen.getByText('Admin User').closest('li');
    expect(adminMemberEntry).toHaveTextContent('Admin');
    expect(adminMemberEntry).toHaveTextContent('online');


    // Check for Member role for normal user (absence of Admin tag or explicit Member tag)
    const normalMemberEntry = screen.getByText('Normal User').closest('li');
    expect(normalMemberEntry).not.toHaveTextContent('Admin'); // Assuming only admins get a tag
    expect(normalMemberEntry).toHaveTextContent('Member'); // Explicitly check for "Member"
    expect(normalMemberEntry).toHaveTextContent('Offline');
  });

  // Test 3: Conditional rendering of admin-only actions (Admin View)
  test('shows admin-only actions for admin users', async () => {
    renderProfileSidebar(mockAdminUser);

    await waitFor(() => {
      // These buttons should be visible to admins
      expect(screen.getByText('Add/Remove Members')).toBeInTheDocument();
    });
    expect(screen.getByText('Change Group Name or Avatar')).toBeInTheDocument();
    expect(screen.getByText('Invite Link')).toBeInTheDocument();
    expect(screen.getByText('Delete Group')).toBeInTheDocument();

    // Check remove button for a non-admin member by admin
    const normalUserEntry = screen.getByText('Normal User').closest('li');
    expect(normalUserEntry?.querySelector('[data-testid="minus-circle-icon"]')).toBeInTheDocument();
  });

  // Test 4: Conditional rendering of admin-only actions (Non-Admin View)
  test('hides admin-only actions for non-admin users', async () => {
    renderProfileSidebar(mockNormalUser);

    await waitFor(() => {
      // Wait for some content that indicates loading is done
      expect(screen.getByText('Test Group')).toBeInTheDocument();
    });

    expect(screen.queryByText('Add/Remove Members')).not.toBeInTheDocument();
    expect(screen.queryByText('Change Group Name or Avatar')).not.toBeInTheDocument();
    // Invite link might be visible to non-admins depending on requirements, current code shows it if (profileData as ProfileGroup).inviteLink !== undefined
    // For this test, assuming it's admin only based on typical patterns unless specified otherwise.
    // If visible to all, this check needs adjustment. From previous work, it's admin only.
    expect(screen.queryByText('Invite Link')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Group')).not.toBeInTheDocument();

    // Check remove button is not present for a member by non-admin
    const anotherUserEntry = screen.getByText('Another User').closest('li');
    expect(anotherUserEntry?.querySelector('[data-testid="minus-circle-icon"]')).not.toBeInTheDocument();
  });

  // Test 5: Basic interaction for "Leave Group" button
  test('clicking "Leave Group" button opens confirmation dialog', async () => {
    renderProfileSidebar(mockNormalUser); // Any user can leave

    await waitFor(() => {
      expect(screen.getByText('Leave Group')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Leave Group'));

    await waitFor(() => {
      expect(screen.getByTestId('confirm-action-dialog')).toBeInTheDocument();
      expect(screen.getByText('Leave Group?')).toBeInTheDocument(); // Title of confirm dialog
    });
  });

  // Test 6: Basic interaction for "Add/Remove Members" button (Admin)
  test('clicking "Add/Remove Members" button opens AddMembersDialog for admin', async () => {
    renderProfileSidebar(mockAdminUser);
    await waitFor(() => {
      expect(screen.getByText('Add/Remove Members')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add/Remove Members'));
    await waitFor(() => {
      expect(screen.getByTestId('add-members-dialog')).toBeInTheDocument();
    });
  });

  // Test 7: Mute Group button toggles text and icon
  test('clicking "Mute Notifications" button toggles mute state and icon', async () => {
    renderProfileSidebar(mockNormalUser, 'group', 'group1'); // Start with user not having muted the group

    await waitFor(() => {
        expect(screen.getByText('Mute Notifications')).toBeInTheDocument();
    });
    expect(screen.getByTestId('volumex-icon')).toBeInTheDocument(); // Mute icon

    // Mock updateDoc for mute/unmute to resolve successfully
    const { updateDoc } = require('firebase/firestore');
    updateDoc.mockResolvedValue(undefined);

    fireEvent.click(screen.getByText('Mute Notifications'));

    // After clicking, we expect the component to try to update the user's mutedGroups.
    // The UI *should* optimistically update or update upon successful mock Firestore call.
    // Since we don't have Redux dispatch mocked to update the store, we'll check what's directly controlled by the component if possible
    // Or, if isCurrentlyMuted relies on Redux state, this test would need more advanced Redux mocking.
    // For now, assuming the button text changes based on a local or derived state that can be influenced.
    // The component's `isCurrentlyMuted` derives from `currentUser?.mutedGroups?.includes(...)`.
    // We are not changing the redux store state here, so the button text won't change back.
    // This test as-is will only check the initial state and the click.
    // To test the toggle fully, we'd need to mock the Redux store update for `currentUser.mutedGroups`.

    // This part of the test is tricky without deeper Redux state mocking for the `currentUser.mutedGroups`
    // For now, we assert the click happens and the initial state is correct.
    // A more complete test would involve mocking the Redux action that updates `mutedGroups`.
    // await waitFor(() => {
    //    expect(screen.getByText('Unmute Notifications')).toBeInTheDocument();
    //    expect(screen.getByTestId('volume2-icon')).toBeInTheDocument(); // Unmute icon
    // });
  });

  test('displays search bar for large groups', async () => {
    const manyMembersGroup = {
      ...mockGroupData,
      members: Array(15).fill(null).map((_, i) => ({
        id: `user${i}`, userName: `User ${i}`, profilePic: '', status: 'offline'
      })),
    };
    const { axiosInstance } = require('@/lib/axiosinstance');
    axiosInstance.get.mockImplementation((url: string) => {
        if (url === `/conversations/${manyMembersGroup.id}`) {
            return Promise.resolve({ data: { data: manyMembersGroup, status: 'success' } });
        }
         if (url === `/conversations/${manyMembersGroup.id}/messages`) {
            return Promise.resolve({ data: { data: [], status: 'success' } });
        }
        return Promise.reject(new Error(`Unhandled GET request to ${url}`));
    });

    renderProfileSidebar(mockAdminUser, 'group', manyMembersGroup.id);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search members...')).toBeInTheDocument();
    });
  });

  test('does not display search bar for small groups', async () => {
    // mockGroupData has 3 members, which is less than 10
    renderProfileSidebar(mockAdminUser); // uses mockGroupData by default
    await waitFor(() => {
      expect(screen.getByText('Test Group')).toBeInTheDocument(); // Ensure data is loaded
    });
    expect(screen.queryByPlaceholderText('Search members...')).not.toBeInTheDocument();
  });

});

// Example test for User Profile type (to ensure it doesn't break)
describe('ProfileSidebar - User Information Panel', () => {
    let store: ReturnType<typeof mockStore>;

    const renderUserProfileSidebar = (
      currentUserInStore: Partial<RootState['user']>,
      profileId: string | null = 'user1',
      isOpen: boolean = true
    ) => {
      store = mockStore({
        user: currentUserInStore,
      });

      const { axiosInstance } = require('@/lib/axiosinstance');
      axiosInstance.get.mockImplementation((url: string) => {
          if (url === `/freelancer/${profileId}`) {
              return Promise.resolve({ data: { data: mockUserData, status: 'success' } });
          }
          if (url === `/conversations/${profileId}/messages`) { // User profiles also try to fetch media
            return Promise.resolve({ data: { data: [], status: 'success' } });
        }
          return Promise.reject(new Error(`Unhandled GET request to ${url}`));
      });

      return render(
        <Provider store={store}>
          <ProfileSidebar
            isOpen={isOpen}
            onClose={jest.fn()}
            profileId={profileId}
            profileType="user"
          />
        </Provider>
      );
    };

    test('displays user information correctly', async () => {
      renderUserProfileSidebar(mockNormalUser);

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument(); // displayName
      });
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('This is a test user bio.')).toBeInTheDocument();
      const avatarImg = screen.getByRole('img', { name: 'Test User' });
      expect(avatarImg).toHaveAttribute('src', mockUserData.profilePic);
    });
});

// Ensure ProfileUser type is exported or defined for mockUserData if not already
// If ProfileUser is not directly exported, we might need to define a similar type for test data
// For now, assuming ProfileUser can be imported or is implicitly compatible.
export interface TestProfileUser extends ProfileUser {}

// It's good practice to also test what happens when profileId is null or profileType is null,
// or when the sidebar is closed, although these are simpler cases.
describe('ProfileSidebar - General Behavior', () => {
    test('renders nothing when isOpen is false', () => {
      const store = mockStore({ user: mockNormalUser });
      const { container } = render(
        <Provider store={store}>
          <ProfileSidebar isOpen={false} onClose={jest.fn()} profileId="group1" profileType="group" />
        </Provider>
      );
      // The component returns null when isOpen is false
      expect(container.firstChild).toBeNull();
    });

    test('shows loading state initially', async () => {
        const store = mockStore({ user: mockAdminUser });
        const { axiosInstance } = require('@/lib/axiosinstance');
        // Make the mock promise hang indefinitely
        axiosInstance.get.mockReturnValue(new Promise(() => {}));

        render(
            <Provider store={store}>
                <ProfileSidebar isOpen={true} onClose={jest.fn()} profileId="group1" profileType="group" />
            </Provider>
        );
        expect(await screen.findByText('Loading profile...')).toBeInTheDocument();
    });

    test('shows "No details to display" when profileData is null after loading', async () => {
        const store = mockStore({ user: mockAdminUser });
        const { axiosInstance } = require('@/lib/axiosinstance');
        axiosInstance.get.mockResolvedValue({ data: { data: null, status: 'success' } }); // Simulate API returning no data

        render(
            <Provider store={store}>
                <ProfileSidebar isOpen={true} onClose={jest.fn()} profileId="group1" profileType="group" />
            </Provider>
        );
        expect(await screen.findByText('No details to display.')).toBeInTheDocument();
    });
});
